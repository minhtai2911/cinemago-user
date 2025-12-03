"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { logout } from "@/services";

export default function Navbar() {
  const router = useRouter();
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
      router.push("/login");
    } catch {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-[#FFE5D0] to-[#FFF3EA] px-8 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <img
          src="/CinemaGo.svg"
          alt="CinemaGo"
          className="h-10 w-10 rounded-full bg-white shadow"
        />
        <span className="text-2xl font-extrabold text-[#F25019] tracking-wide">
          CinemaGo
        </span>
      </div>
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-[#F25019] text-lg font-semibold hover:underline transition-colors"
        >
          Trang chủ
        </Link>
        <Link
          href="/movies"
          className="text-gray-700 text-lg font-medium hover:text-[#F25019] transition-colors"
        >
          Phim
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {!isLogged ? (
          <>
            <Link
              href="/login"
              className="bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white px-5 py-2 rounded-lg font-bold shadow hover:opacity-90 transition-all"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="bg-white border border-[#F25019] text-[#F25019] px-5 py-2 rounded-lg font-bold shadow hover:bg-[#FFE5D0] transition-all"
            >
              Đăng ký
            </Link>
          </>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow hover:bg-[#FFE5D0] transition-all"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <div className="h-10 w-10 rounded-full bg-[#F25019] flex items-center justify-center text-white font-bold text-xl">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  profile?.fullname?.[0] || "U"
                )}
              </div>
              <span className="text-[#F25019] font-semibold text-lg">
                {profile?.fullname || "User"}
              </span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#F25019"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 py-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-5 py-3 hover:bg-[#FFE5D0] text-gray-800"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="#F25019"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                  Xem thông tin cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-3 w-full text-left hover:bg-[#FFE5D0] text-[#F25019]"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="#F25019"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
