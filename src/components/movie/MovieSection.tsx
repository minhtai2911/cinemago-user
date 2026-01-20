"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/movie/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  showBookingButton?: boolean;
}

export default function MovieSection({
  title,
  movies = [],
  showBookingButton = false,
}: MovieSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, movies.length - itemsPerPage);
  const nextSlide = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  if (!movies || movies.length === 0) return null;

  return (
    // BỎ bg-gradient, để trong suốt
    <section className="relative w-full py-8">
      <div className="container mx-auto px-4">
        {/* HEADER STYLE MỚI: Giống ảnh mẫu */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center flex-grow">
            <h2 className="text-2xl md:text-3xl font-black text-[#F25019] uppercase tracking-wide shrink-0 mr-6">
              {title}
            </h2>
            {/* Đường kẻ mờ chạy ngang sang phải */}
            <div className="h-[2px] w-full max-w-xs bg-gradient-to-r from-orange-200/50 to-transparent rounded-full hidden sm:block"></div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-orange-100 bg-white/50 text-gray-500 hover:bg-[#F25019] hover:border-[#F25019] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-orange-100 bg-white/50 text-gray-500 hover:bg-[#F25019] hover:border-[#F25019] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden -mx-4 p-4 -my-4 pt-2 pb-6">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                style={{ width: `${100 / itemsPerPage}%` }}
                className="flex-shrink-0 px-3"
              >
                <MovieCard
                  movie={movie}
                  showBookingButton={showBookingButton}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
