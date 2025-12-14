import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronDown, Film, Globe, Star } from "lucide-react";
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
    <div className="bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/70 rounded-2xl overflow-hidden shadow-2xl border border-purple-600/30 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row">
        <div className="relative w-full lg:w-96 h-96 lg:h-auto shrink-0">
          <Image
            src={movie.thumbnail}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          {movie.rating > 0 && (
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-yellow-400 font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl">
              <Star className="w-5 h-5 fill-yellow-400" />
              <span className="text-lg">{movie.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 lg:p-10">
          <h3 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4 uppercase tracking-wider">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-6">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-yellow-500" />
              <span>
                {movie.genres.map((g) => g.name).join(" • ") || "Đang cập nhật"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span>
                {Math.floor(movie.duration / 60)}h{" "}
                {movie.duration % 60 === 0 ? "" : `${movie.duration % 60}p`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-yellow-500" />
              <span>Việt Nam</span>
            </div>
          </div>

          {hasShowtime ? (
            <div className="space-y-6">
              {days.map((dateKey) => {
                const formats = grouped[dateKey];
                if (!formats) return null;

                return Object.entries(formats).map(([format, times]) => (
                  <div
                    key={`${dateKey}-${format}`}
                    className="bg-black/50 rounded-xl p-6 border border-purple-600/40"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-yellow-400" />
                        <span className="font-bold text-xl text-white">
                          {formatDateVN(dateKey)}
                        </span>
                      </div>
                      <span className="text-sm font-medium uppercase tracking-wider text-gray-300 bg-purple-800/60 px-4 py-1 rounded-full">
                        {format}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {times.sort().map((time) => (
                        <button
                          key={time}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-6 py-4 rounded-xl text-lg transition transform hover:scale-105 shadow-lg"
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
            <p className="text-gray-500 italic text-lg">
              Chưa có suất chiếu trong 2 ngày tới
            </p>
          )}

          <Link
            href={`/movie/${movie.id}`}
            className="mt-8 inline-flex items-center gap-3 text-yellow-400 hover:text-yellow-300 font-bold text-lg transition group"
          >
            <span>Xem thêm lịch chiếu</span>
            <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
