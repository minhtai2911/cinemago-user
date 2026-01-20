"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { User, LogOut as LogOutIcon, Search } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { logout } from "@/services";
import { useRouter, usePathname } from "next/navigation";
import FixedMenu from "./FixedMenu";

export default function Navbar() {
  const { isLogged, profile, setAccessToken, setIsLogged, setProfile } =
    useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

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
      router.push("/");
      toast.success("Đăng xuất thành công!");
    } catch {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center px-6 py-3 text-gray-800 relative z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/CinemaGo.svg"
              alt="CinemaGo"
              width={180}
              height={50}
              priority
            />
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-center gap-6 font-medium">
          <Link
            href="/"
            className={`transition ${
              pathname === "/"
                ? "text-[#F25019]"
                : "hover:text-[#F25019] text-gray-700"
            }`}
          >
            Trang chủ
          </Link>
          <Link
            href="/movies"
            className={`transition ${
              pathname?.startsWith("/movies")
                ? "text-[#F25019]"
                : "hover:text-[#F25019] text-gray-700"
            }`}
          >
            Phim
          </Link>
        </div>
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm phim hoặc rạp chiếu..."
              className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-[#F25019] text-sm"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F25019]"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {!isLogged ? (
            <Link
              href="/login"
              className="bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white px-3 py-1.5 rounded-full text-sm font-semibold transition transform hover:scale-105 active:brightness-90 focus:outline-none"
            >
              Đăng nhập
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none hover:bg-[#fff4ee] hover:rounded-lg px-2 py-1 transition cursor-pointer"
              >
                <Image
                  src={profile?.avatarUrl || "/default-avatar.png"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
                <span className="hidden sm:inline text-sm font-medium text-[#374151]">
                  {profile?.fullname || "Người dùng"}
                </span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-0 animate-fadeIn overflow-hidden">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#fff4ee]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-[#F25019]" />
                    <span>Xem thông tin cá nhân</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#F25019] hover:bg-[#fff4ee]"
                  >
                    <LogOutIcon className="w-5 h-5 text-[#F25019]" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <FixedMenu />
    </header>
  );
}
