import Link from "next/link";
import { MapPin } from "lucide-react";

import { getCinemaById, getMovies } from "@/services";
import { MovieStatus } from "@/types/movie";
import type { Movie, Cinema } from "@/types";
import MovieScheduleCard from "@/components/movie/MovieScheduleCard";
import Navbar from "@/components/Navbar";
import FixedMenu from "@/components/FixedMenu";

export default async function CinemaDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const { id } = await params;
  const { tab = "now" } = await searchParams;

  const [cinemaRes, nowShowingRes, comingSoonRes] = await Promise.all([
    getCinemaById(id),
    getMovies(undefined, 50, "", undefined, "", true, MovieStatus.NOW_SHOWING),
    getMovies(undefined, 50, "", undefined, "", true, MovieStatus.COMING_SOON),
  ]);

  const cinema: Cinema = cinemaRes.data || cinemaRes;
  const nowShowingMovies: Movie[] = nowShowingRes.data || [];
  const comingSoonMovies: Movie[] = comingSoonRes.data || [];

  const isNowTab = tab === "now";
  const isSoonTab = tab === "soon";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">
        <Navbar />
      </div>
      <FixedMenu />

      <div className="relative h-80 overflow-hidden pt-20">
        <div className="absolute bottom-8 left-8 right-8 z-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
            {cinema.name}
          </h1>
          <div className="flex items-center gap-4 text-xl text-gray-200">
            <MapPin className="w-8 h-8" />
            <span>{cinema.address}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-12 border-b border-gray-700 text-2xl font-bold mb-12">
          <Link
            href={{ query: { tab: "now" } }}
            className={`pb-4 transition ${
              isNowTab
                ? "text-yellow-500 border-b-4 border-yellow-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            PHIM ĐANG CHIẾU
          </Link>
          <Link
            href={{ query: { tab: "soon" } }}
            className={`pb-4 transition ${
              isSoonTab
                ? "text-yellow-500 border-b-4 border-yellow-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            PHIM SẮP CHIẾU
          </Link>
          <div className="ml-auto pb-4 text-gray-400 hover:text-white cursor-pointer">
            BẢNG GIÁ VÉ
          </div>
        </div>

        {isNowTab && (
          <section className="space-y-12">
            {nowShowingMovies.length === 0 ? (
              <div className="text-center py-20 text-2xl text-gray-500">
                Hiện tại rạp chưa có phim đang chiếu
              </div>
            ) : (
              nowShowingMovies.map((movie) => (
                <MovieScheduleCard key={movie.id} movie={movie} cinemaId={id} />
              ))
            )}
          </section>
        )}

        {isSoonTab && (
          <section className="space-y-12">
            {comingSoonMovies.length === 0 ? (
              <div className="text-center py-20 text-2xl text-gray-500">
                Hiện tại rạp chưa có phim đang chiếu
              </div>
            ) : (
              comingSoonMovies.map((movie) => (
                <MovieScheduleCard key={movie.id} movie={movie} cinemaId={id} />
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}
