"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { logout } from "@/services";

export default function Navbar() {
  const { isLogged, profile, setAccessToken, setIsLogged, setProfile } =
    useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setAccessToken(null);
      setIsLogged(false);
      setProfile(null);
      localStorage.removeItem("accessToken");
      toast.success("Đăng xuất thành công!");
    } catch {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <header className="bg-black shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
        <Link href="/" className="text-2xl font-bold text-red-500">
          CinemaGo
        </Link>

        <div className="hidden md:flex gap-6 font-medium">
          <Link href="/" className="hover:text-red-400 transition">
            Trang chủ
          </Link>
          <Link href="/movies" className="hover:text-red-400 transition">
            Phim
          </Link>
          {isLogged && (
            <Link href="/profile" className="hover:text-red-400 transition">
              Tài khoản
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          {!isLogged ? (
            <Link
              href="/login"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Đăng nhập
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <Image
                  src={profile?.avatarUrl || "/default-avatar.jpg"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-red-500 object-cover"
                />
                <span className="hidden sm:inline text-sm font-medium">
                  {profile?.fullname || "Người dùng"}
                </span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 animate-fadeIn">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Xem thông tin cá nhân
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
