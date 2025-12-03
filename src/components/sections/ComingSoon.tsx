"use client";

import { useState, useEffect } from "react";
import MovieCard from "../ui/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMovies } from "@/services/movieService";
import { Movie, MovieStatus } from "@/types/movie";

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

  // --- THAY ĐỔI 1: Chuyển itemsPerPage thành state ---
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // --- THAY ĐỔI 2: Thêm logic bắt sự kiện resize màn hình ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(1); // Mobile
      } else if (width < 1024) {
        setItemsPerPage(2); // Tablet
      } else {
        setItemsPerPage(4); // PC
      }
    };

    handleResize(); // Gọi ngay lần đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- THAY ĐỔI 3: Reset index khi đổi kích thước màn hình để tránh lỗi hiển thị ---
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
            poster: movie.poster,
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
    <section className="py-20 bg-orange-50/50">
      {" "}
      {/* Thêm chút nền nhẹ để tách biệt section */}
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
            {error && (
              <p className="text-orange-500 text-sm mt-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error} (Hiển thị dữ liệu mẫu)
              </p>
            )}
          </div>

          {/* Navigation buttons - Đã chỉnh style khớp với NowShowing */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0 || loading}
              className="relative p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group bg-white/80 border border-[#F25019] hover:bg-[#F25019] hover:text-white"
            >
              <ChevronLeft className="w-6 h-6 text-[#F25019] group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex || loading}
              className="relative p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group bg-white/80 border border-[#F25019] hover:bg-[#F25019] hover:text-white"
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

        {/* Movies Grid (Slider) */}
        {!loading && movies.length > 0 && (
          // --- THAY ĐỔI 4: Sửa overflow-visible thành overflow-hidden để che phần thừa ---
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                // --- THAY ĐỔI 5: Tính toán vị trí trượt dựa trên itemsPerPage động ---
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
                // Xóa phần width cứng ở đây đi, để flex tự lo
              }}
            >
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  // --- THAY ĐỔI 6: Width động thay vì w-1/4 ---
                  style={{ width: `${100 / itemsPerPage}%` }}
                  className="flex-shrink-0 px-3"
                >
                  <MovieCard
                    {...{ ...movie, poster: movie.poster ? movie.poster : "" }}
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
