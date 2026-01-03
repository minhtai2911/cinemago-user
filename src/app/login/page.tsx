"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { login } from "@/services";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setAccessToken, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await login(formData);
      setAccessToken(response.data.accessToken);
      toast.success("Đăng nhập thành công");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        switch (error.response?.status) {
          case 400:
            if (error.response.data?.error === "User account is not active") {
              toast.error(
                "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản."
              );
            } else {
              toast.error("Email hoặc mật khẩu không chính xác");
            }
            break;
          case 404:
            toast.error("Tài khoản không tồn tại");
            break;
          default:
            toast.error("Đăng nhập thất bại");
        }
      } else {
        toast.error("Có lỗi xảy ra");
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
                    Đăng nhập
                  </h2>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="email"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm pr-10"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <a
                        href="/forgot-password"
                        className="font-medium text-red-500 hover:text-red-400"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#F25019] to-[#E9391B] hover:from-[#E9391B] hover:to-[#F25019] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F25019] disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        Đang đăng nhập...
                      </span>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </form>
                <div className="text-center text-xs">
                  <p className="text-gray-600">
                    Chưa có tài khoản?{" "}
                    <a
                      href="/register"
                      className="font-medium text-red-500 hover:text-red-400"
                    >
                      Đăng ký ngay
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
