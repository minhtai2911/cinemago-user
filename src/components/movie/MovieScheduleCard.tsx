import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  ChevronDown,
  Film,
  Globe,
  Star,
  CalendarDays,
} from "lucide-react";
import { getShowtimes } from "@/services";
import type { Movie, Showtime } from "@/types";

type MovieScheduleCardProps = {
  movie: Movie;
  cinemaId: string;
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const getNext2Days = () => {
  const days: string[] = [];
  for (let i = 0; i < 2; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};

const formatDateVN = (dateStr: string) => {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString("vi-VN", { weekday: "long" });
  const dayMonthYear = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${weekday}, ${dayMonthYear}`;
};

export default async function MovieScheduleCard({
  movie,
  cinemaId,
}: MovieScheduleCardProps) {
  const days = getNext2Days();

  const showtimesRes = await getShowtimes(
    undefined,
    undefined,
    movie.id,
    cinemaId,
    true,
    new Date(days[0]),
    new Date(new Date(days[1]).setHours(23, 59, 59, 999))
  );

  const showtimes: Showtime[] = showtimesRes.data || [];

  const grouped: Record<string, Record<string, string[]>> = {};
  showtimes.forEach((st) => {
    const dateKey = st.startTime.split("T")[0];
    if (!days.includes(dateKey)) return;

    const formatKey = st.format || "2D";
    if (!grouped[dateKey]) grouped[dateKey] = {};
    if (!grouped[dateKey][formatKey]) grouped[dateKey][formatKey] = [];
    grouped[dateKey][formatKey].push(formatTime(st.startTime));
  });

  const hasShowtime = Object.keys(grouped).length > 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        {/* Ảnh Poster */}
        <div className="relative w-full lg:w-72 h-96 lg:h-auto shrink-0 border-r border-gray-100">
          <Image
            src={movie.thumbnail}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          {movie.rating > 0 && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-base font-bold">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 lg:p-8">
          <Link href={`/movie/${movie.id}`}>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 hover:text-[#F25019] mb-3 uppercase tracking-tight transition-colors">
              {movie.title}
            </h3>
          </Link>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium mb-6">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-gray-400" />
              <span>
                {movie.genres.map((g) => g.name).join(" • ") || "Đang cập nhật"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {Math.floor(movie.duration / 60)}h{" "}
                {movie.duration % 60 === 0 ? "" : `${movie.duration % 60}p`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span>Việt Nam</span>
            </div>
          </div>

          {hasShowtime ? (
            <div className="space-y-4">
              {days.map((dateKey) => {
                const formats = grouped[dateKey];
                if (!formats) return null;

                return Object.entries(formats).map(([format, times]) => (
                  <div
                    key={`${dateKey}-${format}`}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 border-dashed">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-[#F25019]" />
                        <span className="font-bold text-lg text-gray-800 capitalize">
                          {formatDateVN(dateKey)}
                        </span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F25019] bg-[#F25019]/10 px-3 py-1 rounded-md border border-[#F25019]/20">
                        {format}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {times.sort().map((time) => (
                        <button
                          key={time}
                          className="min-w-[80px] py-2 px-4 rounded-lg text-base font-bold border border-gray-300 bg-white text-gray-700 hover:border-[#F25019] hover:text-[#F25019] hover:shadow-md transition-all active:scale-95"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })}
            </div>
          ) : (
            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 italic">
                Chưa có suất chiếu nào trong 2 ngày tới
              </p>
            </div>
          )}

          <Link
            href={`/movie/${movie.id}`}
            className="mt-6 inline-flex items-center gap-2 text-[#F25019] hover:text-[#d14015] font-bold text-sm uppercase tracking-wide transition group"
          >
            <span>Xem chi tiết phim & lịch chiếu</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
