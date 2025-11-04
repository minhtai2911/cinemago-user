"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { resetPassword, forgotPassword } from "@/services";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const { isLogged } = useAuth();

  const [formData, setFormData] = useState({
    email: emailParam,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(180);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!emailParam) {
      toast.error(
        "Thiếu email, vui lòng thực hiện lại quy trình quên mật khẩu"
      );
      router.push("/forgot-password");
    }
  }, [emailParam, router]);

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      await forgotPassword({ email: formData.email });
      toast.success("Đã gửi lại mã OTP, vui lòng kiểm tra email!");
      setCountdown(180);
    } catch {
      toast.error("Không thể gửi lại OTP, vui lòng thử lại sau.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(formData);
      toast.success("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        switch (error.response?.status) {
          case 400:
            toast.error("Mã OTP không hợp lệ hoặc đã hết hạn.");
            break;
          case 404:
            toast.error("Email không tồn tại trong hệ thống.");
            break;
          default:
            toast.error("Đặt lại mật khẩu thất bại.");
        }
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

   if (isLogged) {
    router.push("/");
    return null;
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg space-y-6">
        <h2 className="text-center text-2xl font-bold text-red-500">
          Đặt lại mật khẩu
        </h2>
        <p className="text-gray-400 text-sm text-center">
          Nhập mã OTP được gửi đến email và mật khẩu mới.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              placeholder="Mã OTP"
              className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={formData.otp}
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value })
              }
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>
                {countdown > 0 ? (
                  <>
                    Mã OTP sẽ hết hạn sau{" "}
                    <span className="text-red-500">
                      {formatTime(countdown)}
                    </span>
                  </>
                ) : (
                  <span className="text-yellow-400">Mã OTP đã hết hạn</span>
                )}
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || resendLoading}
                className="text-red-500 hover:text-red-400 disabled:opacity-50"
              >
                {resendLoading
                  ? "Đang gửi..."
                  : countdown > 0
                  ? "Chờ hết hạn"
                  : "Gửi lại mã"}
              </button>
            </div>
          </div>

          <div>
            <input
              type="password"
              required
              placeholder="Mật khẩu mới"
              className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
          </div>

          <div>
            <input
              type="password"
              required
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60"
          >
            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          <a href="/login" className="text-red-500 hover:text-red-400">
            Quay lại đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
