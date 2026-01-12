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
import {
  MapPin,
  Calendar,
  Loader2,
  Film,
  Clock,
  ChevronDown,
  Star,
  Info,
} from "lucide-react";
import Link from "next/link";
import { getCinemas, getCinemaById, getShowtimes, getMovies } from "@/services";
import { Cinema, Showtime, Movie, MovieStatus } from "@/types";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <div className="relative min-h-screen bg-peach-gradient flex flex-col font-sans">
      <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>

      <div className="fixed top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none z-0">
        <Image
          src="/corn.png"
          alt=""
          width={1000}
          height={1000}
          className="hidden lg:block absolute top-32 -right-10 w-[45%] max-w-[800px] opacity-20 select-none"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />
      </div>

      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/30">
        <Navbar />
      </div>

      <main className="relative z-10 flex-grow pt-10 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block py-2 px-4 rounded-full bg-white/80 border border-orange-200 text-[#F25019] text-xs font-bold tracking-widest uppercase mb-4 shadow-sm backdrop-blur-sm">
              Đặt vé ngay
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight drop-shadow-sm">
              Lịch chiếu <span className="text-[#F25019]">phim</span>
            </h1>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6 md:p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-stone-800 mb-2 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-[#F25019]" />
                  Ngày chiếu
                </label>
                <div className="relative group">
                  <select
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={(e) => {
                      const newDate = availableDates.find(
                        (d) => format(d, "yyyy-MM-dd") === e.target.value
                      );
                      if (newDate) setSelectedDate(newDate);
                    }}
                    className="w-full pl-6 pr-12 py-4 bg-gray-50/50 hover:bg-white border border-gray-200 hover:border-[#F25019] rounded-xl focus:border-[#F25019] focus:bg-white focus:outline-none transition-all appearance-none text-lg font-medium text-stone-700 cursor-pointer shadow-sm"
                  >
                    {availableDates.map((date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const displayLabel = format(date, "EEEE, dd/MM/yyyy", {
                        locale: vi,
                      });
                      const todayLabel =
                        dateStr === format(today, "yyyy-MM-dd")
                          ? " (Hôm nay)"
                          : "";
                      return (
                        <option key={dateStr} value={dateStr}>
                          {displayLabel}
                          {todayLabel}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#F25019] transition-colors pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-stone-800 mb-2 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#F25019]" />
                  Rạp chiếu
                </label>
                <div className="relative group">
                  {loadingCinemas ? (
                    <div className="w-full px-6 py-4 bg-gray-50/50 rounded-xl flex items-center gap-3 text-gray-500 font-medium border border-gray-200">
                      <Loader2 className="w-5 h-5 animate-spin text-[#F25019]" />
                      <span>Đang tải danh sách rạp...</span>
                    </div>
                  ) : (
                    <>
                      <select
                        value={selectedCinemaId}
                        onChange={(e) => setSelectedCinemaId(e.target.value)}
                        className="w-full pl-6 pr-12 py-4 bg-gray-50/50 hover:bg-white border border-gray-200 hover:border-[#F25019] rounded-xl focus:border-[#F25019] focus:bg-white focus:outline-none transition-all appearance-none text-lg font-medium text-stone-700 cursor-pointer shadow-sm"
                      >
                        <option value="">-- Chọn rạp --</option>
                        {cinemas.map((cinema) => (
                          <option key={cinema.id} value={cinema.id}>
                            {cinema.name} - {cinema.city}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#F25019] transition-colors pointer-events-none" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {loadingShowtimes ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-16 text-center">
                <Loader2 className="w-12 h-12 text-[#F25019] animate-spin mx-auto mb-4" />
                <p className="text-xl text-gray-400 font-bold">
                  Đang tìm lịch chiếu phù hợp...
                </p>
              </div>
            ) : Object.keys(groupedByMovie).length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-20 text-center">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Film className="w-10 h-10 text-[#F25019]" />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-3">
                  Chưa có lịch chiếu
                </h3>
                <p className="text-lg text-gray-500 max-w-lg mx-auto font-medium">
                  Rạp{" "}
                  <span className="text-[#F25019]">{selectedCinema?.name}</span>{" "}
                  hiện chưa có suất chiếu nào cho ngày{" "}
                  {format(selectedDate, "dd/MM/yyyy")}.
                </p>
              </div>
            ) : (
              Object.values(groupedByMovie).map(({ movie, sessions }) => {
                if (!movie) return null;

                return (
                  <div
                    key={movie.id}
                    className="bg-white rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 p-5"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-[180px] shrink-0">
                        <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-md group">
                          <Image
                            src={movie.thumbnail || "/placeholder-movie.jpg"}
                            alt={movie.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Label 2D */}
                          <div className="absolute top-2 left-2">
                            <span className="bg-[#F25019] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                              {sessions[0]?.format || "2D"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight uppercase">
                            {movie.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 font-medium mb-4">
                            <span className="flex items-center gap-1 text-yellow-500 font-bold">
                              <Star className="w-4 h-4 fill-current" />
                              {movie.rating.toFixed(1)}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span>{movie.duration} phút</span>
                            <span className="text-gray-300">|</span>
                            <span className="truncate">
                              {movie.genres.map((g) => g.name).join(", ")}
                            </span>
                          </div>
                        </div>
                        ={" "}
                        {selectedCinema && (
                          <div className="mt-auto mb-4 pt-4 border-t border-gray-100 border-dashed">
                            <div className="flex items-start gap-3">
                              <div className="bg-orange-50 p-2 rounded-lg shrink-0">
                                <MapPin className="w-4 h-4 text-[#F25019]" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm leading-none mb-1.5">
                                  {selectedCinema.name}
                                </h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                  {selectedCinema.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-3 mt-4 lg:mt-0 pt-4 border-t border-gray-100 lg:border-none lg:pt-0">
                          <Link
                            href={`/booking?movie=${movie.id}`}
                            className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-[#F25019] hover:bg-[#d14012] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 text-sm"
                          >
                            Đặt vé
                          </Link>
                          <Link
                            href={`/movies/${movie.id}`}
                            className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-white border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all text-sm"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </div>

                      <div className="lg:w-[45%] lg:border-l lg:border-gray-100 lg:pl-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="w-4 h-4 text-[#F25019]" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Suất chiếu
                          </span>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2.5">
                          {sessions
                            .sort((a, b) =>
                              a.startTime.localeCompare(b.startTime)
                            )
                            .map((session) => (
                              <Link
                                key={session.id}
                                href={`/booking?movie=${movie.id}&showtime=${session.id}`}
                                className="group/time relative bg-gray-50 hover:bg-[#F25019] border border-gray-200 hover:border-[#F25019] rounded-lg py-2 transition-all duration-200 text-center"
                              >
                                <div className="text-sm font-bold text-gray-800 group-hover/time:text-white">
                                  {formatShowtime(session.startTime)}
                                </div>
                                <div className="text-[9px] uppercase font-bold text-gray-400 group-hover/time:text-orange-100 mt-0.5">
                                  {session.language}
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
