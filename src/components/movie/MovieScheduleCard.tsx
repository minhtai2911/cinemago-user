import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Film,
  Globe,
  Star,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { getShowtimes } from "@/services";
import type { Movie, Showtime } from "@/types";

const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

type MovieScheduleCardProps = {
  movie: Movie;
  cinemaId: string;
};

const getLocalDateKey = (iso: string) => {
  return new Date(iso).toLocaleDateString("sv-SE", { timeZone: VN_TIMEZONE });
};

const toUtcFromVN = (dateStr: string, endOfDay = false) => {
  const d = new Date(
    `${dateStr}T${endOfDay ? "23:59:59.999" : "00:00:00"}+07:00`
  );
  return d;
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: VN_TIMEZONE,
  });

const getNext3Days = () => {
  const days: string[] = [];
  const now = new Date();

  for (let i = 0; i < 3; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    days.push(d.toLocaleDateString("sv-SE", { timeZone: VN_TIMEZONE }));
  }

  return days;
};

const getDateParts = (dateStr: string) => {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString("vi-VN", {
    weekday: "long",
    timeZone: VN_TIMEZONE,
  });
  const dayMonth = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    timeZone: VN_TIMEZONE,
  });
  return { weekday, dayMonth };
};

export default async function MovieScheduleCard({
  movie,
  cinemaId,
}: MovieScheduleCardProps) {
  const days = getNext3Days();

  const showtimesRes = await getShowtimes(
    undefined,
    undefined,
    movie.id,
    cinemaId,
    true,
    toUtcFromVN(days[0]),
    toUtcFromVN(days[2], true)
  );

  const showtimes: Showtime[] = showtimesRes.data || [];

  const grouped: Record<
    string,
    Record<string, { time: string; showtimeId: string }[]>
  > = {};

  showtimes.forEach((st) => {
    const dateKey = getLocalDateKey(st.startTime);
    if (!days.includes(dateKey)) return;

    const formatKey = st.format || "2D";
    if (!grouped[dateKey]) grouped[dateKey] = {};
    if (!grouped[dateKey][formatKey]) grouped[dateKey][formatKey] = [];

    grouped[dateKey][formatKey].push({
      time: formatTime(st.startTime),
      showtimeId: st.id,
    });
  });

  const hasShowtime = Object.keys(grouped).length > 0;

  return (
    <div className="group bg-white rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-orange-200 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="shrink-0 w-full md:w-[180px] lg:w-[200px]">
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all">
            <Image
              src={movie.thumbnail}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 200px"
            />
            {movie.rating > 0 && (
              <div className="absolute top-2 right-2 bg-white/95 backdrop-blur shadow-sm px-2 py-1 rounded-lg flex flex-col items-center justify-center min-w-[40px]">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mb-0.5" />
                <span className="text-xs font-black text-gray-900 leading-none">
                  {movie.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-6">
            <Link href={`/movies/${movie.id}`}>
              <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#F25019] mb-3 uppercase tracking-tight transition-colors truncate">
                {movie.title}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4 text-orange-400" />
                {movie.genres?.[0]?.name || "Phim điện ảnh"}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-400" />
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}p
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-orange-400" />
                Việt Nam
              </span>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full mb-6"></div>

          <div className="flex-grow">
            {hasShowtime ? (
              <div className="space-y-6">
                {days.map((dateKey) => {
                  const formats = grouped[dateKey];
                  if (!formats) return null;

                  const { weekday, dayMonth } = getDateParts(dateKey);

                  return (
                    <div
                      key={dateKey}
                      className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 animate-fadeIn"
                    >
                      <div className="shrink-0 w-24">
                        <p className="text-sm text-gray-400 font-medium capitalize mb-0.5">
                          {weekday}
                        </p>
                        <p className="text-xl font-black text-gray-800">
                          {dayMonth}
                        </p>
                      </div>

                      <div className="flex-1 space-y-4">
                        {Object.entries(formats).map(([format, sessions]) => (
                          <div
                            key={format}
                            className="flex flex-wrap items-center gap-3"
                          >
                            <span className="shrink-0 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                              {format}
                            </span>

                            <div className="flex flex-wrap gap-2">
                              {sessions
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map(({ time, showtimeId }) => (
                                  <Link
                                    key={showtimeId}
                                    href={`/booking?movie=${movie.id}&showtime=${showtimeId}`}
                                    className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:border-[#F25019] hover:bg-[#F25019] hover:text-white transition-all active:scale-95"
                                  >
                                    {time}
                                  </Link>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-400 italic py-2">
                <CalendarDays className="w-5 h-5" />
                <span>Hiện chưa có lịch chiếu nào trong hai ngày tới</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={`/booking?movie=${movie.id}`}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#F25019] hover:text-[#d14015] transition-all group/link"
            >
              Xem thêm lịch chiếu
              <ChevronRight
                size={16}
                className="group-hover/link:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
