import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

export interface CloudUserProfile {
  uid: string;
  displayName: string;
  avatarEmoji: string;
  photoUrl?: string;
  studyGoal: string;
  streak: number;
  level: number;
  xp: number;
  isPro: boolean;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

async function signOutGoogle() {
  await signOut(auth);
}

async function loadCloudProfile(user: User): Promise<CloudUserProfile | null> {
  const path = `users/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      return snap.data() as CloudUserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

async function saveCloudProfile(profile: Omit<CloudUserProfile, 'uid'>): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  const sanitized = {
    displayName: (profile.displayName || user.displayName || 'Học viên').trim().slice(0, 60),
    avatarEmoji: (profile.avatarEmoji || '🧑‍💻').trim().slice(0, 16),
    photoUrl: (profile.photoUrl || user.photoURL || '').trim().slice(0, 500),
    studyGoal: (profile.studyGoal || '🎯 Duy trì chuỗi 100 ngày').trim().slice(0, 120),
    streak: Math.max(0, Math.min(1000, Math.floor(Number(profile.streak) || 1))),
    level: Math.max(1, Math.min(500, Math.floor(Number(profile.level) || 1))),
    xp: Math.max(0, Math.min(10000000, Math.floor(Number(profile.xp) || 0))),
    isPro: Boolean(profile.isPro)
  };

  try {
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, {
        ...sanitized,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(ref, {
        uid: user.uid,
        ...sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

async function saveCloudJournal(day: number, note: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;
  const safeDay = Math.max(1, Math.min(100, Math.floor(Number(day) || 1)));
  const dayId = `day_${safeDay}`;
  const path = `users/${user.uid}/journals/${dayId}`;
  const ref = doc(db, 'users', user.uid, 'journals', dayId);

  try {
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, {
        note: note.slice(0, 2000),
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(ref, {
        userId: user.uid,
        day: safeDay,
        note: note.slice(0, 2000),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

async function loadCloudJournals(): Promise<Record<number, string>> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return {};
  const path = `users/${user.uid}/journals`;
  try {
    const qSnap = await getDocs(collection(db, 'users', user.uid, 'journals'));
    const notes: Record<number, string> = {};
    qSnap.forEach((d) => {
      const data = d.data();
      if (typeof data.day === 'number' && typeof data.note === 'string') {
        notes[data.day] = data.note;
      }
    });
    return notes;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

declare global {
  interface Window {
    firebaseBridge?: {
      signInWithGoogle: () => Promise<User>;
      signOutGoogle: () => Promise<void>;
      loadCloudProfile: (user: User) => Promise<CloudUserProfile | null>;
      saveCloudProfile: (profile: Omit<CloudUserProfile, 'uid'>) => Promise<void>;
      saveCloudJournal: (day: number, note: string) => Promise<void>;
      loadCloudJournals: () => Promise<Record<number, string>>;
      onAuthChange: (cb: (user: User | null) => void) => () => void;
      getCurrentUser: () => User | null;
    };
  }
}

window.firebaseBridge = {
  signInWithGoogle,
  signOutGoogle,
  loadCloudProfile,
  saveCloudProfile,
  saveCloudJournal,
  loadCloudJournals,
  onAuthChange: (cb) => onAuthStateChanged(auth, cb),
  getCurrentUser: () => auth.currentUser
};
