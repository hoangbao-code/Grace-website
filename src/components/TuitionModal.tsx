import React, { useState } from 'react';
import { X, Crown, QrCode, ShieldCheck } from 'lucide-react';
import { ClubUser } from '../types';
import { audioEngine } from '../services/audioService';

interface TuitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ClubUser;
  onConfirmPayment: () => void;
  onShowToast: (text: string, type?: 'indigo' | 'emerald' | 'amber') => void;
}

export const TuitionModal: React.FC<TuitionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onConfirmPayment,
  onShowToast,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number; label: string }>({
    name: '1 Tháng Sinh Hoạt CLB',
    price: 149000,
    label: '149.000đ',
  });
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const bankAccount = '0354084364';
  const bankName = 'MBBank (Ngân hàng Quân Đội)';
  const accountHolder = 'HOANG XUAN GIA BAO';
  const transferContent = `HPCLB ${currentUser.name.toUpperCase().replace(/\s+/g, '')}`;

  // VietQR Quick Link
  const qrUrl = `https://img.vietqr.io/image/MB-${bankAccount}-compact2.png?amount=${selectedPlan.price}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(accountHolder)}`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankAccount);
    setCopied(true);
    onShowToast(`Đã sao chép số tài khoản: ${bankAccount}`, 'emerald');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    onConfirmPayment();
    audioEngine.playTaskVictory();
    onShowToast('🎉 Đã gửi xác nhận học phí! Admin sẽ duyệt và gửi email biên lai cho bạn.', 'emerald');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-button text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>HỌC PHÍ THÀNH VIÊN CLB TIẾNG ANH</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Nộp Học Phí & Kích Hoạt Thẻ Học Viên
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Học viên: <strong className="text-white">{currentUser.name}</strong> • Email:{' '}
            <strong className="text-indigo-300 font-mono">{currentUser.email}</strong>
          </p>
        </div>

        {/* 3 Tuition Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: '1 Tháng Sinh Hoạt CLB', price: 149000, label: '149.000đ', period: '30 ngày' },
            {
              name: 'Khóa 3 Tháng (Tiết Kiệm)',
              price: 399000,
              label: '399.000đ',
              period: '90 ngày (Hot 🔥)',
            },
            { name: 'Thẻ VIP 1 Năm', price: 999000, label: '999.000đ', period: '365 ngày' },
          ].map((plan, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPlan(plan)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedPlan.price === plan.price
                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
              }`}
            >
              <div>
                <p className="text-xs font-bold">{plan.name}</p>
                <p className="text-lg font-extrabold text-amber-400 mt-1">{plan.label}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">{plan.period}</span>
            </div>
          ))}
        </div>

        {/* VietQR Payment Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/70 p-5 rounded-2xl border border-white/10 items-center">
          {/* QR Image */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-48 h-48 bg-white p-2 rounded-2xl shadow-xl flex items-center justify-center">
              <img src={qrUrl} alt="VietQR Thanh Toán" className="w-full h-full object-contain" />
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quét mã trên app mọi Ngân hàng</span>
            </span>
          </div>

          {/* Transfer Details */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px]">Ngân hàng thụ hưởng:</span>
              <p className="font-bold text-white text-sm">{bankName}</p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px]">Chủ tài khoản:</span>
              <p className="font-bold text-white text-sm">{accountHolder}</p>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-white/5">
              <div>
                <span className="text-slate-400 text-[10px]">Số tài khoản:</span>
                <p className="font-mono font-bold text-amber-400 text-sm">{bankAccount}</p>
              </div>
              <button
                onClick={handleCopyAccount}
                className="px-2.5 py-1 rounded-lg glass-button text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                {copied ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>

            <div>
              <span className="text-slate-400 text-[10px]">Nội dung chuyển khoản (Bắt buộc):</span>
              <p className="font-mono font-bold text-emerald-400 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/30 text-xs">
                {transferContent}
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px]">Số tiền cần thanh toán:</span>
              <p className="text-base font-extrabold text-amber-300">{selectedPlan.label}</p>
            </div>
          </div>
        </div>

        {/* Confirmation Button */}
        <div className="space-y-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tôi Đã Chuyển Khoản Học Phí Xong</span>
          </button>
          <p className="text-[10px] text-slate-400 text-center">
            Hệ thống sẽ đối soát giao dịch và kích hoạt thẻ học viên chính thức trong vòng 1-3 phút.
          </p>
        </div>
      </div>
    </div>
  );
};
