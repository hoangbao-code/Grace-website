import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Video,
  DollarSign,
  UserCheck,
  PlusCircle,
  Trash2,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from 'lucide-react';
import { ClubUser, EnglishRoom } from '../types';

interface AdminDashboardProps {
  currentUser: ClubUser;
  users: ClubUser[];
  rooms: EnglishRoom[];
  onToggleUserRole: (userId: string, newRole: 'leader' | 'student') => void;
  onToggleTuitionStatus: (userId: string, newStatus: 'paid' | 'unpaid') => void;
  onCloseRoom: (roomId: string) => void;
  onCreateRoomModal: () => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber' | 'rose') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  rooms,
  onToggleUserRole,
  onToggleTuitionStatus,
  onCloseRoom,
  onCreateRoomModal,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'leaders' | 'students'>('rooms');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalLeaders = users.filter((u) => u.role === 'leader').length;
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const activeRooms = rooms.filter((r) => r.isLive).length;
  const paidStudents = users.filter((u) => u.tuitionStatus === 'paid' && u.role === 'student').length;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery))
  );

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6">
      {/* Top Admin Header */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-purple-500/30 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>TRANG QUẢN TRỊ ADMIN CLB TIẾNG ANH (CHỦ NHIỆM BẢO)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Quản Lý Hệ Thống CLB, Leaders & Học Phí
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Kiểm soát toàn bộ các phòng học theo cấp độ, danh sách giáo viên chủ trì và trạng thái học viên.
            </p>
          </div>

          <button
            onClick={onCreateRoomModal}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Mở Phòng Mới Với Tư Cách Leader</span>
          </button>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Tổng phòng đang mở</span>
              <Video className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-extrabold text-white">
              {activeRooms} <span className="text-xs text-slate-400 font-normal">/ {rooms.length} phòng</span>
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Đội ngũ Leader / Cô giáo</span>
              <UserCheck className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-extrabold text-white">{totalLeaders} Leaders</p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Tổng số học viên</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl font-extrabold text-white">{totalStudents} Học viên</p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Đã hoàn thành học phí</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-extrabold text-emerald-400">
              {paidStudents} / {totalStudents} <span className="text-[11px] text-slate-400">bạn</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'rooms' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quản Lý Phòng Học ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('leaders')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'leaders' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quản Lý Leaders ({totalLeaders})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'students' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Học Viên & Học Phí ({totalStudents})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* TAB 1: ROOMS MANAGEMENT */}
      {activeTab === 'rooms' && (
        <div className="glass-panel rounded-2xl p-5 overflow-x-auto space-y-4">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Phòng Học & Cấp Độ</th>
                <th className="pb-3 px-3">Leader Chủ Trì</th>
                <th className="pb-3 px-3">Học Viên</th>
                <th className="pb-3 px-3">Trạng Thái</th>
                <th className="pb-3 px-3 text-right">Thao Tác Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-white text-sm">{room.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                        {room.levelLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{room.code}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                        {room.leaderAvatar}
                      </div>
                      <span className="font-semibold text-slate-200">{room.leaderName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">
                    {room.membersCount}/{room.maxMembers} bạn
                  </td>
                  <td className="py-3 px-3">
                    {room.isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>Đang Diễn Ra</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                        {room.scheduledTime || 'Chưa mở'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        onCloseRoom(room.id);
                        onShowToast(`Đã đóng phòng học: ${room.title}`, 'slate');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Đóng phòng</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: LEADERS MANAGEMENT */}
      {activeTab === 'leaders' && (
        <div className="glass-panel rounded-2xl p-5 overflow-x-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>Danh sách những người có quyền duy nhất để mở phòng và điều hành lớp học.</span>
            <span className="text-amber-400 font-bold">Chỉ Admin mới có thể phân quyền Leader</span>
          </div>

          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Họ Và Tên</th>
                <th className="pb-3 px-3">Email & SĐT</th>
                <th className="pb-3 px-3">Cấp Độ Phụ Trách</th>
                <th className="pb-3 px-3">Vai Trò</th>
                <th className="pb-3 px-3 text-right">Cấp / Hủy Quyền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers
                .filter((u) => u.role === 'leader' || u.role === 'admin')
                .map((leader) => (
                  <tr key={leader.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-extrabold flex items-center justify-center text-xs">
                          {leader.avatarText}
                        </div>
                        <div>
                          <p className="font-bold text-white">{leader.name}</p>
                          <span className="text-[10px] text-slate-400">Tham gia: {leader.joinDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      <div>{leader.email}</div>
                      <div className="text-[10px] text-slate-500">{leader.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[10px] font-semibold border border-indigo-500/25 uppercase">
                        {leader.level}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          leader.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {leader.role === 'admin' ? '👑 TỔNG QUẢN ADMIN' : '⭐ LEADER CHỦ TRÌ'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {leader.role !== 'admin' && (
                        <button
                          onClick={() => {
                            onToggleUserRole(leader.id, 'student');
                            onShowToast(`Đã thu hồi quyền Leader của ${leader.name}`, 'slate');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          Thu hồi quyền
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: STUDENTS & TUITION MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="glass-panel rounded-2xl p-5 overflow-x-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>Danh sách học viên đăng ký, cấp độ tiếng Anh và tình trạng nộp học phí.</span>
          </div>

          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Học Viên</th>
                <th className="pb-3 px-3">Cấp Độ Phân Lớp</th>
                <th className="pb-3 px-3">Học Phí CLB</th>
                <th className="pb-3 px-3">Cấp Quyền Leader</th>
                <th className="pb-3 px-3 text-right">Xác Nhận Học Phí</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers
                .filter((u) => u.role === 'student')
                .map((student) => (
                  <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 font-bold flex items-center justify-center text-xs border border-white/10">
                          {student.avatarText}
                        </div>
                        <div>
                          <p className="font-bold text-white">{student.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[10px] font-bold uppercase">
                        {student.level}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {student.tuitionStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" />
                          <span>Đã Nộp Phí</span>
                        </span>
                      ) : student.tuitionStatus === 'trial' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          <span>Dùng Thử 3 Ngày</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          <span>Chưa Nộp Phí</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => {
                          onToggleUserRole(student.id, 'leader');
                          onShowToast(`Đã thăng hạng "${student.name}" thành Leader mở phòng!`, 'amber');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        + Thăng Leader
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          const nextStatus = student.tuitionStatus === 'paid' ? 'unpaid' : 'paid';
                          onToggleTuitionStatus(student.id, nextStatus);
                          onShowToast(
                            nextStatus === 'paid'
                              ? `Đã xác nhận học phí cho học viên ${student.name}!`
                              : `Đã chuyển ${student.name} về Chưa đóng phí!`,
                            nextStatus === 'paid' ? 'emerald' : 'slate'
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          student.tuitionStatus === 'paid'
                            ? 'bg-slate-800 text-slate-400 hover:text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        {student.tuitionStatus === 'paid' ? 'Hủy duyệt phí' : 'Duyệt đóng tiền'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};
