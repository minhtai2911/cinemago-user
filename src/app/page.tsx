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
    <div className="relative min-h-screen font-sans selection:bg-[#F25019] selection:text-white">
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#FFF9F6]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F2] via-[#FFF9F6] to-white opacity-80" />

        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#FF8E53]/10 rounded-full blur-[120px]" />

        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-[#F25019]/5 rounded-full blur-[100px]" />

        <div className="absolute top-0 right-0 w-[40%] max-w-[600px] h-[800px] opacity-[0.15]">
          <Image
            src="/corn.webp"
            alt="Background Decoration"
            fill
            className="object-contain object-right-top"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white/20">
          <Navbar />
        </div>

        <main className="flex-grow">
          <BannerSlider movies={nowShowing} />

          <div className="container mx-auto px-4 -mt-24 mb-16 relative z-30">
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

          <div className="space-y-16 pb-24">
            <MovieSection
              title="PHIM ĐƯỢC ĐÁNH GIÁ CAO"
              movies={topRatedMovies}
              showBookingButton
            />

            <div className="container mx-auto px-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F25019]/20 to-transparent" />
            </div>

            <MovieSection
              title="PHIM ĐANG CHIẾU"
              movies={nowShowing}
              showBookingButton
            />

            <div className="container mx-auto px-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F25019]/20 to-transparent" />
            </div>

            <MovieSection title="PHIM SẮP CHIẾU" movies={comingSoon} />
          </div>

          <Features />
        </main>

        <Footer />
      </div>
    </div>
  );
}
