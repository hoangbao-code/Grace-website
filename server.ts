import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 3000) : 3000;

interface UserProfile {
  userId: string;
  name: string;
  avatarEmoji: string;
  photoUrl: string;
  authType: 'guest' | 'google';
  studyGoal: string;
  streak: number;
  level: number;
  isPro: boolean;
  isMicMuted: boolean;
  cameraMode: 'avatar' | 'webcam';
  joinedAt: number;
}

interface RoomTimer {
  phase: 'focus' | 'break';
  focusMinutes: number;
  breakMinutes: number;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  targetEndTime: number | null;
  updatedBy: string;
}

interface RoomMusic {
  id: string;
  title: string;
  channel: string;
  duration: string;
  previewUrl: string;
  artUrl: string;
  updatedBy: string;
  updatedAt: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  time: string;
  text: string;
  isSystem: boolean;
  timestamp: number;
}

interface RoomState {
  id: string;
  title: string;
  tag: string;
  tagClass: string;
  pomoLabel: string;
  audioName: string;
  maxMembers: number;
  isVip: boolean;
  participants: Map<string, UserProfile>;
  timer: RoomTimer;
  music: RoomMusic;
  messages: ChatMessage[];
}

interface ClientSession {
  clientId: string;
  ws: WebSocket;
  user: UserProfile | null;
  roomId: string | null;
  isAlive: boolean;
}

function createInitialRooms(): Map<string, RoomState> {
  const specs = [
    {
      id: 'room-1',
      title: 'Thư viện đêm khuya • Deep Work',
      tag: 'Im lặng',
      tagClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      pomoLabel: '50m Focus / 10m Break',
      focusMinutes: 50,
      breakMinutes: 10,
      maxMembers: 24,
      audioName: '🌧️ Mưa rơi nhẹ',
      isVip: false,
      defaultTrack: {
        id: 'jfKfPfyJRdk',
        title: 'Lofi Girl — beats to relax/study to',
        channel: 'Lofi Girl',
        duration: '24/7 LIVE',
        previewUrl: '',
        artUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg'
      }
    },
    {
      id: 'room-2',
      title: 'Coder Cày Xuyên Màn Đêm ⚡',
      tag: 'Lập trình',
      tagClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      pomoLabel: '50m Focus / 10m Break',
      focusMinutes: 50,
      breakMinutes: 10,
      maxMembers: 24,
      audioName: '🧠 Sóng Alpha 10Hz',
      isVip: false,
      defaultTrack: {
        id: 'rUxyKA_-grg',
        title: 'Synthwave Radio — chill synth / retro beats',
        channel: 'Lofi Girl',
        duration: '24/7 LIVE',
        previewUrl: '',
        artUrl: 'https://img.youtube.com/vi/rUxyKA_-grg/mqdefault.jpg'
      }
    },
    {
      id: 'room-3',
      title: 'IELTS 8.0 Target • 100 Days Marathon',
      tag: 'Ngoại ngữ',
      tagClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      pomoLabel: '25m Focus / 5m Break',
      focusMinutes: 25,
      breakMinutes: 5,
      maxMembers: 24,
      audioName: '☕ Tiếng Cafe',
      isVip: false,
      defaultTrack: {
        id: '1nueKGyd9a8',
        title: 'Chillhop Radio — jazzy & lofi hip hop beats',
        channel: 'Chillhop Music',
        duration: '24/7 LIVE',
        previewUrl: '',
        artUrl: 'https://img.youtube.com/vi/1nueKGyd9a8/mqdefault.jpg'
      }
    },
    {
      id: 'room-4',
      title: 'VIP Dragon Lounge ☕ (Lo-fi & Binaural)',
      tag: 'VIP Lounge',
      tagClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      pomoLabel: '50m Focus / 10m Break',
      focusMinutes: 50,
      breakMinutes: 10,
      maxMembers: 16,
      audioName: '👑 Sóng Alpha VIP',
      isVip: true,
      defaultTrack: {
        id: '3jWRrafhO7M',
        title: 'Studio Ghibli Piano Collection',
        channel: 'Cafe Music BGM',
        duration: '3:00:00',
        previewUrl: '',
        artUrl: 'https://img.youtube.com/vi/3jWRrafhO7M/mqdefault.jpg'
      }
    },
    {
      id: 'room-5',
      title: 'Design Sprint & UI Craft',
      tag: 'Thiết kế',
      tagClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      pomoLabel: '50m Focus / 10m Break',
      focusMinutes: 50,
      breakMinutes: 10,
      maxMembers: 24,
      audioName: '🌧️ Mưa & Lo-fi',
      isVip: false,
      defaultTrack: {
        id: '7NOSDKb0HlU',
        title: 'Classical Music for Studying & Concentration',
        channel: 'HALIDONMUSIC',
        duration: '2:15:00',
        previewUrl: '',
        artUrl: 'https://img.youtube.com/vi/7NOSDKb0HlU/mqdefault.jpg'
      }
    }
  ];

  const map = new Map<string, RoomState>();
  for (const spec of specs) {
    const totalSec = spec.focusMinutes * 60;
    map.set(spec.id, {
      id: spec.id,
      title: spec.title,
      tag: spec.tag,
      tagClass: spec.tagClass,
      pomoLabel: spec.pomoLabel,
      audioName: spec.audioName,
      maxMembers: spec.maxMembers,
      isVip: spec.isVip,
      participants: new Map(),
      timer: {
        phase: 'focus',
        focusMinutes: spec.focusMinutes,
        breakMinutes: spec.breakMinutes,
        totalSeconds: totalSec,
        remainingSeconds: totalSec,
        isRunning: false,
        targetEndTime: null,
        updatedBy: 'Hệ thống'
      },
      music: {
        ...spec.defaultTrack,
        updatedBy: 'Phòng mặc định',
        updatedAt: Date.now()
      },
      messages: [
        {
          id: `sys-${spec.id}-init`,
          senderId: 'system',
          senderName: 'Hệ thống',
          senderAvatar: '🔥',
          time: formatClockTime(),
          text: `Chào mừng bạn đến với ${spec.title}! Mọi người cùng giữ tập trung nhé.`,
          isSystem: true,
          timestamp: Date.now()
        }
      ]
    });
  }
  return map;
}

function formatClockTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function sanitizeString(val: unknown, maxLen: number, fallback = ''): string {
  if (typeof val !== 'string') return fallback;
  return val.trim().slice(0, maxLen) || fallback;
}

function sanitizeUser(raw: unknown, clientId: string): UserProfile {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const rawId = sanitizeString(obj.userId, 128, clientId);
  const safeId = /^[a-zA-Z0-9_\-]+$/.test(rawId) ? rawId : clientId;
  return {
    userId: safeId,
    name: sanitizeString(obj.name, 40, 'Bạn mới'),
    avatarEmoji: sanitizeString(obj.avatarEmoji, 16, '🧑‍💻'),
    photoUrl: sanitizeString(obj.photoUrl, 500, ''),
    authType: obj.authType === 'google' ? 'google' : 'guest',
    studyGoal: sanitizeString(obj.studyGoal, 100, '🎯 Đang tập trung học bài'),
    streak: typeof obj.streak === 'number' && Number.isFinite(obj.streak) ? Math.max(0, Math.min(1000, Math.floor(obj.streak))) : 1,
    level: typeof obj.level === 'number' && Number.isFinite(obj.level) ? Math.max(1, Math.min(500, Math.floor(obj.level))) : 1,
    isPro: Boolean(obj.isPro),
    isMicMuted: obj.isMicMuted !== false,
    cameraMode: obj.cameraMode === 'webcam' ? 'webcam' : 'avatar',
    joinedAt: typeof obj.joinedAt === 'number' ? obj.joinedAt : Date.now()
  };
}

