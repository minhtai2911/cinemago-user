"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
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
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl overflow-hidden animate-pulse shadow-sm border border-stone-100">
      <div className="aspect-[2/3] bg-stone-200" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-stone-200 rounded-xl w-4/5" />
        <div className="h-4 bg-stone-200 rounded-lg w-3/5" />
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-stone-200 rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-stone-800 flex flex-col bg-[#FFF8F5] relative overflow-x-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-orange-100 rounded-full blur-[100px] opacity-50 pointer-events-none fixed z-0"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-red-50 rounded-full blur-[80px] opacity-60 pointer-events-none fixed z-0"></div>

      <div className="fixed top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none z-0">
        <Image
          src="/corn.png"
          alt=""
          width={1000}
          height={1000}
          className="hidden lg:block absolute top-32 -right-20 w-[40%] max-w-[700px] opacity-10 select-none grayscale-[20%] sepia-[20%]"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />
      </div>

      <div className="sticky top-0 z-50 bg-[#FFF8F5]/90 backdrop-blur-md shadow-sm border-b border-stone-100">
        <Navbar />
      </div>

      <main className="relative z-10 flex-grow pt-10 pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <section className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block py-2 px-4 rounded-full bg-orange-50 border border-orange-100 text-[#E65100] text-xs font-bold tracking-widest uppercase mb-4">
              Danh sách phim
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-stone-800 mb-6 tracking-tight">
              Khám phá{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] to-[#FFAB91]">
                phim hay
              </span>
            </h1>
            <p className="text-lg text-stone-500 max-w-3xl mx-auto font-medium">
              Tìm kiếm phim bạn yêu thích và đặt vé nhanh chóng cùng CinemaGo!
            </p>
          </section>

          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 p-6 md:p-8 mb-16 relative z-40">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-[#E65100] transition-colors" />
                <input
                  type="text"
                  placeholder="Tìm tên phim..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 text-lg rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white focus:border-[#E65100] focus:bg-white focus:ring-4 focus:ring-orange-50 focus:outline-none transition-all font-medium text-stone-700"
                />
              </div>

              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-6 py-4 bg-stone-100 rounded-2xl hover:bg-stone-200 transition font-bold text-stone-600"
                >
                  <X className="w-5 h-5" />
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div ref={statusDropdownRef}>
                <label className="text-xs font-bold text-stone-500 mb-3 block uppercase tracking-wider">
                  Trạng thái phim
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsStatusDropdownOpen(!isStatusDropdownOpen)
                    }
                    className="w-full flex items-center justify-between px-5 py-4 bg-white border border-stone-200 rounded-2xl hover:border-[#E65100] hover:shadow-md transition-all"
                  >
                    <span className="font-bold text-stone-700">
                      {getStatusLabel()}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-400 transition-transform ${
                        isStatusDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-100 rounded-2xl shadow-xl z-50 overflow-hidden p-1">
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
                          className={`w-full text-left px-5 py-3 rounded-xl hover:bg-orange-50 transition font-medium text-sm ${
                            status === option.value
                              ? "bg-orange-50 text-[#E65100] font-bold"
                              : "text-stone-600"
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
                <label className="text-xs font-bold text-stone-500 mb-3 block uppercase tracking-wider">
                  Đánh giá {minRating > 0 ? `(${minRating}★+)` : ""}
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
                  className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-[#E65100] mt-3 hover:accent-[#FF6D00]"
                />
                <div className="relative mt-2 h-4 text-xs font-bold text-stone-400 select-none">
                  <span
                    className={`absolute left-0 ${
                      minRating === 0 ? "text-[#E65100]" : ""
                    }`}
                  >
                    Tất cả
                  </span>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`absolute top-0 ${
                        i === 5 ? "right-0" : "-translate-x-1/2"
                      } ${minRating >= i ? "text-[#E65100]" : ""}`}
                      style={i !== 5 ? { left: `${i * 20}%` } : undefined}
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div ref={genreDropdownRef}>
                <label className="text-xs font-bold text-stone-500 mb-3 block uppercase tracking-wider">
                  Thể loại
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-white border border-stone-200 rounded-2xl hover:border-[#E65100] hover:shadow-md transition-all"
                  >
                    <span
                      className={`font-bold truncate ${
                        selectedGenres.length === 0
                          ? "text-stone-400"
                          : "text-stone-700"
                      }`}
                    >
                      {selectedGenres.length === 0
                        ? "Chọn thể loại"
                        : selectedGenreNames}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-400 transition-transform ${
                        isGenreDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isGenreDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto z-50 custom-scrollbar p-1">
                      {isGenresLoading ? (
                        <div className="p-4 space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="h-8 bg-stone-100 rounded animate-pulse"
                            />
                          ))}
                        </div>
                      ) : genres.length === 0 ? (
                        <p className="p-4 text-center text-stone-500 text-sm">
                          Không có thể loại
                        </p>
                      ) : (
                        <div className="py-1">
                          {genres.map((genre) => (
                            <label
                              key={genre.id}
                              className="flex items-center justify-between px-5 py-3 hover:bg-orange-50 rounded-xl cursor-pointer transition group"
                              onClick={() => toggleGenre(genre.id)}
                            >
                              <span
                                className={`text-sm font-medium ${
                                  selectedGenres.includes(genre.id)
                                    ? "text-[#E65100] font-bold"
                                    : "text-stone-600"
                                }`}
                              >
                                {genre.name}
                              </span>

                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                  selectedGenres.includes(genre.id)
                                    ? "bg-[#E65100] border-[#E65100]"
                                    : "border-stone-300 group-hover:border-stone-400"
                                }`}
                              >
                                {selectedGenres.includes(genre.id) && (
                                  <svg
                                    className="w-3 h-3 text-white"
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
                <label className="text-xs font-bold text-stone-500 mb-3 block uppercase tracking-wider">
                  Sắp xếp
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-white border border-stone-200 rounded-2xl hover:border-[#E65100] hover:shadow-md transition-all"
                  >
                    <span className="font-bold text-stone-700">
                      {getSortLabel()}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-400 transition-transform ${
                        isSortDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isSortDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-100 rounded-2xl shadow-xl z-50 overflow-hidden p-1">
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
                          className={`w-full text-left px-5 py-3 rounded-xl hover:bg-orange-50 transition font-medium text-sm ${
                            sortBy === option.sortBy &&
                            sortOrder === option.sortOrder
                              ? "bg-orange-50 text-[#E65100] font-bold"
                              : "text-stone-600"
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

          <section className="relative z-0">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tight">
                {getStatusLabel()}
              </h2>
              <div className="h-px flex-1 bg-stone-200"></div>
            </div>

            {isMoviesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
                {[...Array(10)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : movies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-3xl border border-dashed border-stone-300">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-stone-400" />
                </div>
                <p className="text-2xl font-bold text-stone-600 mb-2">
                  Không tìm thấy phim nào
                </p>
                <p className="text-stone-500">
                  Thử thay đổi bộ lọc tìm kiếm xem sao
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
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
                  <div className="flex justify-center items-center gap-3 mt-16">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-4 rounded-2xl bg-white border border-stone-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 hover:border-[#E65100] hover:text-[#E65100] transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex gap-2">
                      {Array.from(
                        { length: Math.min(7, totalPages) },
                        (_, i) => {
                          const pageNum = i + Math.max(1, currentPage - 3);
                          if (pageNum > totalPages) return null;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-12 h-12 rounded-xl font-bold text-lg transition shadow-sm border ${
                                currentPage === pageNum
                                  ? "bg-[#E65100] text-white border-transparent shadow-orange-500/30"
                                  : "bg-white border-stone-100 text-stone-600 hover:bg-orange-50 hover:border-orange-200"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-4 rounded-2xl bg-white border border-stone-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 hover:border-[#E65100] hover:text-[#E65100] transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <div className="relative z-10 border-t border-stone-200">
        <Footer />
      </div>
    </div>
  );
}
