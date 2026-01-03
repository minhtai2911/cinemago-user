"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getMovies,
  getCinemas,
  getShowtimes,
  getTopRatedMovies,
} from "@/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BannerSlider from "@/components/BannerSlider";
import QuickBooking from "@/components/booking/QuickBooking";
import MovieSection from "@/components/movie/MovieSection";
import Features from "@/components/sections/Features";
import { Movie, Cinema, Showtime, MovieStatus } from "@/types";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";

export default function HomePage() {
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [nowRes, soonRes, cinemaRes, showtimes, topRatedRes] =
          await Promise.all([
            getMovies(
              undefined,
              undefined,
              "",
              undefined,
              "",
              true,
              MovieStatus.NOW_SHOWING
            ),
            getMovies(
              undefined,
              undefined,
              "",
              undefined,
              "",
              true,
              MovieStatus.COMING_SOON
            ),
            getCinemas(undefined, undefined, "", true),
            getShowtimes(
              undefined,
              undefined,
              undefined,
              undefined,
              true,
              new Date()
            ),
            getTopRatedMovies(10),
          ]);

        setNowShowing(nowRes.data || []);
        setComingSoon(soonRes.data || []);
        setCinemas(cinemaRes.data || []);
        setShowtimes(showtimes.data || []);
        setTopRatedMovies(topRatedRes.data || []);
      } catch {
        toast.error("Đã có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-[#F25019] selection:text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <Navbar />
      </div>

      <main className="mt-20 relative bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFF0EC] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-200/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4"></div>
          <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[100px] -translate-x-1/3"></div>

          <Image
            src="/corn.png"
            alt=""
            width={600}
            height={600}
            className="hidden 2xl:block absolute top-[15%] -left-20 w-[15%] max-w-[300px] opacity-10 select-none object-contain animate-float"
            style={{ transform: "rotate(15deg)" }}
          />
        </div>

        <div className="relative z-10">
          <BannerSlider movies={topRatedMovies} />

          <div className="container mx-auto px-4 -mt-24 mb-20 relative z-30">
            <QuickBooking
              cinemas={cinemas}
              nowShowing={nowShowing}
              showtimes={showtimes}
              selectedMovie={selectedMovie}
              selectedCinema={selectedCinema}
              selectedShowtime={selectedShowtime}
              selectedDate={selectedDate}
              setSelectedMovie={setSelectedMovie}
              setSelectedCinema={setSelectedCinema}
              setSelectedShowtime={setSelectedShowtime}
              setSelectedDate={setSelectedDate}
            />
          </div>

          <div className="container mx-auto px-4 pb-20 space-y-24">
            <MovieSection
              title="PHIM ĐƯỢC ĐÁNH GIÁ CAO"
              movies={topRatedMovies}
              showBookingButton
            />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-60" />

            <MovieSection
              title="PHIM ĐANG CHIẾU"
              movies={nowShowing}
              showBookingButton
            />

            <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-60" />

            <MovieSection title="PHIM SẮP CHIẾU" movies={comingSoon} />
          </div>

          <Features />
        </div>
      </main>

      <Footer />
    </div>
  );
}
