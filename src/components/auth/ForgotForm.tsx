"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services";

export default function ForgotForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email });

      if (response.status === 200) {
        alert("Vui lòng kiểm tra email để đặt lại mật khẩu");
        router.push("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-red-500">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Nhập email của bạn để nhận link đặt lại mật khẩu
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Gửi link đặt lại mật khẩu
            </button>
          </div>
        </form>

        <div className="text-center">
          <a
            href="/auth/login"
            className="font-medium text-red-500 hover:text-red-400"
          >
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
