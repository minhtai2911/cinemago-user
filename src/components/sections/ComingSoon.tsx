"use client";

import { useState, useEffect } from "react";
import MovieCard from "../ui/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMovies } from "@/services/movieService";
import { Movie, MovieStatus } from "@/types/movie";

// Fallback data
const fallbackComingSoonMovies = [
  {
    id: "7",
    title: "Mufasa: The Lion King",
    genre: "Animation, Adventure, Family",
    duration: "118 phút",
    rating: 8.5,
    releaseDate: "20/12/2024",
    isComingSoon: true,
    poster: "/banners/joker.jpg",
  },
  {
    id: "8",
    title: "Sonic the Hedgehog 3",
    genre: "Action, Adventure, Comedy",
    duration: "109 phút",
    rating: 8.0,
    releaseDate: "25/12/2024",
    isComingSoon: true,
    poster: "/banners/venom.jpg",
  },
  {
    id: "9",
    title: "Wicked",
    genre: "Drama, Fantasy, Musical",
    duration: "160 phút",
    rating: 9.1,
    releaseDate: "22/11/2024",
    isComingSoon: true,
    poster: "/banners/transformers.jpg",
  },
  {
    id: "10",
    title: "Gladiator II",
    genre: "Action, Adventure, Drama",
    duration: "148 phút",
    rating: 8.7,
    releaseDate: "15/11/2024",
    isComingSoon: true,
    poster: "/banners/joker.jpg",
  },
  {
    id: "11",
    title: "Moana 2",
    genre: "Animation, Adventure, Comedy",
    duration: "100 phút",
    rating: 8.3,
    releaseDate: "27/11/2024",
    isComingSoon: true,
    poster: "/banners/venom.jpg",
  },
  {
    id: "12",
    title: "A Complete Unknown",
    genre: "Biography, Drama, Music",
    duration: "141 phút",
    rating: 8.9,
    releaseDate: "25/12/2024",
    isComingSoon: true,
    poster: "/banners/transformers.jpg",
  },
];

interface MovieCardData {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  releaseDate: string;
  isComingSoon: boolean;
  poster?: string;
}

export default function ComingSoon() {
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive State
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(1);
      } else if (width < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset index khi resize
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);

  const maxIndex = Math.max(0, movies.length - itemsPerPage);

  useEffect(() => {
    const fetchComingSoonMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getMovies(
          1,
          12,
          undefined,
          undefined,
          undefined,
          true,
          MovieStatus.COMING_SOON
        );

        if (response && response.data && response.data.length > 0) {
          const moviesData = response.data.map((movie: Movie) => ({
            id: movie.id,
            title: movie.title,
            genre: movie.genres?.map((g) => g.name).join(", ") || "N/A",
            duration: movie.duration ? `${movie.duration} phút` : "N/A",
            rating: movie.rating || 0,
            releaseDate: movie.releaseDate
              ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
              : "N/A",
            // Map thumbnail -> poster
            poster: movie.thumbnail || "",
            isComingSoon: true,
          }));
          setMovies(moviesData);
        } else {
          setMovies(fallbackComingSoonMovies);
        }
      } catch (error) {
        console.error("Error fetching coming soon movies:", error);
        setError("Không thể tải dữ liệu từ server");
        setMovies(fallbackComingSoonMovies);
      } finally {
        setLoading(false);
      }
    };
    fetchComingSoonMovies();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    // Đã bỏ bg-orange-50/50 để nền trong suốt ăn theo Page
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-[#F25019] mb-3">
              Phim Sắp Chiếu
            </h2>
            <p className="text-lg text-gray-700">
              Những bộ phim được mong đợi nhất sắp ra mắt
            </p>
            {/* {error && (
              <p className="text-xs text-orange-400 mt-1 italic">
                *Đang hiển thị dữ liệu mẫu do lỗi kết nối
              </p>
            )} */}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0 || loading}
              className="relative p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group bg-white border border-[#F25019] hover:bg-[#F25019] hover:text-white"
            >
              <ChevronLeft className="w-6 h-6 text-[#F25019] group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex || loading}
              className="relative p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group bg-white border border-[#F25019] hover:bg-[#F25019] hover:text-white"
            >
              <ChevronRight className="w-6 h-6 text-[#F25019] group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F25019]"></div>
            <span className="ml-3 text-gray-700">
              Đang tải phim sắp chiếu...
            </span>
          </div>
        )}

        {/* Slider */}
        {!loading && movies.length > 0 && (
          <div className="relative overflow-hidden py-8 -my-8 px-2">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
              }}
            >
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  style={{ width: `${100 / itemsPerPage}%` }}
                  className="flex-shrink-0 px-3"
                >
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    genre={movie.genre}
                    duration={movie.duration}
                    rating={movie.rating}
                    releaseDate={movie.releaseDate}
                    poster={movie.poster || ""}
                    isComingSoon={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
