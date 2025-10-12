import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#181818] text-gray-300 mt-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* CINEMAGO text + Hotline + Social - Column 1 */}
        <div>
          <Link
            href="/"
            className="text-2xl font-bold text-red-500 mb-4 inline-block"
          >
            CinemaGo
          </Link>

          {/* Slogan */}
          <p className="text-sm mb-4">BE HAPPY. BE A STAR.</p>

          <div className="flex flex-col space-y-4 mb-6">
            {/* Nút ĐẶT VÉ PHIM (ĐẶT VÉ) */}
            <Link
              href="/booking"
              className="relative w-44 text-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-black via-black to-black border-2 border-red-500 text-red-500 font-medium transition-all duration-300 
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/20 before:via-transparent before:to-red-500/20 before:rounded-xl before:opacity-0
              hover:before:opacity-100 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:border-red-400 hover:text-red-400"
            >
              <span className="relative">ĐẶT VÉ PHIM</span>
            </Link>

            {/* Nút ĐẶT BẮP NƯỚC */}
            <Link
              href="/food-drinks"
              className="relative w-44 text-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-black via-black to-black border-2 border-red-500 text-red-500 font-medium transition-all duration-300 
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/20 before:via-transparent before:to-red-500/20 before:rounded-xl before:opacity-0
              hover:before:opacity-100 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:border-red-400 hover:text-red-400"
            >
              <span className="relative">ĐẶT BẮP NƯỚC</span>
            </Link>
          </div>

          <p className="text-sm mb-2">
            Hotline:{" "}
            <a href="tel:19001234" className="text-yellow-400 hover:underline">
              1900 1234
            </a>
          </p>
          <p className="text-sm mb-2">
            Email:{" "}
            <a href="mailto:info@cinemago.vn" className="hover:underline">
              info@cinemago.vn
            </a>
          </p>
          <div className="flex gap-4 mt-4 text-2xl">
            <a href="#" className="hover:text-blue-400" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-red-400" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="#" className="hover:text-pink-400" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Tài khoản - Column 2 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Tài khoản</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Đăng ký
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Membership
              </Link>
            </li>
          </ul>
        </div>

        {/* Xem phim - Column 3 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Xem phim</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Phim đang chiếu
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Phim sắp chiếu
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Suất chiếu đặc biệt
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Tin tức & Ưu đãi
              </Link>
            </li>
          </ul>
        </div>

        {/* Thông tin & Chính sách - Column 4 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Thông tin & Hỗ trợ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Giới thiệu CinemaGo
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Liên hệ
              </Link>
            </li>
            <li className="pt-2 border-t border-gray-700 mt-2">
              <Link href="#" className="hover:text-yellow-400">
                Điều khoản & Chính sách
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Hướng dẫn đặt vé
              </Link>
            </li>
          </ul>
        </div>

        {/* Cụm rạp - Column 5 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Cụm rạp</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-yellow-400">
                CinemaGo Quốc Thanh (TPHCM)
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                CinemaGo Hai Bà Trưng (TPHCM)
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                CinemaGo Bình Dương
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                CinemaGo Đà Lạt (Lâm Đồng)
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-700">
        © 2025 CINEMAGO. All rights reserved.
      </div>
    </footer>
  );
}
