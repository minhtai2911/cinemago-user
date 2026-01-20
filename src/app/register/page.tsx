"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/services";
import { toast } from "sonner";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { Eye, EyeOff, ChevronDown, Check } from "lucide-react"; // Import thêm icon Check nếu muốn đẹp hơn

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
  const [showPassword, setShowPassword] = useState(false);

  const [openGender, setOpenGender] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenGender(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
    setOpenGender(false);
  };

  const genderLabels: Record<string, string> = {
    male: "Nam",
    female: "Nữ",
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
        "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.",
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
    <div className="min-h-screen h-screen flex items-center justify-center overflow-hidden bg-peach-gradient">
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          width={500}
          height={500}
          src="/popcorn.webp"
          alt="popcorn cinemago"
          aria-hidden
          className="hidden lg:block pointer-events-none select-none absolute -left-52 top-1/2 -translate-y-1/2 w-[50%] opacity-25"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />
        <div className="absolute inset-0 rounded-3xl glass-overlay soft-shadow pointer-events-none" />
        <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md space-y-5 bg-white/90 p-8 rounded-2xl border border-white/30 shadow-xl max-h-[90vh] overflow-y-auto">
                <div>
                  <Image
                    width={50}
                    height={50}
                    src="/CinemaGo.svg"
                    alt="CinemaGO"
                    className="h-8 w-auto mb-2"
                  />
                  <h2 className="text-left text-3xl font-extrabold text-[#1f2937]">
                    Đăng ký
                  </h2>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 sm:text-sm pr-10"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
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

                    {/* --- CUSTOM DROPDOWN --- */}
                    <div className="relative" ref={dropdownRef}>
                      {/* Nút bấm mô phỏng thẻ select */}
                      <button
                        type="button"
                        onClick={() => setOpenGender(!openGender)}
                        className={`appearance-none rounded-md relative w-full px-3 py-2 border bg-white text-left flex items-center justify-between sm:text-sm transition-all
                          ${
                            openGender
                              ? "border-red-500 ring-2 ring-red-100"
                              : "border-gray-200 text-gray-900 hover:border-gray-300"
                          }
                        `}
                      >
                        <span
                          className={
                            formData.gender ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          {genderLabels[formData.gender] || "Chọn giới tính"}
                        </span>
                        <ChevronDown
                          className={`text-gray-500 transition-transform duration-200 ${
                            openGender ? "rotate-180" : ""
                          }`}
                          size={18}
                        />
                      </button>

                      {/* Menu xổ xuống */}
                      {openGender && (
                        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-orange-700 ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100">
                          {/* Option Nam */}
                          <div
                            onClick={() => handleGenderSelect("male")}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-red-50 hover:text-red-600 transition-colors ${
                              formData.gender === "male"
                                ? "text-red-600 bg-red-50 font-medium"
                                : "text-gray-900"
                            }`}
                          >
                            <span className="block truncate">Nam</span>
                            {formData.gender === "male" && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-red-600">
                                <Check size={16} />
                              </span>
                            )}
                          </div>

                          {/* Option Nữ */}
                          <div
                            onClick={() => handleGenderSelect("female")}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-red-50 hover:text-red-600 transition-colors ${
                              formData.gender === "female"
                                ? "text-red-600 bg-red-50 font-medium"
                                : "text-gray-900"
                            }`}
                          >
                            <span className="block truncate">Nữ</span>
                            {formData.gender === "female" && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-red-600">
                                <Check size={16} />
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#F25019] to-[#E9391B] hover:from-[#E9391B] hover:to-[#F25019] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F25019] disabled:opacity-60 transition-all shadow-md hover:shadow-lg"
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
                <div className="text-center text-xs">
                  <p className="text-gray-600">
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
                width={300}
                height={300}
                src="/popcorn.webp"
                alt="popcorn cinemago"
                className="w-[60%] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
