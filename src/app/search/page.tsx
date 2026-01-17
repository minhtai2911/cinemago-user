"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMovies, getCinemas } from "@/services";
import MovieCard from "@/components/movie/MovieCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Movie,
  PaginatedMovieResponse,
  Cinema,
  PaginatedCinemaResponse,
} from "@/types";
import {
  MapPin,
  Search,
  Ticket,
  CalendarDays,
  ArrowRight,
  Film,
} from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("keyword")?.trim() || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieRes: PaginatedMovieResponse = await getMovies(
          1,
          20,
          query,
          undefined,
          undefined,
          true,
        );
        setMovies(movieRes.data);

        const cinemaRes: PaginatedCinemaResponse = await getCinemas(
          1,
          20,
          query,
          true,
        );
        setCinemas(cinemaRes.data);
      } catch (err) {
        setError("Không thể tải kết quả tìm kiếm. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const AmbientBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F1] to-[#fffefc]"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-300/20 to-rose-300/20 blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-rose-200/20 to-orange-200/30 blur-[120px] opacity-60"></div>
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-orange-100/40 blur-[80px] opacity-50"></div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#F25019 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>
    </div>
  );

  if (!query) {
    return (
      <div className="min-h-screen flex flex-col relative bg-[#FFF5F1]">
        <AmbientBackground />
        <div className="relative z-10 w-full">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative z-10">
          <div className="w-24 h-24 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-[0_8px_30px_rgb(242,80,25,0.1)] border border-white/50">
            <Search className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
            Bạn đang tìm gì hôm nay?
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Nhập tên phim, rạp chiếu để bắt đầu khám phá thế giới điện ảnh đầy
            màu sắc.
          </p>
        </div>
        <div className="relative z-10 w-full">
          <Footer />
        </div>
      </div>
    );
  }

  if (loading || error) {
    return (
      <div className="min-h-screen flex flex-col relative bg-[#FFF5F1]">
        <AmbientBackground />
        <div className="relative z-10 w-full">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative z-10">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-6 h-6 text-orange-500/50" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-700">
                Đang tìm kiếm dữ liệu...
              </p>
            </div>
          )}
          {error && (
            <div className="bg-red-50/90 backdrop-blur border border-red-100 p-8 rounded-3xl shadow-sm inline-block">
              <p className="text-xl text-red-600 font-bold">{error}</p>
            </div>
          )}
        </div>
        <div className="relative z-10 w-full">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-orange-100 selection:text-orange-900 flex flex-col relative bg-[#FFF5F1]">
      <AmbientBackground />

      <div className="relative z-10 w-full">
        <Navbar />
      </div>

      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-16">
        {/* Header Summary */}
        <div className="mb-16 text-center">
          <p className="text-gray-500 mb-2 font-medium uppercase tracking-wider text-sm">
            Kết quả tìm kiếm cho
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            &ldquo;
            <span className="bg-gradient-to-r from-[#F25019] to-red-500 bg-clip-text text-transparent">
              {query}
            </span>
            &rdquo;
          </h1>
        </div>

        {/* --- SECTION MOVIES --- */}
        <section className="mb-24">
          <div className="flex items-end gap-4 mb-10 border-b-2 border-orange-100/50 pb-4">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
              Kết quả tìm kiếm{" "}
              <span className="bg-gradient-to-r from-[#FF7043] to-[#FFAB91] bg-clip-text text-transparent">
                PHIM
              </span>
            </h2>
            <span className="mb-2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {movies.length} kết quả
            </span>
          </div>

          {movies.length === 0 ? (
            <div className="relative overflow-hidden rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 p-16 text-center shadow-[0_8px_30px_rgb(242,80,25,0.03)]">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-orange-400/10 to-transparent blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-gradient-to-tr from-rose-400/10 to-transparent blur-3xl"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-orange-50 to-white rounded-full flex items-center justify-center mb-6 text-orange-400 shadow-lg border border-white">
                  <Ticket className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Không tìm thấy phim phù hợp
                </h3>
                <p className="text-gray-500 font-medium">
                  Rất tiếc, chúng tôi không tìm thấy bộ phim nào khớp với từ
                  khóa &quot;{query}&quot;.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* --- SECTION CINEMAS --- */}
        <section>
          <div className="flex items-end gap-4 mb-10 border-b-2 border-orange-100/50 pb-4">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
              Kết quả tìm kiếm{" "}
              <span className="bg-gradient-to-r from-[#FF7043] to-[#FFAB91] bg-clip-text text-transparent">
                RẠP CHIẾU
              </span>
            </h2>
            <span className="mb-2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {cinemas.length} kết quả
            </span>
          </div>

          {cinemas.length === 0 ? (
            <div className="relative overflow-hidden rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 p-16 text-center shadow-[0_8px_30px_rgb(242,80,25,0.03)]">
              <div className="absolute top-0 left-0 -ml-16 -mt-16 w-56 h-56 rounded-full bg-orange-100/30 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-56 h-56 rounded-full bg-rose-100/30 blur-3xl"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-tl from-orange-50 to-white rounded-full flex items-center justify-center mb-6 text-orange-400 shadow-lg border border-white">
                  <MapPin className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Không tìm thấy rạp chiếu
                </h3>
                <p className="text-gray-500 font-medium">
                  Hiện tại không có rạp chiếu nào khớp với thông tin bạn tìm
                  kiếm.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cinemas.map((cinema) => (
                <Link
                  href={`/cinemas/${cinema.id}`}
                  key={cinema.id}
                  className="group block h-full"
                >
                  <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-white/50 shadow-sm flex flex-col">
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#F25019] via-orange-500 to-rose-400"></div>

                    <div className="p-7 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-[#F25019] transition-colors">
                          {cinema.name}
                        </h3>
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F25019] group-hover:bg-[#F25019] group-hover:text-white transition-colors duration-300">
                          <Ticket size={20} />
                        </div>
                      </div>

                      <div className="space-y-4 mb-6 flex-1">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0 group-hover:text-[#F25019] transition-colors" />
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {cinema.address}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            {cinema.city}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                            Rạp 2D/3D
                          </span>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-dashed border-gray-200 mt-auto">
                        <div className="flex items-center justify-between text-sm font-bold text-[#F25019]">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={18} />
                            XEM LỊCH CHIẾU
                          </span>
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-[#F25019] group-hover:text-white transition-all">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}
