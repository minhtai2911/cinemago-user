"use client";

import { useEffect, useMemo } from "react";
import { Cinema, Movie, Showtime } from "@/types";
import { toast } from "sonner";
import { ChevronDown, Calendar, Clock, MapPin, Film } from "lucide-react";
import { useRouter } from "next/navigation";
interface QuickBookingProps {
  cinemas: Cinema[];
  nowShowing: Movie[];
  showtimes: Showtime[];
  selectedMovie: string;
  selectedCinema: string;
  selectedShowtime: string;
  selectedDate: string;
  setSelectedMovie: (v: string) => void;
  setSelectedCinema: (v: string) => void;
  setSelectedShowtime: (v: string) => void;
  setSelectedDate: (v: string) => void;
}

export default function QuickBooking({
  cinemas,
  nowShowing,
  showtimes,
  selectedMovie,
  selectedCinema,
  selectedShowtime,
  selectedDate,
  setSelectedMovie,
  setSelectedCinema,
  setSelectedShowtime,
  setSelectedDate,
}: QuickBookingProps) {
  const router = useRouter();

  useEffect(() => {
    setSelectedDate("");
    setSelectedShowtime("");
  }, [selectedMovie, setSelectedDate, setSelectedShowtime]);

  useEffect(() => {
    setSelectedDate("");
    setSelectedShowtime("");
  }, [selectedCinema, setSelectedDate, setSelectedShowtime]);

  const now = useMemo(() => new Date(), []);

  const availableMovies = useMemo(() => {
    const validShowtimes = showtimes.filter((s) => new Date(s.startTime) > now);

    if (!selectedCinema) {
      const movieIds = new Set(validShowtimes.map((s) => s.movieId));
      return nowShowing.filter((m) => movieIds.has(m.id));
    }

    const movieIds = new Set(
      validShowtimes
        .filter((s) => s.cinemaId === selectedCinema)
        .map((s) => s.movieId)
    );
    return nowShowing.filter((m) => movieIds.has(m.id));
  }, [nowShowing, showtimes, selectedCinema, now]);

  const availableCinemas = useMemo(() => {
    const validShowtimes = showtimes.filter((s) => new Date(s.startTime) > now);

    if (!selectedMovie) {
      const cinemaIds = new Set(validShowtimes.map((s) => s.cinemaId));
      return cinemas.filter((c) => cinemaIds.has(c.id));
    }

    const cinemaIds = new Set(
      validShowtimes
        .filter((s) => s.movieId === selectedMovie)
        .map((s) => s.cinemaId)
    );
    return cinemas.filter((c) => cinemaIds.has(c.id));
  }, [cinemas, showtimes, selectedMovie, now]);

  const availableDates = useMemo(() => {
    if (!selectedMovie || !selectedCinema) return [];

    const dates = new Set(
      showtimes
        .filter((s) => {
          const d = new Date(s.startTime);
          return (
            s.movieId === selectedMovie &&
            s.cinemaId === selectedCinema &&
            d > now
          );
        })
        .map((s) =>
          new Date(s.startTime).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        )
    );

    return Array.from(dates);
  }, [showtimes, selectedMovie, selectedCinema, now]);

  const availableShowtimes = useMemo(() => {
    if (!selectedMovie || !selectedCinema || !selectedDate) return [];

    return showtimes
      .filter((s) => {
        const d = new Date(s.startTime);
        const dateString = d.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return (
          s.movieId === selectedMovie &&
          s.cinemaId === selectedCinema &&
          dateString === selectedDate &&
          d > now
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  }, [showtimes, selectedMovie, selectedCinema, selectedDate, now]);

  const handleBooking = () => {
    if (!selectedShowtime) {
      toast.error("Vui lòng chọn đầy đủ thông tin!");
      return;
    }
    toast.success("Đang chuyển đến trang đặt vé...");
    router.push(`/booking/${selectedShowtime}`);
  };

  return (
    <div className="relative -mt-24 z-30 container mx-auto px-4 mb-16">
      <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="flex gap-8 mb-6 border-b border-gray-700 pb-4">
          <button className="text-[#F25019] font-bold text-lg border-b-2 border-[#F25019] pb-4 -mb-4.5 uppercase tracking-wide">
            Mua vé nhanh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-400 group-hover:text-[#F25019] transition-colors">
              <Film size={16} /> Chọn Phim
            </div>
            <div className="relative">
              <select
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#F25019] text-white font-medium truncate pr-10 cursor-pointer hover:border-[#F25019] transition-colors"
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
              >
                <option value="">Chọn phim</option>
                {availableMovies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-400 group-hover:text-[#F25019] transition-colors">
              <MapPin size={16} /> Chọn Rạp
            </div>
            <div className="relative">
              <select
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#F25019] text-white font-medium truncate pr-10 cursor-pointer hover:border-[#F25019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
              >
                <option value="">Chọn rạp</option>
                {availableCinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-400 group-hover:text-[#F25019] transition-colors">
              <Calendar size={16} /> Chọn Ngày
            </div>
            <div className="relative">
              <select
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#F25019] text-white font-medium truncate pr-10 cursor-pointer hover:border-[#F25019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={!selectedMovie || !selectedCinema}
              >
                <option value="">Chọn ngày</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <div className="relative flex-1 group">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-400 group-hover:text-[#F25019] transition-colors">
                <Clock size={16} /> Suất Chiếu
              </div>
              <div className="relative">
                <select
                  className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#F25019] text-white font-medium truncate pr-10 cursor-pointer hover:border-[#F25019] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedShowtime}
                  onChange={(e) => setSelectedShowtime(e.target.value)}
                  disabled={!selectedDate || !selectedMovie || !selectedCinema}
                >
                  <option value="">Chọn suất</option>
                  {availableShowtimes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {new Date(s.startTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedShowtime}
              className="bg-[#F25019] hover:bg-[#d14012] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg h-[50px] whitespace-nowrap flex items-center justify-center"
            >
              MUA VÉ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
