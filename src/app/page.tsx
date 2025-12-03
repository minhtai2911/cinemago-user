"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FixedMenu from "@/components/FixedMenu";
import HeroSection from "@/components/sections/HeroSection";
import NowShowing from "@/components/sections/NowShowing";
import ComingSoon from "@/components/sections/ComingSoon";
import Features from "@/components/sections/Features";
import QuickBooking from "@/components/sections/QuickBooking";
import Footer from "@/components/Footer";
import { getMovies } from "@/services/movieService";
import { getCinemas } from "@/services/cinemaService";
import { getShowtimes } from "@/services/showtimeService";
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
        const [nowRes, soonRes, cinemaRes, showtimesRes] = await Promise.all([
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
        setShowtimes(showtimesRes.data || []);
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
    <div className="min-h-screen bg-peach-gradient text-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">
        <Navbar />
      </div>
      <main className="flex-1">
        <HeroSection />
        <QuickBooking />
        <NowShowing />
        <ComingSoon />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
