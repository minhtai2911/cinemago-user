"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, CalendarDays, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { getCinemas } from "@/services";
import { Cinema } from "@/types";

export default function FixedMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && cinemas.length === 0) {
      const loadCinemas = async () => {
        setLoading(true);
        try {
          const res = await getCinemas(undefined, undefined, "", true);
          setCinemas(res.data || []);
        } catch (err) {
          console.error("Lỗi tải rạp:", err);
        } finally {
          setLoading(false);
        }
      };
      loadCinemas();
    }
  }, [isOpen, cinemas.length]);

  return (
    <div className="w-full bg-white border-t border-gray-100 shadow-sm z-40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          {" "}
          <div className="flex items-center gap-12">
            <div className="relative">
              <div
                ref={triggerRef}
                onMouseEnter={() => setIsOpen(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-[#F25019] font-bold text-base cursor-pointer select-none transition-all"
              >
                <MapPin size={20} strokeWidth={2.5} />
                <span>Chọn rạp</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              <div
                ref={dropdownRef}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className={`absolute top-full left-0 mt-2 w-[900px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 z-50 ${
                  isOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-3 invisible pointer-events-none"
                }`}
              >
                <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {loading ? (
                    <div className="flex flex-col items-center py-10">
                      <Loader2 className="w-8 h-8 text-[#F25019] animate-spin" />
                      <p className="text-gray-500 mt-3 text-sm">
                        Đang tải danh sách rạp...
                      </p>
                    </div>
                  ) : cinemas.length === 0 ? (
                    <p className="text-center text-gray-500 py-10 text-sm">
                      Chưa có rạp nào
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                      {cinemas.map((cinema) => (
                        <Link
                          key={cinema.id}
                          href={`/cinemas/${cinema.id}`}
                          className="block p-3 -m-3 rounded-lg hover:bg-[#fff4ee] transition-all group"
                        >
                          <div className="font-bold text-gray-800 group-hover:text-[#F25019] text-sm leading-tight">
                            {cinema.name}
                          </div>
                          <div className="text-gray-500 text-xs mt-1 line-clamp-1">
                            {cinema.address}, {cinema.city}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/showtimes"
              className="flex items-center gap-2 text-gray-700 hover:text-[#F25019] font-bold text-base transition-all"
            >
              <CalendarDays size={20} strokeWidth={2.5} />
              <span>Lịch chiếu</span>
            </Link>
          </div>
          <div className="flex items-center gap-8 text-base font-medium">
            <Link
              href="/promotions"
              className="text-gray-600 hover:text-[#F25019] transition relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#F25019] hover:after:w-full after:transition-all"
            >
              Khuyến mãi
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-[#F25019] transition relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#F25019] hover:after:w-full after:transition-all"
            >
              Giới thiệu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
