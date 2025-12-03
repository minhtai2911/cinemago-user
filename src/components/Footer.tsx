import Link from "next/link";
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-red-100 pt-10 pb-6 mt-10">
      <div className="container mx-auto px-4">
        {/* --- Phần Nội dung Chính (3 Cột) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* CỘT 1: THƯƠNG HIỆU & HÀNH ĐỘNG */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src="/CinemaGo.svg" alt="CinemaGo" className="h-10 w-auto" />
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-6 py-2 bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white font-bold text-sm rounded shadow-lg shadow-orange-200 hover:shadow-orange-400 transition-all transform hover:-translate-y-0.5"
              >
                ĐẶT VÉ
              </Link>
              <Link
                href="/"
                className="px-6 py-2 border border-[#F25019] text-[#F25019] font-bold text-sm rounded hover:bg-orange-50 transition-colors"
              >
                ĐẶT BẮP NƯỚC
              </Link>
            </div>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Facebook"
              >
                <FaFacebook className="text-blue-600 w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Youtube"
              >
                <FaYoutube className="text-red-600 w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Tiktok"
              >
                <FaTiktok className="text-black w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Zalo"
              >
                <SiZalo className="text-blue-500 w-4 h-4" />
              </a>
            </div>
          </div>

          {/* CỘT 2: TÀI KHOẢN & XEM PHIM */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-[#1f2937] uppercase mb-4">
                Tài khoản
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-[#F25019] transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-[#F25019] transition-colors"
                  >
                    Đăng ký
                  </Link>
                </li>
                <li>
                  <Link
                    href="/membership"
                    className="hover:text-[#F25019] transition-colors"
                  >
                    Membership
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1f2937] uppercase mb-4">
                Xem phim
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#F25019] transition-colors"
                  >
                    Phim đang chiếu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#F25019] transition-colors"
                  >
                    Phim sắp chiếu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#F25019] transition-colors"
                  >
                    Suất chiếu đặc biệt
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT 3: HỆ THỐNG RẠP */}
          <div>
            <h3 className="text-lg font-bold text-[#1f2937] uppercase mb-4">
              Hệ thống rạp
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 max-h-40 overflow-y-auto custom-scrollbar pr-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-[#F25019] transition-colors"
                >
                  CinemaGo Quốc Thanh (TP.HCM)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#F25019] transition-colors"
                >
                  CinemaGo Hai Bà Trưng (TP.HCM)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#F25019] transition-colors"
                >
                  CinemaGo Sinh Viên (TP.HCM)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#F25019] transition-colors"
                >
                  CinemaGo Huế (TP. Huế)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#F25019] transition-colors"
                >
                  CinemaGo Đà Lạt (Lâm Đồng)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#F25019] transition-colors"
                >
                  CinemaGo Lâm Đồng (Đức Trọng)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#F25019] transition-colors"
                >
                  CinemaGo Mỹ Tho (Tiền Giang)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Dòng Bản Quyền --- */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-right">
            © {new Date().getFullYear()} <strong>CinemaGo</strong>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
