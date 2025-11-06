"use client";

import { useState } from "react";
import { toast } from "sonner";
import { forgotPassword } from "@/services";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLogged } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword({ email });
      toast.success("Đã gửi mã OTP đến email của bạn!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        switch (error.response?.status) {
          case 400: 
            toast.error("Vui lòng nhập email hợp lệ");
            break;
          case 404:
            toast.error("Email không tồn tại trong hệ thống");
            break;
          default:
            toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại!");
        }
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLogged) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg space-y-6">
        <h2 className="text-center text-2xl font-bold text-red-500">
          Quên mật khẩu
        </h2>
        <p className="text-gray-400 text-sm text-center">
          Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Nhập email"
            className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60"
          >
            {loading ? "Đang gửi..." : "Gửi mã OTP"}
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