function getEffectiveTimer(room: RoomState): { timer: RoomTimer; phaseChanged: boolean } {
  const t = room.timer;
  if (!t.isRunning || !t.targetEndTime) {
    return { timer: t, phaseChanged: false };
  }
  const now = Date.now();
  const remaining = Math.ceil((t.targetEndTime - now) / 1000);
  if (remaining > 0) {
    return {
      timer: { ...t, remainingSeconds: remaining },
      phaseChanged: false
    };
  }
  // Phase completed -> auto transition
  const nextPhase: 'focus' | 'break' = t.phase === 'focus' ? 'break' : 'focus';
  const nextSeconds = (nextPhase === 'focus' ? t.focusMinutes : t.breakMinutes) * 60;
  room.timer = {
    ...t,
    phase: nextPhase,
    totalSeconds: nextSeconds,
    remainingSeconds: nextSeconds,
    isRunning: true,
    targetEndTime: now + nextSeconds * 1000,
    updatedBy: 'Hệ thống'
  };
  return { timer: room.timer, phaseChanged: true };
}

function getRoomsSummary(rooms: Map<string, RoomState>) {
  return Array.from(rooms.values()).map((room) => {
    const { timer } = getEffectiveTimer(room);
    const participantsArr = Array.from(room.participants.values());
    return {
      id: room.id,
      title: room.title,
      tag: room.tag,
      tagClass: room.tagClass,
      pomoLabel: room.pomoLabel,
      audioName: room.audioName,
      maxMembers: room.maxMembers,
      isVip: room.isVip,
      membersCount: participantsArr.length,
      activePeersPreview: participantsArr.slice(0, 5).map((p) => ({
        userId: p.userId,
        name: p.name,
        avatarEmoji: p.avatarEmoji,
        photoUrl: p.photoUrl
      })),
      timer,
      musicTitle: room.music.title
    };
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const rooms = createInitialRooms();
  const clients = new Map<string, ClientSession>();

  function sendJson(ws: WebSocket, payload: unknown) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }

  function broadcastAll(payload: unknown) {
    const raw = JSON.stringify(payload);
    for (const client of clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(raw);
      }
    }
  }

  function broadcastRoom(roomId: string, payload: unknown, excludeClientId?: string) {
    const raw = JSON.stringify(payload);
    for (const client of clients.values()) {
      if (client.roomId === roomId && client.clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(raw);
      }
    }
  }

  function broadcastLobbyStats() {
    broadcastAll({
      type: 'lobby:stats',
      rooms: getRoomsSummary(rooms),
      serverTime: Date.now()
    });
  }

  function pushSystemChat(room: RoomState, text: string) {
    const msg: ChatMessage = {
      id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: 'system',
      senderName: 'Hệ thống',
      senderAvatar: '✨',
      time: formatClockTime(),
      text,
      isSystem: true,
      timestamp: Date.now()
    };
    room.messages.push(msg);
    if (room.messages.length > 60) {
      room.messages = room.messages.slice(-60);
    }
    broadcastRoom(room.id, { type: 'room:chat_message', roomId: room.id, message: msg });
  }

  function leaveCurrentRoom(session: ClientSession) {
    if (!session.roomId) return;
    const prevRoom = rooms.get(session.roomId);
    const oldRoomId = session.roomId;
    session.roomId = null;

    if (prevRoom && session.user) {
      // Only remove if no other open connection belongs to same userId in that room
      let stillConnectedElsewhere = false;
      for (const other of clients.values()) {
        if (other.clientId !== session.clientId && other.roomId === oldRoomId && other.user?.userId === session.user.userId) {
          stillConnectedElsewhere = true;
          break;
        }
      }
      if (!stillConnectedElsewhere) {
        prevRoom.participants.delete(session.user.userId);
        broadcastRoom(oldRoomId, {
          type: 'room:participants',
          roomId: oldRoomId,
          participants: Array.from(prevRoom.participants.values())
        });
        pushSystemChat(prevRoom, `${session.user.name} đã rời phòng học.`);
      }
      broadcastLobbyStats();
    }
  }

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    const clientId = `cli-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const session: ClientSession = {
      clientId,
      ws,
      user: null,
      roomId: null,
      isAlive: true
    };
    clients.set(clientId, session);

    ws.on('pong', () => {
      session.isAlive = true;
    });

    sendJson(ws, {
      type: 'welcome',
      clientId,
      serverTime: Date.now(),
      rooms: getRoomsSummary(rooms)
    });

    ws.on('message', (data) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(data.toString()) as Record<string, unknown>;
      } catch {
        return;
      }

      const type = msg.type;
      if (typeof type !== 'string') return;

      if (type === 'ping') {
        sendJson(ws, { type: 'pong', serverTime: Date.now() });
        return;
      }

      if (type === 'hello' || type === 'user:update_profile') {
        const prevUser = session.user;
        const nextUser = sanitizeUser(msg.user, clientId);
        session.user = nextUser;

        if (session.roomId) {
          const room = rooms.get(session.roomId);
          if (room) {
            if (prevUser && prevUser.userId !== nextUser.userId) {
              room.participants.delete(prevUser.userId);
            }
            room.participants.set(nextUser.userId, nextUser);
            broadcastRoom(room.id, {
              type: 'room:participants',
              roomId: room.id,
              participants: Array.from(room.participants.values())
            });
            broadcastLobbyStats();
          }
        }
        return;
      }

      if (type === 'room:join') {
        const targetRoomId = sanitizeString(msg.roomId, 64);
        const room = rooms.get(targetRoomId);
        if (!room) return;

        if (msg.user) {
          session.user = sanitizeUser(msg.user, clientId);
        } else if (!session.user) {
          session.user = sanitizeUser({}, clientId);
        }

        if (session.roomId && session.roomId !== targetRoomId) {
          leaveCurrentRoom(session);
        }

        const alreadyInRoom = room.participants.has(session.user.userId);
        session.roomId = targetRoomId;
        session.user.joinedAt = alreadyInRoom ? (room.participants.get(session.user.userId)?.joinedAt || Date.now()) : Date.now();
        room.participants.set(session.user.userId, session.user);

        const { timer } = getEffectiveTimer(room);

        // Send authoritative full state to joining client
        sendJson(ws, {
          type: 'room:state',
          roomId: room.id,
          serverTime: Date.now(),
          room: {
            id: room.id,
            title: room.title,
            tag: room.tag,
            isVip: room.isVip
          },
          participants: Array.from(room.participants.values()),
          timer,
          music: room.music,
          messages: room.messages
        });

        // Notify other room participants
        broadcastRoom(
          room.id,
          {
            type: 'room:participants',
            roomId: room.id,
            participants: Array.from(room.participants.values())
          },
          clientId
        );

        if (!alreadyInRoom) {
          pushSystemChat(room, `${session.user.avatarEmoji} ${session.user.name} đã vào phòng học.`);
        }
        broadcastLobbyStats();
        return;
      }

      if (type === 'room:leave') {
        leaveCurrentRoom(session);
        return;
      }

      if (type === 'room:chat') {
        if (!session.roomId || !session.user) return;
        const room = rooms.get(session.roomId);
        if (!room) return;
        const text = sanitizeString(msg.text, 500);
        if (!text) return;

        const chatMsg: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          senderId: session.user.userId,
          senderName: session.user.name,
          senderAvatar: session.user.avatarEmoji,
          time: formatClockTime(),
          text,
          isSystem: false,
          timestamp: Date.now()
        };
        room.messages.push(chatMsg);
        if (room.messages.length > 60) {
          room.messages = room.messages.slice(-60);
        }
        broadcastRoom(room.id, { type: 'room:chat_message', roomId: room.id, message: chatMsg });
        return;
      }

      if (type === 'room:emoji') {
        if (!session.roomId || !session.user) return;
        const emoji = sanitizeString(msg.emoji, 16);
        if (!emoji) return;
        broadcastRoom(session.roomId, {
          type: 'room:emoji_burst',
          roomId: session.roomId,
          emoji,
          senderId: session.user.userId,
          senderName: session.user.name
        });
        return;
      }

      if (type === 'room:poke') {
        if (!session.roomId || !session.user) return;
        const room = rooms.get(session.roomId);
        if (!room) return;
        const targetUserId = sanitizeString(msg.targetUserId, 128);
        const targetUser = room.participants.get(targetUserId);
        const targetName = targetUser ? targetUser.name : sanitizeString(msg.targetName, 40, 'Đồng đội');
        const isUrgent = Boolean(msg.isUrgent);

        broadcastRoom(room.id, {
          type: 'room:poke_event',
          roomId: room.id,
          fromUserId: session.user.userId,
          fromName: session.user.name,
          targetUserId,
          targetName,
          isUrgent
        });
        return;
      }

      if (type === 'timer:action') {
        if (!session.roomId || !session.user) return;
        const room = rooms.get(session.roomId);
        if (!room) return;

        const action = sanitizeString(msg.action, 32);
        const now = Date.now();
        const { timer } = getEffectiveTimer(room);

        if (action === 'toggle') {
          if (timer.isRunning) {
            room.timer = {
              ...timer,
              isRunning: false,
              targetEndTime: null,
              updatedBy: session.user.name
            };
          } else {
            const secs = timer.remainingSeconds > 0 ? timer.remainingSeconds : timer.totalSeconds;
            room.timer = {
              ...timer,
              remainingSeconds: secs,
              isRunning: true,
              targetEndTime: now + secs * 1000,
              updatedBy: session.user.name
            };
          }
        } else if (action === 'skip') {
          const nextPhase: 'focus' | 'break' = timer.phase === 'focus' ? 'break' : 'focus';
          const nextSeconds = (nextPhase === 'focus' ? timer.focusMinutes : timer.breakMinutes) * 60;
          room.timer = {
            ...timer,
            phase: nextPhase,
            totalSeconds: nextSeconds,
            remainingSeconds: nextSeconds,
            isRunning: timer.isRunning,
            targetEndTime: timer.isRunning ? now + nextSeconds * 1000 : null,
            updatedBy: session.user.name
          };
        } else if (action === 'reset') {
          const resetSeconds = (timer.phase === 'focus' ? timer.focusMinutes : timer.breakMinutes) * 60;
          room.timer = {
            ...timer,
            totalSeconds: resetSeconds,
            remainingSeconds: resetSeconds,
            isRunning: false,
            targetEndTime: null,
            updatedBy: session.user.name
          };
        } else if (action === 'set_preset') {
          const mins = msg.focusMinutes === 25 ? 25 : 50;
          const breakMins = mins === 25 ? 5 : 10;
          const totalSecs = mins * 60;
          room.timer = {
            phase: 'focus',
            focusMinutes: mins,
            breakMinutes: breakMins,
            totalSeconds: totalSecs,
            remainingSeconds: totalSecs,
            isRunning: false,
            targetEndTime: null,
            updatedBy: session.user.name
          };
          room.pomoLabel = `${mins}m Focus / ${breakMins}m Break`;
        }

        broadcastRoom(room.id, {
          type: 'timer:sync',
          roomId: room.id,
          timer: room.timer,
          serverTime: now,
          triggeredBy: session.user.name,
          action
        });
        broadcastLobbyStats();
        return;
      }

      if (type === 'music:change') {
        if (!session.roomId || !session.user) return;
        const room = rooms.get(session.roomId);
        if (!room) return;
        const rawTrack = (msg.track && typeof msg.track === 'object' ? msg.track : {}) as Record<string, unknown>;
        const title = sanitizeString(rawTrack.title, 120);
        if (!title) return;

        room.music = {
          id: sanitizeString(rawTrack.id, 64, 'search'),
          title,
          channel: sanitizeString(rawTrack.channel, 80, 'YouTube Music'),
          duration: sanitizeString(rawTrack.duration, 24, 'LIVE'),
          previewUrl: sanitizeString(rawTrack.previewUrl, 500, ''),
          artUrl: sanitizeString(rawTrack.artUrl, 500, ''),
          updatedBy: session.user.name,
          updatedAt: Date.now()
        };

        broadcastRoom(room.id, {
          type: 'music:sync',
          roomId: room.id,
          music: room.music,
          triggeredBy: session.user.name
        });
        broadcastLobbyStats();
      }
    });

    ws.on('close', () => {
      leaveCurrentRoom(session);
      clients.delete(clientId);
    });
  });

  // Heartbeat to prune dead sockets cleanly
  const heartbeatInterval = setInterval(() => {
    for (const [cid, session] of clients.entries()) {
      if (!session.isAlive) {
        leaveCurrentRoom(session);
        session.ws.terminate();
        clients.delete(cid);
        continue;
      }
      session.isAlive = false;
      session.ws.ping();
    }
  }, 25000);

  // Authoritative timer phase transition checker (runs once per second)
  const timerTickInterval = setInterval(() => {
    for (const room of rooms.values()) {
      if (room.participants.size === 0 || !room.timer.isRunning) continue;
      const { timer, phaseChanged } = getEffectiveTimer(room);
      if (phaseChanged) {
        broadcastRoom(room.id, {
          type: 'timer:sync',
          roomId: room.id,
          timer,
          serverTime: Date.now(),
          triggeredBy: 'Hệ thống',
          action: 'phase_complete'
        });
      }
    }
  }, 1000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
    clearInterval(timerTickInterval);
  });

  // REST API Routes
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, connectedClients: clients.size });
  });

  app.get('/api/rooms', (_req, res) => {
    res.json({ rooms: getRoomsSummary(rooms), serverTime: Date.now() });
  });

  app.get('/api/youtube/search', async (req, res) => {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) {
      res.status(400).json({ error: 'Missing query q' });
      return;
    }

    try {
      const ytRes = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });
      const html = await ytRes.text();
      const idMatches = new Set<string>();
      const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(html)) !== null) {
        idMatches.add(m[1]);
        if (idMatches.size >= 8) break;
      }
      const videoIds = Array.from(idMatches);
      res.json({
        query,
        videoId: videoIds[0] || null,
        videoIds
      });
    } catch (err) {
      console.warn('YouTube search proxy failed:', err);
      res.json({ query, videoId: null, videoIds: [] });
    }
  });

  // Vite middleware in dev (without HMR port 24678 collision), static dist in production
  let viteInstance: { middlewares: express.RequestHandler; close: () => Promise<void> } | null = null;

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const viteReady = import('vite').then(({ createServer: createViteServer }) =>
      createViteServer({
        server: { middlewareMode: true, hmr: false, ws: false },
        appType: 'spa'
      })
    );

    viteReady
      .then((vite) => {
        viteInstance = vite;
      })
      .catch((err) => {
        console.error('Vite middleware initialization failed:', err);
        process.exit(1);
      });

    app.use(async (req, res, next) => {
      try {
        const vite = viteInstance || (await viteReady);
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  }

  server.on('error', (err) => {
    console.error('HTTP server error:', err);
    process.exit(1);
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT} (http://0.0.0.0:${PORT})`);
  });

  const shutdown = async () => {
    clearInterval(heartbeatInterval);
    clearInterval(timerTickInterval);
    for (const client of clients.values()) {
      try {
        client.ws.terminate();
      } catch {}
    }
    try {
      wss.close();
    } catch {}
    if (viteInstance) {
      try {
        await viteInstance.close();
      } catch {}
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1000).unref();
  };

  process.once('SIGTERM', () => void shutdown());
  process.once('SIGINT', () => void shutdown());
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
