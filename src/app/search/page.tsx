"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMovies, getCinemas } from "@/services";
import MovieCard from "@/components/movie/MovieCard";
import Navbar from "@/components/Navbar";
import {
  Movie,
  PaginatedMovieResponse,
  Cinema,
  PaginatedCinemaResponse,
} from "@/types";
import { MapPin, Building2 } from "lucide-react";
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
          true
        );
        setMovies(movieRes.data);

        const cinemaRes: PaginatedCinemaResponse = await getCinemas(
          1,
          20,
          query,
          true
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

  if (!query) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Vui lòng nhập từ khóa để tìm kiếm phim hoặc rạp chiếu
          </h1>
        </div>
      </>
    );
  }

  if (loading || error) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          {loading && (
            <p className="text-xl text-gray-600">Đang tải kết quả...</p>
          )}
          {error && <p className="text-xl text-red-600">{error}</p>}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              KẾT QUẢ TÌM KIẾM PHIM
            </h2>
          </div>

          {movies.length === 0 && !loading ? (
            <p className="text-center text-gray-500 py-12">
              Không tìm thấy phim nào phù hợp.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              KẾT QUẢ TÌM KIẾM RẠP CHIẾU
            </h2>
          </div>

          {cinemas.length === 0 && !loading ? (
            <p className="text-center text-gray-500 py-12">
              Không tìm thấy rạp chiếu nào phù hợp.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cinemas.map((cinema) => (
                <Link href={`/cinemas/${cinema.id}`} key={cinema.id}>
                  <div
                    key={cinema.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-orange-200"
                  >
                    <div className="h-48 bg-gradient-to-br from-[#F25019]/10 to-[#E9391B]/10 flex items-center justify-center">
                      <Building2 className="w-20 h-20 text-[#F25019]/60" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {cinema.name}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-gray-600">
                          <MapPin className="w-5 h-5 text-[#F25019] mt-0.5 flex-shrink-0" />
                          <p className="text-sm leading-relaxed">
                            {cinema.address}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                            {cinema.city}
                          </span>
                        </div>
                      </div>

                      <button className="mt-6 w-full py-3 bg-[#F25019] text-white font-bold rounded-xl hover:bg-[#d14012] transition active:scale-95 shadow-sm hover:shadow-orange-200">
                        XEM LỊCH CHIẾU
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
