"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa6";
import { getCinemas } from "@/services/cinemaService";

interface CinemaFooter {
  id: number;
  name: string;
}

export default function Footer() {
  const [footerCinemas, setFooterCinemas] = useState<CinemaFooter[]>([]);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const res = await getCinemas(1, 5, "", true);

        if (res?.data && Array.isArray(res.data)) {
          setFooterCinemas(res.data);
        } else if (Array.isArray(res)) {
          setFooterCinemas(res.slice(0, 5));
        }
      } catch (error) {
        console.error("Lỗi tải footer:", error);
      }
    };

    fetchCinemas();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 text-gray-600">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* CỘT 1 */}
        <div className="lg:col-span-1">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/CinemaGo.svg"
              alt="CinemaGo"
              width={160}
              height={45}
              className="object-contain"
            />
          </Link>

          <p className="text-sm font-medium text-gray-500 mb-6 tracking-wider">
            BE HAPPY. BE A STAR.
          </p>

          <div className="flex flex-col space-y-3 mb-6">
            <Link
              href="/booking"
              className="relative w-full max-w-[200px] text-center px-6 py-2.5 rounded-xl border border-[#F25019] text-[#F25019] font-bold text-sm transition-all duration-300 hover:bg-[#F25019] hover:text-white hover:shadow-[0_4px_15px_rgba(242,80,25,0.3)]"
            >
              ĐẶT VÉ PHIM
            </Link>

            <Link
              href="/food-drinks"
              className="relative w-full max-w-[200px] text-center px-6 py-2.5 rounded-xl border border-[#F25019] text-[#F25019] font-bold text-sm transition-all duration-300 hover:bg-[#F25019] hover:text-white hover:shadow-[0_4px_15px_rgba(242,80,25,0.3)]"
            >
              ĐẶT BẮP NƯỚC
            </Link>
          </div>

          <div className="text-sm space-y-2">
            <p>
              Hotline:{" "}
              <a
                href="tel:19001234"
                className="font-semibold text-gray-800 hover:text-[#F25019] transition"
              >
                1900 1234
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@cinemago.vn"
                className="font-semibold text-gray-800 hover:text-[#F25019] transition"
              >
                info@cinemago.vn
              </a>
            </p>
          </div>

          <div className="flex gap-4 mt-5">
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#FF0000] hover:text-white transition-all"
            >
              <FaYoutube size={14} />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all"
            >
              <FaTiktok size={14} />
            </a>
          </div>
        </div>

        {/* CỘT 2 */}
        <div>
          <h3 className="text-gray-900 font-bold mb-4 uppercase text-sm tracking-wide">
            Tài khoản
          </h3>
          <ul className="space-y-2.5 text-sm">
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
                href="/profile"
                className="hover:text-[#F25019] transition-colors"
              >
                Membership
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold mb-4 uppercase text-sm tracking-wide">
            Xem phim
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/movies/now-showing"
                className="hover:text-[#F25019] transition-colors"
              >
                Phim đang chiếu
              </Link>
            </li>
            <li>
              <Link
                href="/movies/coming-soon"
                className="hover:text-[#F25019] transition-colors"
              >
                Phim sắp chiếu
              </Link>
            </li>
            <li>
              <Link
                href="/showtimes"
                className="hover:text-[#F25019] transition-colors"
              >
                Suất chiếu đặc biệt
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className="hover:text-[#F25019] transition-colors"
              >
                Tin tức & Ưu đãi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold mb-4 uppercase text-sm tracking-wide">
            Thông tin
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/about"
                className="hover:text-[#F25019] transition-colors"
              >
                Giới thiệu CinemaGo
              </Link>
            </li>
            <li>
              <Link
                href="/recruitment"
                className="hover:text-[#F25019] transition-colors"
              >
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-[#F25019] transition-colors"
              >
                Liên hệ
              </Link>
            </li>
            <li className="pt-2 mt-2 border-t border-gray-100">
              <Link
                href="/policy"
                className="hover:text-[#F25019] transition-colors"
              >
                Điều khoản & Chính sách
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold mb-4 uppercase text-sm tracking-wide">
            Hệ thống rạp
          </h3>
          <ul className="space-y-2.5 text-sm">
            {footerCinemas.length > 0 ? (
              footerCinemas.map((cinema) => (
                <li key={cinema.id}>
                  <Link
                    href={`/cinema/${cinema.id}`}
                    className="hover:text-[#F25019] transition-colors block py-0.5"
                  >
                    {cinema.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic text-xs">Đang cập nhật...</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 mt-10 pt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2025 CINEMAGO. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-[#F25019]">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="hover:text-[#F25019]">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
