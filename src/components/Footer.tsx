import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-red-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Logo + Social */}
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-3">CinemaGo</h2>
          <p className="text-sm mb-4">Be happy, be a star ⭐</p>
          <div className="flex gap-3">
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">YouTube</a>
            <a href="#" className="hover:text-white">TikTok</a>
          </div>
        </div>

        {/* Tài khoản */}
        <div>
          <h3 className="text-white font-semibold mb-3">Tài khoản</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/login">Đăng nhập</Link></li>
            <li><Link href="/register">Đăng ký</Link></li>
            <li><Link href="/membership">Membership</Link></li>
          </ul>
        </div>

        {/* Xem phim */}
        <div>
          <h3 className="text-white font-semibold mb-3">Xem phim</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Phim đang chiếu</a></li>
            <li><a href="#">Phim sắp chiếu</a></li>
            <li><a href="#">Suất chiếu đặc biệt</a></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-white font-semibold mb-3">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Hỗ trợ</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-700">
        © 2025 CinemaGo. All rights reserved.
      </div>
    </footer>
  );
}
