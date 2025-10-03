import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-black shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-500">
          CinemaGo
        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-6 font-medium">
          <Link href="/" className="hover:text-red-400 transition">
            Trang chủ
          </Link>
          <Link href="/movies" className="hover:text-red-400 transition">
            Phim
          </Link>
          <Link href="/profile" className="hover:text-red-400 transition">
            Tài khoản
          </Link>
        </div>

        {/* Auth */}
        <div className="flex gap-3">
          <Link href="/login" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
            Đăng nhập
          </Link>
        </div>
      </nav>
    </header>
  );
}