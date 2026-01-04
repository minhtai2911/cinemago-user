"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { getMovies, getGenres } from "@/services";
import { Movie, Genre, MovieStatus } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import debounce from "lodash/debounce";
import MovieCard from "@/components/movie/MovieCard";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 20;

  const [search, setSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [status, setStatus] = useState<"ALL" | MovieStatus>("ALL");

  const [sortBy, setSortBy] = useState<"releaseDate" | "rating" | "title">(
    "releaseDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [isGenresLoading, setIsGenresLoading] = useState(true);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const genreDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenreDropdownOpen(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsGenresLoading(true);
        const res = await getGenres(undefined, undefined, "", true);
        setGenres(res.data || []);
      } catch {
        toast.error("Không tải được thể loại phim.");
        setGenres([]);
      } finally {
        setIsGenresLoading(false);
      }
    })();
  }, []);

  const fetchMovies = useCallback(
    debounce(async (page: number, querySearch: string) => {
      try {
        setIsMoviesLoading(true);
        const genresQuery = selectedGenres.join(",");
        const movieStatus = status === "ALL" ? undefined : status;
        const ratingFilter = minRating > 0 ? minRating : undefined;

        const res = await getMovies(
          page,
          limit,
          querySearch.trim() || undefined,
          ratingFilter,
          genresQuery || undefined,
          true,
          movieStatus,
          sortBy,
          sortOrder
        );

        setMovies(res.data || []);
        setTotalPages(res.pagination.totalPages || 1);
      } catch {
        toast.error("Không tải được danh sách phim.");
        setMovies([]);
      } finally {
        setIsMoviesLoading(false);
      }
    }, 500),
    [selectedGenres, minRating, status, sortBy, sortOrder]
  );

  useEffect(() => {
    fetchMovies(currentPage, search);
  }, [
    currentPage,
    search,
    selectedGenres,
    minRating,
    status,
    sortBy,
    sortOrder,
    fetchMovies,
  ]);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedGenres([]);
    setMinRating(0);
    setStatus("ALL");
    setSortBy("releaseDate");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilter =
    search ||
    selectedGenres.length > 0 ||
    minRating > 0 ||
    status !== "ALL" ||
    sortBy !== "releaseDate" ||
    sortOrder !== "desc";

  const selectedGenreNames = genres
    .filter((g) => selectedGenres.includes(g.id))
    .map((g) => g.name)
    .join(", ");

  const getStatusLabel = () => {
    switch (status) {
      case "ALL":
        return "Tất cả phim";
      case MovieStatus.NOW_SHOWING:
        return "Đang chiếu";
      case MovieStatus.COMING_SOON:
        return "Sắp chiếu";
      case MovieStatus.ENDED:
        return "Đã chiếu";
      default:
        return "Tất cả phim";
    }
  };

  const getSortLabel = () => {
    if (sortBy === "releaseDate")
      return sortOrder === "desc" ? "Mới nhất" : "Cũ nhất";
    if (sortBy === "rating")
      return sortOrder === "desc" ? "Đánh giá cao nhất" : "Đánh giá thấp nhất";
    if (sortBy === "title")
      return sortOrder === "asc" ? "Tên phim A → Z" : "Tên phim Z → A";
    return "Mới nhất";
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white/80 backdrop-blur rounded-3xl overflow-hidden animate-pulse shadow-lg">
      <div className="aspect-[2/3] bg-gray-300" />
      <div className="p-6 space-y-4">
        <div className="h-8 bg-gray-300 rounded-xl w-4/5" />
        <div className="h-5 bg-gray-300 rounded-lg w-3/5" />
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-gray-300 rounded-full" />
          <div className="h-8 w-28 bg-gray-300 rounded-full" />
        </div>
        <div className="h-12 bg-gray-300 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFF0EC] text-gray-900 font-sans selection:bg-[#F25019] selection:text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <Navbar />
      </div>

      <main className="mt-20 pb-20">
        <section className="py-20 px-4 text-center relative overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-5xl md:text-7xl font-bold text-[#F25019] mb-6">
              Khám Phá Phim Hay
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Tìm kiếm và đặt vé nhanh chóng cho những bộ phim hot nhất tại rạp
              chiếu
            </p>
          </div>
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl" />
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-16 -mt-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm tên phim..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 text-lg rounded-2xl border-2 border-gray-200 focus:border-[#F25019] focus:outline-none transition-all"
                />
              </div>

              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-3 px-8 py-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition font-medium"
                >
                  <X className="w-5 h-5" />
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div ref={statusDropdownRef}>
                <label className="text-sm font-bold text-gray-800 mb-4 block">
                  Trạng thái phim
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsStatusDropdownOpen(!isStatusDropdownOpen)
                    }
                    className="w-full flex items-center justify-between px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition"
                  >
                    <span className="font-medium">{getStatusLabel()}</span>
                    <ChevronDown
                      className={`w-6 h-6 transition-transform ${
                        isStatusDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl z-30">
                      {[
                        { value: "ALL", label: "Tất cả phim" },
                        { value: MovieStatus.NOW_SHOWING, label: "Đang chiếu" },
                        { value: MovieStatus.COMING_SOON, label: "Sắp chiếu" },
                        { value: MovieStatus.ENDED, label: "Đã chiếu" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setStatus(option.value as "ALL" | MovieStatus);
                            setCurrentPage(1);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-6 py-4 hover:bg-orange-50 transition font-medium ${
                            status === option.value
                              ? "bg-orange-100 text-[#F25019]"
                              : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-800 mb-4 block">
                  Đánh giá phim {minRating > 0 ? `(${minRating}★ trở lên)` : ""}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#F25019] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#F25019] [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex justify-between mt-3 text-sm font-medium">
                  <span
                    className={
                      minRating === 0 ? "text-[#F25019]" : "text-gray-500"
                    }
                  >
                    Bất kỳ
                  </span>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={
                        minRating >= i ? "text-[#F25019]" : "text-gray-500"
                      }
                    >
                      {i}★
                    </span>
                  ))}
                </div>
              </div>

              <div ref={genreDropdownRef}>
                <label className="text-sm font-bold text-gray-800 mb-4 block">
                  Thể loại
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                    className="w-full flex items-center justify-between px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-[#F25019] transition font-medium text-lg"
                  >
                    <span
                      className={
                        selectedGenres.length === 0
                          ? "text-gray-500"
                          : "text-gray-800"
                      }
                    >
                      {selectedGenres.length === 0
                        ? "Chọn thể loại"
                        : selectedGenreNames}
                    </span>
                    <ChevronDown
                      className={`w-6 h-6 transition-transform ${
                        isGenreDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isGenreDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl max-h-96 overflow-y-auto z-30">
                      {isGenresLoading ? (
                        <div className="p-6 space-y-4">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className="h-12 bg-gray-200 rounded-xl animate-pulse"
                            />
                          ))}
                        </div>
                      ) : genres.length === 0 ? (
                        <p className="p-6 text-center text-gray-500">
                          Không có thể loại
                        </p>
                      ) : (
                        <div className="py-2">
                          {genres.map((genre) => (
                            <label
                              key={genre.id}
                              className="flex items-center justify-between px-6 py-4 hover:bg-orange-50 cursor-pointer transition group"
                              onClick={() => toggleGenre(genre.id)}
                            >
                              <span className="text-lg font-medium text-gray-800">
                                {genre.name}
                              </span>

                              <div
                                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                                  selectedGenres.includes(genre.id)
                                    ? "bg-[#F25019] border-[#F25019]"
                                    : "border-gray-300 group-hover:border-gray-400"
                                }`}
                              >
                                {selectedGenres.includes(genre.id) && (
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div ref={sortDropdownRef}>
                <label className="text-sm font-bold text-gray-800 mb-4 block">
                  Sắp xếp theo
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="w-full flex items-center justify-between px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition"
                  >
                    <span className="font-medium">{getSortLabel()}</span>
                    <ChevronDown
                      className={`w-6 h-6 transition-transform ${
                        isSortDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isSortDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl z-30">
                      {[
                        {
                          sortBy: "releaseDate",
                          sortOrder: "desc",
                          label: "Mới nhất",
                        },
                        {
                          sortBy: "releaseDate",
                          sortOrder: "asc",
                          label: "Cũ nhất",
                        },
                        {
                          sortBy: "rating",
                          sortOrder: "desc",
                          label: "Đánh giá cao nhất",
                        },
                        {
                          sortBy: "rating",
                          sortOrder: "asc",
                          label: "Đánh giá thấp nhất",
                        },
                        {
                          sortBy: "title",
                          sortOrder: "asc",
                          label: "Tên phim A → Z",
                        },
                        {
                          sortBy: "title",
                          sortOrder: "desc",
                          label: "Tên phim Z → A",
                        },
                      ].map((option) => (
                        <button
                          key={`${option.sortBy}-${option.sortOrder}`}
                          onClick={() => {
                            setSortBy(
                              option.sortBy as
                                | "releaseDate"
                                | "rating"
                                | "title"
                            );
                            setSortOrder(option.sortOrder as "asc" | "desc");
                            setCurrentPage(1);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-6 py-4 hover:bg-orange-50 transition font-medium ${
                            sortBy === option.sortBy &&
                            sortOrder === option.sortOrder
                              ? "bg-orange-100 text-[#F25019]"
                              : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-4xl font-bold text-[#F25019] mb-10">
              {getStatusLabel()}
            </h2>

            {isMoviesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {[...Array(20)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-4xl font-bold text-gray-600 mb-4">
                  Không tìm thấy phim nào
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      showBookingButton={
                        movie.status === MovieStatus.NOW_SHOWING
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-20">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-4 rounded-2xl bg-white shadow-lg disabled:opacity-50 hover:bg-gray-100 transition"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </button>

                    <div className="flex gap-3">
                      {Array.from(
                        { length: Math.min(7, totalPages) },
                        (_, i) => {
                          const pageNum = i + Math.max(1, currentPage - 3);
                          if (pageNum > totalPages) return null;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-14 h-14 rounded-2xl font-bold text-lg transition shadow-md ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white"
                                  : "bg-white hover:bg-orange-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      {totalPages > 7 && (
                        <span className="text-2xl text-gray-500">...</span>
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-4 rounded-2xl bg-white shadow-lg disabled:opacity-50 hover:bg-gray-100 transition"
                    >
                      <ChevronRight className="w-7 h-7" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
