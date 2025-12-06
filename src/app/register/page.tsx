"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/services";
import { toast } from "sonner";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const { isLogged } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.fullname) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    try {
      await signUp(formData);

      toast.success(
        "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản."
      );
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        switch (error.response?.status) {
          case 400:
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            break;
          case 409:
            toast.error("Email đã được sử dụng.");
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
                  Đăng ký
                </h2>
              </div>
              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      name="fullname"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                      placeholder="Họ tên"
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <select
                      name="gender"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
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
                      Đang đăng ký...
                    </span>
                  ) : (
                    "Đăng ký"
                  )}
                </button>
              </form>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <a
                    href="/login"
                    className="font-medium text-red-500 hover:text-red-400"
                  >
                    Đăng nhập
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <Image
              width={500}
              height={500}
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
