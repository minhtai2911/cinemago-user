"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
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
    } catch {
      toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-white/90 rounded-2xl p-6 shadow-xl border border-white/30 soft-shadow">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-bold text-[#1f2937]">Đổi mật khẩu</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu cũ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm pr-12"
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-red-400 transition"
            >
              {showOld ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm pr-12"
              placeholder="Tối thiểu 6 ký tự"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-red-400 transition"
            >
              {showNew ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className={`appearance-none rounded-md block w-full px-3 py-2 pr-12 transition bg-white text-gray-900 placeholder-gray-400 sm:text-sm ${
                formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword
                  ? "border-red-400 focus:ring-red-300"
                  : "border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
              }`}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-red-400 transition"
            >
              {showConfirm ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
          </div>
          {formData.confirmPassword &&
            formData.newPassword !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">Mật khẩu không khớp</p>
            )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#F25019] to-[#E9391B] hover:from-[#E9391B] hover:to-[#F25019] text-white font-semibold text-sm px-4 py-2 rounded-md shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>Đổi mật khẩu</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
