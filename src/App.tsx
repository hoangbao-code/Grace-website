import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { IntroView } from './components/IntroView';
import { LobbyView } from './components/LobbyView';
import { RoomView } from './components/RoomView';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { TuitionModal } from './components/TuitionModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ToastContainer } from './components/ToastContainer';
import { INITIAL_ROOMS, INITIAL_USERS, DEFAULT_GUEST_USER } from './data/mockData';
import { ChatMessage, ClubUser, EnglishRoom, ToastMessage } from './types';

export default function App() {
  // Global State - Default to 'intro' landing page when first entering
  const [currentView, setCurrentView] = useState<'intro' | 'lobby' | 'room' | 'admin'>('intro');
  const [users, setUsers] = useState<ClubUser[]>(INITIAL_USERS);
  
  // Ghi nhớ người dùng / Admin vào hệ thống từ đầu
  const [currentUser, setCurrentUser] = useState<ClubUser>(() => {
    try {
      const saved = localStorage.getItem('grace_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_GUEST_USER;
  });

  const [rooms, setRooms] = useState<EnglishRoom[]>(INITIAL_ROOMS);
  const [currentRoom, setCurrentRoom] = useState<EnglishRoom>(INITIAL_ROOMS[0]);

  // Modals & Profile
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isTuitionModalOpen, setIsTuitionModalOpen] = useState<boolean>(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [profileTargetUser, setProfileTargetUser] = useState<ClubUser>(DEFAULT_GUEST_USER);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Chat in active room
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'Hệ Thống', text: 'Chào mừng bạn đến với phòng luyện nói Fluently Club!', time: '19:30', isSystem: true },
    { id: 2, sender: 'Cô Hoàng Lan Anh', text: 'Hello everyone! Please raise your hand if you want to answer question 1.', time: '19:32' },
    { id: 3, sender: 'Bạn Học Viên', text: 'Cô ơi cho em hỏi từ "Delicacy" nhấn trọng âm ở đâu ạ?', time: '19:35' },
  ]);

  // Toast Notification
  const showToast = (text: string, type: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' = 'indigo') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Join Room - CHẶN HOÀN TOÀN KHI CHƯA ĐĂNG NHẬP / ĐĂNG KÝ
  const handleJoinRoom = (room: EnglishRoom) => {
    if (currentUser.id === 'guest-user') {
      setIsLoginModalOpen(true);
      showToast('Bạn chưa đăng nhập! Vui lòng đăng nhập hoặc đăng ký tài khoản để vào phòng học.', 'amber');
      return;
    }
    setCurrentRoom(room);
    setCurrentView('room');
    showToast(`Đã tham gia phòng học "${room.title}"`, 'indigo');
  };

  // Create Room (Host Leader or Admin)
  const handleCreateRoom = (newRoom: EnglishRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
    setCurrentRoom(newRoom);
    setCurrentView('room');
  };

  // Close Room (Admin action)
  const handleCloseRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    if (currentRoom.id === roomId) {
      setCurrentView('lobby');
    }
  };

  // Promote / Demote Leader role
  const handleToggleUserRole = (userId: string, newRole: 'leader' | 'student') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser.id === userId) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      localStorage.setItem('grace_current_user', JSON.stringify(updatedUser));
    }
  };

  // Toggle Tuition Paid Status
  const handleToggleTuitionStatus = (userId: string, newStatus: 'paid' | 'unpaid') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, tuitionStatus: newStatus } : u))
    );
    if (currentUser.id === userId) {
      const updatedUser = { ...currentUser, tuitionStatus: newStatus };
      setCurrentUser(updatedUser);
      localStorage.setItem('grace_current_user', JSON.stringify(updatedUser));
    }
  };

  // Login Handler (Persist to localStorage)
  const handleLoginSuccess = (user: ClubUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('grace_current_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('lobby');
    }
  };

  // Register New Student (Persist to localStorage)
  const handleRegisterUser = (newUser: ClubUser) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    try {
      localStorage.setItem('grace_current_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    setCurrentView('lobby');
  };

  // Logout Handler (Clear localStorage)
  const handleLogout = () => {
    setCurrentUser(DEFAULT_GUEST_USER);
    try {
      localStorage.removeItem('grace_current_user');
    } catch (e) {
      console.error(e);
    }
    if (currentView === 'admin' || currentView === 'room') {
      setCurrentView('intro');
    }
    showToast('Đã đăng xuất tài khoản thành công', 'slate');
  };

  // Open Profile Modal
  const handleOpenProfile = (targetUser?: ClubUser) => {
    setProfileTargetUser(targetUser || currentUser);
    setIsProfileModalOpen(true);
  };

  // Send message in room
  const handleSendChatMessage = (text: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: currentUser.name,
      role: currentUser.role,
      text,
      time: timeStr,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>

      {/* Floating Toast Notification */}
      <ToastContainer toasts={toasts} />

      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onSwitchView={setCurrentView}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenTuitionModal={() => setIsTuitionModalOpen(true)}
        onOpenProfileModal={handleOpenProfile}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <div className="relative z-10 flex-1 flex flex-col">
        {currentView === 'intro' ? (
          /* TRANG GIỚI THIỆU MẶC ĐỊNH VỚI NÚT LỚN VÀO SẢNH */
          <IntroView
            onGoToLobby={() => setCurrentView('lobby')}
            onOpenTuitionModal={() => setIsTuitionModalOpen(true)}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            isLoggedIn={currentUser.id !== 'guest-user'}
          />
        ) : currentView === 'lobby' ? (
          /* SẢNH PHÒNG HỌC */
          <LobbyView
            currentUser={currentUser}
            rooms={rooms}
            onJoinRoom={handleJoinRoom}
            onCreateRoomModal={() => setIsCreateRoomModalOpen(true)}
            onShowToast={showToast}
          />
        ) : currentView === 'room' ? (
          /* PHÒNG LUYỆN NÓI */
          <RoomView
            room={currentRoom}
            currentUser={currentUser}
            chatMessages={chatMessages}
            onBackToLobby={() => setCurrentView('lobby')}
            onSendChatMessage={handleSendChatMessage}
            onShowToast={showToast}
          />
        ) : (
          /* QUẢN TRỊ ADMIN BẢO */
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            rooms={rooms}
            onToggleUserRole={handleToggleUserRole}
            onToggleTuitionStatus={handleToggleTuitionStatus}
            onCloseRoom={handleCloseRoom}
            onCreateRoomModal={() => setIsCreateRoomModalOpen(true)}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterUser}
        onShowToast={showToast}
      />

      <TuitionModal
        isOpen={isTuitionModalOpen}
        onClose={() => setIsTuitionModalOpen(false)}
        currentUser={currentUser}
        onConfirmPayment={() => {
          handleToggleTuitionStatus(currentUser.id, 'paid');
        }}
        onShowToast={showToast}
      />

      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        currentUser={currentUser}
        onCreateRoom={handleCreateRoom}
        onShowToast={showToast}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={profileTargetUser}
        isSelf={profileTargetUser.id === currentUser.id}
        onLogout={handleLogout}
        onOpenTuitionModal={() => setIsTuitionModalOpen(true)}
      />
    </div>
  );
}
