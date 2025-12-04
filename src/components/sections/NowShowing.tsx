"use client";

import { useState, useEffect } from "react";
import MovieCard from "../ui/MovieCard"; // Đảm bảo đường dẫn đúng
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMovies } from "@/services/movieService";
import { Movie, MovieStatus } from "@/types/movie";

// Fallback data
const fallbackMovies = [
  {
    id: "1",
    title: "Venom: The Last Dance",
    genre: "Action, Sci-Fi, Thriller",
    duration: "109 phút",
    rating: 8.2,
    releaseDate: "25/10/2024",
    poster: "/banners/venom.jpg",
  },
  {
    id: "2",
    title: "Transformers One",
    genre: "Animation, Action, Adventure",
    duration: "104 phút",
    rating: 7.8,
    releaseDate: "11/10/2024",
    poster: "/banners/transformers.jpg",
  },
  {
    id: "3",
    title: "The Wild Robot",
    genre: "Animation, Adventure, Family",
    duration: "102 phút",
    rating: 8.9,
    releaseDate: "27/09/2024",
    poster: "/banners/joker.jpg",
  },
  {
    id: "4",
    title: "Beetlejuice Beetlejuice",
    genre: "Comedy, Horror, Fantasy",
    duration: "105 phút",
    rating: 7.5,
    releaseDate: "06/09/2024",
    poster: "/banners/venom.jpg",
  },
  {
    id: "5",
    title: "Godzilla x Kong",
    genre: "Action, Sci-Fi",
    duration: "115 phút",
    rating: 7.2,
    releaseDate: "15/04/2024",
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
  poster?: string;
  isComingSoon?: boolean;
}

export default function NowShowing() {
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Logic Responsive
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(1);
      else if (width < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, movies.length - itemsPerPage);

  // Load movies API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = (await getMovies(
          1,
          10,
          undefined,
          undefined,
          undefined,
          true,
          MovieStatus.NOW_SHOWING
        )) as any;

        if (
          response?.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const formattedMovies: MovieCardData[] = response.data.map(
            (movie: Movie) => ({
              id: movie.id,
              title: movie.title,
              genre:
                movie.genres?.map((g) => g.name).join(", ") || "Chưa phân loại",
              duration: `${movie.duration} phút`,
              rating: movie.rating,
              releaseDate: new Date(movie.releaseDate).toLocaleDateString(
                "vi-VN"
              ),
              // Map thumbnail từ API vào poster của Card
              poster: movie.thumbnail || "",
            })
          );
          setMovies(formattedMovies);
        } else {
          setMovies(fallbackMovies);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Không thể tải danh sách phim");
        setMovies(fallbackMovies);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-[#F25019] mb-3">
              Phim Đang Chiếu
            </h2>
            <p className="text-lg text-gray-700">
              Khám phá những bộ phim hot nhất hiện tại
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0 || loading}
              className="relative p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group bg-white border border-[#F25019] hover:bg-[#F25019]"
            >
              <ChevronLeft className="w-6 h-6 text-[#F25019] group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex || loading}
              className="relative p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group bg-white border border-[#F25019] hover:bg-[#F25019]"
            >
              <ChevronRight className="w-6 h-6 text-[#F25019] group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F25019]"></div>
            <span className="ml-3 text-gray-700">Đang tải phim...</span>
          </div>
        )}

        {/* Slider */}
        {!loading && movies.length > 0 && (
          // ĐÃ SỬA: Thêm padding và margin âm để tránh bị xén khi scale
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
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All */}
        {!loading && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-200">
              Xem tất cả phim đang chiếu
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
