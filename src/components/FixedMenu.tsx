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
    <div className="top-14 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-12">
            <div className="relative">
              <div
                ref={triggerRef}
                onMouseEnter={() => setIsOpen(true)}
                className="flex items-center gap-3 text-white hover:text-yellow-400 font-bold text-lg cursor-pointer select-none transition-all"
              >
                <MapPin size={24} strokeWidth={2.5} />
                <span>Chọn rạp</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              <div
                ref={dropdownRef}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className={`absolute top-full left-0 mt-4 w-[960px] bg-gray-950 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-3 invisible pointer-events-none"
                }`}
              >
                <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                  {loading ? (
                    <div className="flex flex-col items-center py-20">
                      <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                      <p className="text-gray-400 mt-4">
                        Đang tải danh sách rạp...
                      </p>
                    </div>
                  ) : cinemas.length === 0 ? (
                    <p className="text-center text-gray-500 py-20 text-xl">
                      Chưa có rạp nào
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-x-16 gap-y-8">
                      {cinemas.map((cinema) => (
                        <Link
                          key={cinema.id}
                          href={`/cinemas/${cinema.id}`}
                          className="block p-4 -m-4 rounded-xl hover:bg-gray-900/70 transition-all group"
                        >
                          <div className="font-bold text-white group-hover:text-yellow-400 text-lg leading-tight">
                            {cinema.name}
                          </div>
                          <div className="text-gray-400 text-sm mt-1.5 line-clamp-2">
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
              className="flex items-center gap-3 text-white hover:text-yellow-400 font-bold text-lg transition-all"
            >
              <CalendarDays size={24} strokeWidth={2.5} />
              <span>Lịch chiếu</span>
            </Link>
          </div>

          <div className="flex items-center gap-10 text-lg font-medium">
            <Link
              href="/promotions"
              className="text-white hover:text-red-400 transition relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-400 hover:after:w-full after:transition-all"
            >
              Khuyến mãi
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-red-400 transition relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-400 hover:after:w-full after:transition-all"
            >
              Giới thiệu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
