"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, KeyRound } from "lucide-react";
import { changePassword } from "@/services";

export default function ChangePasswordSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại lần sau.");

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-sm flex flex-col relative overflow-hidden">
      {/* --- HEADER --- */}
      <div className="mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight mb-2 relative z-10">
          <span className="text-gray-900">THAY ĐỔI </span>
          <span className="bg-gradient-to-r from-[#FF7043] to-[#FFAB91] bg-clip-text text-transparent">
            MẬT KHẨU
          </span>
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Mật khẩu cần ít nhất 6 ký tự để bảo mật.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col justify-between"
      >
        <div className="space-y-4">
          {/* Mật khẩu cũ */}
          <div className="group/input">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-3 group-focus-within/input:text-[#F25019] transition-colors">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-300 group-focus-within/input:text-orange-400 transition-colors" />
              </div>
              <input
                type={showOld ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) =>
                  setFormData({ ...formData, oldPassword: e.target.value })
                }
                className="w-full pl-10 pr-10 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-800 font-bold focus:outline-none focus:bg-white focus:border-orange-300 focus:shadow-sm transition-all placeholder:text-gray-300 text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showOld ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="group/input">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-3 group-focus-within/input:text-[#F25019] transition-colors">
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-gray-300 group-focus-within/input:text-orange-400 transition-colors" />
              </div>
              <input
                type={showNew ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full pl-10 pr-10 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-800 font-bold focus:outline-none focus:bg-white focus:border-orange-300 focus:shadow-sm transition-all placeholder:text-gray-300 text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="group/input">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-3 group-focus-within/input:text-[#F25019] transition-colors">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {formData.confirmPassword &&
                formData.newPassword === formData.confirmPassword ? (
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <Lock className="h-4 w-4 text-gray-300 transition-colors" />
                )}
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={`w-full pl-10 pr-10 py-3 bg-white/50 border rounded-xl text-gray-800 font-bold focus:outline-none focus:bg-white focus:shadow-sm transition-all placeholder:text-gray-300 text-sm ${
                  formData.confirmPassword &&
                  formData.newPassword !== formData.confirmPassword
                    ? "border-red-200 focus:border-red-300 bg-red-50/10"
                    : "border-gray-200 focus:border-orange-300"
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <p className="text-red-500 text-[10px] mt-1.5 font-bold ml-3 flex items-center gap-1">
                  Mật khẩu không trùng khớp
                </p>
              )}
          </div>
        </div>

        {/* --- BUTTON --- */}
        <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all duration-300 transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>CẬP NHẬT MẬT KHẨU</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
