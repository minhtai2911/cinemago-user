"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { resetPassword, forgotPassword } from "@/services";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";

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
    <div className="min-h-screen bg-peach-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-6xl w-full rounded-3xl px-6 py-10">
        {/* Faint popcorn on the left outside the card (decorative, under overlay) */}
        <Image
          width={500}
          height={500}
          src="/popcorn.png"
          alt=""
          aria-hidden
          className="hidden lg:block pointer-events-none select-none absolute -left-52 top-6 w-[85%] opacity-25"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />
        <div className="absolute inset-0 rounded-3xl glass-overlay soft-shadow pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-white/90 p-8 rounded-xl border border-white/30 shadow-xl">
              <div>
                <Image
                  width={50}
                  height={50}
                  src="/CinemaGo.svg"
                  alt="CinemaGO"
                  className="h-8 w-auto mb-2"
                />
                <h2 className="text-left text-4xl font-extrabold text-[#1f2937]">
                  Đặt lại mật khẩu
                </h2>
              </div>

              <p className="text-gray-600 text-sm">
                Nhập mã OTP được gửi đến email và mật khẩu mới.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Mã OTP"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData({ ...formData, otp: e.target.value })
                      }
                    />
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                      <span>
                        {countdown > 0 ? (
                          <>
                            Mã OTP sẽ hết hạn sau{" "}
                            <span className="text-red-500">
                              {formatTime(countdown)}
                            </span>
                          </>
                        ) : (
                          <span className="text-yellow-400">
                            Mã OTP đã hết hạn
                          </span>
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
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu mới"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#F25019] to-[#E9391B] hover:from-[#E9391B] hover:to-[#F25019] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F25019] disabled:opacity-60"
                >
                  {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600">
                <a
                  href="/login"
                  className="font-medium text-red-500 hover:text-red-400"
                >
                  Quay lại đăng nhập
                </a>
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <Image
              width={400}
              height={400}
              src="/popcorn.png"
              alt="popcorn"
              className="w-[70%] h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
