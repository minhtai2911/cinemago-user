"use client";

import { useState } from "react";
import { toast } from "sonner";
import { forgotPassword } from "@/services";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";

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
    <div className="min-h-screen h-screen flex items-center justify-center overflow-hidden bg-peach-gradient">
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          width={500}
          height={500}
          src="/popcorn.png"
          alt=""
          aria-hidden
          className="hidden lg:block pointer-events-none select-none absolute -left-52 top-1/2 -translate-y-1/2 w-[50%] opacity-25"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />
        <div className="absolute inset-0 rounded-3xl glass-overlay soft-shadow pointer-events-none" />
        <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md space-y-5 bg-white/90 p-8 rounded-2xl border border-white/30 shadow-xl">
                <div>
                  <Image
                    width={50}
                    height={50}
                    src="/CinemaGo.svg"
                    alt="CinemaGO"
                    className="h-8 w-auto mb-2"
                  />
                  <h2 className="text-left text-3xl font-extrabold text-[#1f2937]">
                    Quên mật khẩu
                  </h2>
                </div>

                <p className="text-gray-600 text-xs">
                  Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Nhập email"
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#F25019] to-[#E9391B] hover:from-[#E9391B] hover:to-[#F25019] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F25019] disabled:opacity-60"
                  >
                    {loading ? "Đang gửi..." : "Gửi mã OTP"}
                  </button>
                </form>

                <div className="text-center text-xs">
                  <p className="text-gray-600">
                    <a
                      href="/login"
                      className="font-medium text-red-500 hover:text-red-400"
                    >
                      Quay lại đăng nhập
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <Image
                width={300}
                height={300}
                src="/popcorn.png"
                alt="popcorn"
                className="w-[60%] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
