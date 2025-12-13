"use client";

import { useEffect, useState } from "react";
import { getMovies, getCinemas, getShowtimes } from "@/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BannerSlider from "@/components/BannerSlider";
import QuickBooking from "@/components/QuickBooking";
import MovieSection from "@/components/MovieSection";
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

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [nowRes, soonRes, cinemaRes, showtimes] = await Promise.all([
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
        ]);

        setNowShowing(nowRes.data || []);
        setComingSoon(soonRes.data || []);
        setCinemas(cinemaRes.data || []);
        setShowtimes(showtimes.data || []);
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white text-gray-900 flex flex-col font-sans">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <main>
        <BannerSlider movies={nowShowing} />

        {/* QuickBooking */}
        <div className="relative z-30 container mx-auto px-4 -mt-24 mb-16">
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

        <div className="container mx-auto px-4 pb-20 space-y-20">
          <MovieSection
            title="PHIM ĐANG CHIẾU"
            movies={nowShowing}
            showBookingButton
            showMoreLink="/movies/now-showing"
          />

          <div className="w-full h-px bg-gray-200" />

          <MovieSection
            title="PHIM SẮP CHIẾU"
            movies={comingSoon}
            showMoreLink="/movies/coming-soon"
          />
        </div>

        <Features />
      </main>

      <Footer />
    </div>
  );
}
