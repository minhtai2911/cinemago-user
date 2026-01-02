"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  addDays,
  startOfToday,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { vi } from "date-fns/locale";
import { MapPin, Calendar, Loader2, Film, Clock } from "lucide-react";
import Link from "next/link";
import { getCinemas, getCinemaById, getShowtimes, getMovies } from "@/services";
import { Cinema, Showtime, Movie, MovieStatus } from "@/types";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ShowtimesPage() {
  const today = startOfToday();
  const userTimezone = "Asia/Ho_Chi_Minh";

  const availableDates = [
    today,
    addDays(today, 1),
    addDays(today, 2),
    addDays(today, 3),
  ];

  const [selectedDate, setSelectedDate] = useState<Date>(availableDates[0]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [nowShowingMovies, setNowShowingMovies] = useState<Movie[]>([]);
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  const getDateRangeForAPI = (localDate: Date) => {
    const vnDate = toZonedTime(localDate, userTimezone);
    const vnStartOfDay = startOfDay(vnDate);
    const vnEndOfDay = endOfDay(vnDate);
    const utcStart = fromZonedTime(vnStartOfDay, userTimezone);
    const utcEnd = fromZonedTime(vnEndOfDay, userTimezone);
    return { startTime: utcStart, endTime: utcEnd };
  };

  useEffect(() => {
    const loadCinemas = async () => {
      setLoadingCinemas(true);
      try {
        const res = await getCinemas(undefined, 100, "", true);
        const cinemaList = res.data || [];
        setCinemas(cinemaList);
        if (cinemaList.length > 0 && !selectedCinemaId) {
          setSelectedCinemaId(cinemaList[0].id);
        }
      } catch (err) {
        console.error("Lỗi tải rạp:", err);
      } finally {
        setLoadingCinemas(false);
      }
    };
    loadCinemas();
  }, [selectedCinemaId]);

  useEffect(() => {
    const loadNowShowingMovies = async () => {
      try {
        const res = await getMovies(
          undefined,
          undefined,
          "",
          undefined,
          undefined,
          true,
          MovieStatus.NOW_SHOWING
        );
        setNowShowingMovies(res.data || []);
      } catch (err) {
        console.error("Lỗi tải phim đang chiếu:", err);
      }
    };
    loadNowShowingMovies();
  }, []);

  useEffect(() => {
    if (!selectedCinemaId) return;
    const loadCinema = async () => {
      try {
        const res = await getCinemaById(selectedCinemaId);
        setSelectedCinema(res.data);
      } catch (err) {
        console.error("Lỗi tải rạp:", err);
        setSelectedCinema(null);
      }
    };
    loadCinema();
  }, [selectedCinemaId]);

  const loadShowtimes = useCallback(async () => {
    if (!selectedCinemaId) {
      setShowtimes([]);
      return;
    }

    setLoadingShowtimes(true);
    try {
      const { startTime, endTime } = getDateRangeForAPI(selectedDate);
      const res = await getShowtimes(
        undefined,
        undefined,
        undefined,
        selectedCinemaId,
        true,
        startTime,
        endTime
      );
      setShowtimes(res.data || []);
    } catch (err) {
      console.error("Lỗi tải lịch chiếu:", err);
      setShowtimes([]);
    } finally {
      setLoadingShowtimes(false);
    }
  }, [selectedCinemaId, selectedDate]);

  useEffect(() => {
    loadShowtimes();
  }, [loadShowtimes]);

  const formatShowtime = (utcTime: string) => {
    const utcDate = parseISO(utcTime);
    const vnTime = toZonedTime(utcDate, userTimezone);
    return format(vnTime, "HH:mm");
  };

  const groupedByMovie = showtimes.reduce(
    (
      acc: Record<string, { movie?: Movie; sessions: Showtime[] }>,
      st: Showtime
    ) => {
      const movie = nowShowingMovies.find((m) => m.id === st.movieId);
      if (!acc[st.movieId]) {
        acc[st.movieId] = { movie, sessions: [] };
      }
      acc[st.movieId].sessions.push(st);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#F25019] to-orange-600 bg-clip-text text-transparent mb-4">
            Lịch Chiếu Phim
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chọn rạp và ngày để xem lịch chiếu chi tiết
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-white/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-[#F25019]" />
                <span className="text-lg font-bold text-gray-800">
                  Ngày chiếu
                </span>
              </div>
              <select
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => {
                  const newDate = availableDates.find(
                    (d) => format(d, "yyyy-MM-dd") === e.target.value
                  );
                  if (newDate) setSelectedDate(newDate);
                }}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#F25019] bg-white/50 backdrop-blur-sm text-lg font-medium transition-all"
              >
                {availableDates.map((date) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  const displayLabel = format(date, "EEEE, dd/MM/yyyy", {
                    locale: vi,
                  });
                  const todayLabel =
                    dateStr === format(today, "yyyy-MM-dd") ? " (Hôm nay)" : "";
                  return (
                    <option key={dateStr} value={dateStr}>
                      {displayLabel}
                      {todayLabel}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#F25019]" />
                <span className="text-lg font-bold text-gray-800">
                  Chọn rạp
                </span>
              </div>
              {loadingCinemas ? (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Loader2 className="w-6 h-6 text-[#F25019] animate-spin" />
                  <span>Đang tải rạp...</span>
                </div>
              ) : (
                <select
                  value={selectedCinemaId}
                  onChange={(e) => setSelectedCinemaId(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#F25019] bg-white/50 backdrop-blur-sm text-lg font-medium transition-all"
                >
                  <option value="">-- Chọn rạp chiếu --</option>
                  {cinemas.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name} - {cinema.city}
                    </option>
                  ))}
                </select>
              )}
              {selectedCinema && (
                <div className="mt-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="font-semibold text-gray-800">
                    {selectedCinema.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedCinema.address}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {loadingShowtimes ? (
            <div className="flex flex-col items-center py-24">
              <Loader2 className="w-16 h-16 text-[#F25019] animate-spin mb-6" />
              <p className="text-xl text-gray-500 font-semibold">
                Đang tải lịch chiếu...
              </p>
              <p className="text-gray-500 mt-2">
                {format(selectedDate, "dd/MM/yyyy", { locale: vi })} tại{" "}
                {selectedCinema?.name || "..."}
              </p>
            </div>
          ) : Object.keys(groupedByMovie).length === 0 ? (
            <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-2xl">
              <Film className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                Không có suất chiếu
              </h3>
              <p className="text-lg text-gray-500">
                Ngày {format(selectedDate, "dd/MM/yyyy", { locale: vi })} tại
                rạp {selectedCinema?.name || "đã chọn"} chưa có lịch chiếu
              </p>
            </div>
          ) : (
            Object.values(groupedByMovie).map(({ movie, sessions }) => {
              if (!movie) return null;

              return (
                <div
                  key={movie.id}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all group"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-64 p-6 lg:p-8">
                      <div className="relative h-80 lg:h-full lg:aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                          src={movie.thumbnail || "/placeholder-movie.jpg"}
                          alt={movie.title}
                          width={280}
                          height={420}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-[#F25019]/90 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {sessions[0]?.format || "2D"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-8 lg:pt-12">
                      <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                        {movie.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mb-8">
                        <div>
                          <span className="font-semibold">Thể loại:</span>{" "}
                          {movie.genres.map((g) => g.name).join(", ") || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Thời lượng:</span>{" "}
                          {movie.duration} phút
                        </div>
                        <div>
                          <span className="font-semibold">Đánh giá:</span> ⭐{" "}
                          {movie.rating.toFixed(1)}
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                          <Clock className="w-6 h-6 text-[#F25019]" />
                          <span className="text-2xl font-bold text-gray-900">
                            Suất chiếu
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                          {sessions
                            .sort((a, b) =>
                              a.startTime.localeCompare(b.startTime)
                            )
                            .map((session) => (
                              <Link
                                key={session.id}
                                href={`/booking?movie=${movie.id}&showtime=${session.id}`}
                                className="block p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-[#F25019] hover:to-orange-600 hover:text-white text-center font-bold shadow-md hover:shadow-xl hover:scale-105 transition-all"
                              >
                                <div className="text-lg">
                                  {formatShowtime(session.startTime)}
                                </div>
                                <div className="text-xs mt-1 opacity-80">
                                  {session.format} • {session.language}
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <Link
                          href={`/movies/${movie.id}`}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-bold text-center transition-all"
                        >
                          Chi tiết phim
                        </Link>
                        <Link
                          href={`/booking?movie=${movie.id}`}
                          className="flex-1 bg-gradient-to-r from-[#F25019] to-orange-600 hover:from-orange-600 hover:to-[#F25019] text-white py-4 px-6 rounded-xl font-bold text-center transition-all shadow-xl"
                        >
                          Đặt vé ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
