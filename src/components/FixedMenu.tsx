"use client";

import React from "react";
import { MapPin, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function FixedMenu() {
  return (
    <div className="fixed top-[64px] left-0 right-0 z-40 bg-black shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* Bên trái */}
        <div className="flex items-center gap-8">
          {/* Chọn rạp */}
          <Link
            href="/cinemas"
            className="flex items-center gap-2 cursor-pointer text-white hover:text-red-400 font-medium transition-colors"
          >
            <MapPin size={18} strokeWidth={2} />
            <span>Chọn rạp</span>
          </Link>

          {/* Lịch chiếu */}
          <Link
            href="/showtimes"
            className="flex items-center gap-2 cursor-pointer text-white hover:text-red-400 font-medium transition-colors"
          >
            <CalendarDays size={18} strokeWidth={2} />
            <span>Lịch chiếu</span>
          </Link>
        </div>

        {/* Bên phải */}
        <div className="flex gap-8 text-base font-medium">
          <Link
            href="/promotions"
            className="cursor-pointer relative text-white transition-colors duration-200 hover:text-red-400 after:block after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-red-400 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200"
          >
            Khuyến mãi
          </Link>
          <Link
            href="/about"
            className="cursor-pointer relative text-white transition-colors duration-200 hover:text-red-400 after:block after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-red-400 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200"
          >
            Giới thiệu
          </Link>
        </div>
      </div>
    </div>
  );
}
