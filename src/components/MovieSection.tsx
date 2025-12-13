"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/ui/MovieCard";
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
    <section className="relative w-full py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 border-l-4 border-[#F25019] pl-4 uppercase">
          {title}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-3 rounded-full bg-white border hover:bg-[#F25019] hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="p-3 rounded-full bg-white border hover:bg-[#F25019] hover:text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden -mx-3 p-3">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              style={{ width: `${100 / itemsPerPage}%` }}
              className="flex-shrink-0 px-3 pb-4"
            >
              <MovieCard movie={movie} showBookingButton={showBookingButton} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
