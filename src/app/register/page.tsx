"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/services";
import { toast } from "sonner";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

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
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-red-500">Đăng ký</h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-3">
            <input
              type="text"
              name="fullname"
              required
              className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Họ tên"
              value={formData.fullname}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              required
              className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              required
              className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />

            <select
              name="gender"
              className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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
          <p className="text-sm text-gray-400">
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
  );
}
