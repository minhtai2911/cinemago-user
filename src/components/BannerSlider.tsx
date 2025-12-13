"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Calendar,
  Ticket,
} from "lucide-react";
import { Movie } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface BannerSliderProps {
  movies?: Movie[];
}

export default function BannerSlider({ movies = [] }: BannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = movies.slice(0, 5).map((movie) => ({
    id: movie.id,
    title: movie.title,
    subtitle:
      movie.genres && movie.genres.length > 0
        ? movie.genres.map((g: any) => g.name).join(", ")
        : "Phim chiếu rạp",
    image: movie.thumbnail || "",
    releaseDate: movie.releaseDate
      ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
      : "Sắp chiếu",
  }));

  const hasBanners = banners.length > 0;

  const nextSlide = useCallback(() => {
    if (!hasBanners) return;
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [hasBanners, banners.length]);

  const prevSlide = () => {
    if (!hasBanners) return;
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!hasBanners) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, hasBanners]);

  if (!hasBanners) {
    return (
      <section className="relative w-full h-[500px] flex items-center justify-center bg-gray-100 border-b">
        <div className="text-center space-y-4 text-gray-400">
          <Film size={64} className="mx-auto opacity-50" />
          <h2 className="text-xl font-medium">Đang cập nhật phim hot...</h2>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden flex items-center bg-black">
      <div className="absolute inset-0 z-0">
        {currentBanner.image ? (
          <Image
            src={currentBanner.image}
            alt="Background"
            fill
            priority
            className="object-cover blur-md opacity-50 scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-12 mt-10">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 hover:bg-[#F25019] text-white backdrop-blur-sm transition-all hidden md:block group"
          >
            <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-[60%] md:w-[35%] lg:w-[30%] flex-shrink-0 relative group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-4 ring-white/10 group-hover:ring-[#F25019] transition-all duration-500">
                {currentBanner.image ? (
                  <Image
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-800 text-gray-500">
                    <Film size={48} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-5 animate-in slide-in-from-right duration-700 fade-in">
              <div>
                <span className="inline-block px-3 py-1 bg-[#F25019] text-white text-xs font-bold rounded mb-3 uppercase tracking-wider">
                  Phim Đang Chiếu
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase drop-shadow-lg line-clamp-2">
                  {currentBanner.title}
                </h1>
              </div>

              <p className="text-lg text-gray-300 font-medium line-clamp-2 max-w-2xl">
                {currentBanner.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-gray-300">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Calendar size={16} className="text-[#F25019]" />
                  <span>Khởi chiếu: {currentBanner.releaseDate}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href={`/booking/${currentBanner.id}`}
                  className="w-full sm:w-auto"
                >
                  <button className="w-full sm:w-auto bg-[#F25019] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/40 hover:bg-[#d14012] hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Ticket size={20} />
                    ĐẶT VÉ NGAY
                  </button>
                </Link>

                <Link
                  href={`/movies/${currentBanner.id}`}
                  className="w-full sm:w-auto"
                >
                  <button className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                    CHI TIẾT
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/10 hover:bg-[#F25019] text-white backdrop-blur-sm transition-all hidden md:block group"
          >
            <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-8 bg-[#F25019]"
                  : "w-2 bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
