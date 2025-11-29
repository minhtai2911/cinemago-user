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
    <div className="mt-16 bg-white rounded-3xl p-10 shadow-2xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800">Đổi mật khẩu</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Mật khẩu cũ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition pr-14"
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-purple-600 transition"
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition pr-14"
              placeholder="Tối thiểu 6 ký tự"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-purple-600 transition"
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className={`w-full px-6 py-5 text-lg border-2 rounded-2xl pr-14 transition ${
                formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-purple-300 focus:border-purple-500"
              }`}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-purple-600 transition"
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

        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-20 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>ĐỔI MẬT KHẨU</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
