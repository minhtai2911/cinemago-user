"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-[#1f2937] overflow-x-hidden flex flex-col">
      <div className="sticky top-0 z-50 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-orange-100/50 shadow-sm">
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col gap-10">
        <section className="relative w-full pt-8 pb-4 px-4">
          <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-[100vw]">
            <img
              src="/popcorn.png"
              alt=""
              className="hidden lg:block absolute -left-20 top-10 w-[250px] opacity-20 rotate-12 blur-[1px] z-0"
            />
            <img
              src="/popcorn.png"
              alt=""
              className="hidden lg:block absolute -right-20 top-40 w-[300px] opacity-20 -rotate-12 blur-[1px] z-0"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="rounded-3xl p-[2px] bg-white/30 backdrop-blur-sm border border-white/40 shadow-2xl">
              <div className="rounded-2xl overflow-hidden">
                <HeroSection />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 relative z-20 -mt-6">
          <QuickBooking />
        </div>

        <div className="flex flex-col gap-16 mt-4">
          <NowShowing />

          <div className="container mx-auto px-4">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
          </div>

          <ComingSoon />
          <Features />
        </div>
      </main>

      <Footer />
    </div>
  );
}
