"use client";

import { useEffect, useMemo } from "react";
import { Cinema, Movie, Showtime } from "@/types";
import { toast } from "sonner";

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

  return (
    <div className="bg-gray-800 p-6 mx-6 rounded-2xl shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">🎟️ Đặt vé nhanh</h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          className="bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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

        <select
          className="bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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

        <select
          className="bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
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

        <select
          className="bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          value={selectedShowtime}
          onChange={(e) => setSelectedShowtime(e.target.value)}
          disabled={!selectedDate || !selectedMovie || !selectedCinema}
        >
          <option value="">Chọn suất chiếu</option>
          {availableShowtimes.map((s) => (
            <option key={s.id} value={s.id}>
              {new Date(s.startTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </option>
          ))}
        </select>

        <button
          className="col-span-1 bg-red-600 hover:bg-red-700 rounded-lg p-3 text-white font-medium transition"
          onClick={() => {
            if (!selectedShowtime) toast.info("Vui lòng chọn suất chiếu!");
            else toast.success("Đang chuyển đến trang đặt vé...");
          }}
        >
          Đặt vé
        </button>
      </div>
    </div>
  );
}
