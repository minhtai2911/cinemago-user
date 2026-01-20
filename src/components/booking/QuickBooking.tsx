"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Cinema, Movie, Showtime } from "@/types";
import { toast } from "sonner";
import {
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Film,
  Check,
} from "lucide-react";
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

const CustomSelect = ({
  label,
  value,
  options,
  onChange,
  disabled,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder: string;
  icon: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.id === value)?.label;

  return (
    <div className="relative group" ref={containerRef}>
      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-[#F25019] transition-colors">
        <Icon size={14} /> {label}
      </div>

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-3 pl-4 pr-10 bg-white border rounded-xl text-left font-medium text-sm transition-all duration-200 relative
          ${
            isOpen
              ? "border-[#F25019] ring-2 ring-[#F25019]/20"
              : "border-gray-200 hover:border-[#F25019]"
          }
          ${
            disabled
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "text-gray-700 cursor-pointer shadow-sm"
          }
        `}
      >
        <span className="block truncate">{selectedLabel || placeholder}</span>
        <div
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${
            !disabled && "group-hover:text-[#F25019]"
          }`}
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 top-[calc(100%+8px)] w-full bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 mx-2 rounded-lg cursor-pointer text-sm font-medium transition-colors flex items-center justify-between
                    ${
                      value === option.id
                        ? "bg-[#F25019]/10 text-[#F25019]"
                        : "text-gray-700 hover:bg-orange-50 hover:text-[#F25019]"
                    }
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.id && <Check size={14} />}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
    if (!selectedMovie) {
      toast.info("Vui lòng chọn phim trước!");
      return;
    }
    const params = new URLSearchParams();
    params.set("movie", selectedMovie);
    if (selectedCinema) params.set("cinema", selectedCinema);
    if (selectedDate) {
      const [day, month, year] = selectedDate.split("/");
      if (day && month && year) params.set("date", `${year}-${month}-${day}`);
    }
    if (selectedShowtime) params.set("showtime", selectedShowtime);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="relative -mt-24 z-30 container mx-auto px-4 mb-16">
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-6 md:p-8 border border-white/50 backdrop-blur-sm">
        <div className="flex gap-8 mb-6 border-b border-gray-100 pb-4">
          <button className="text-[#F25019] font-bold text-lg border-b-2 border-[#F25019] pb-4 -mb-4.5 uppercase tracking-wide">
            Mua vé nhanh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomSelect
            label="Chọn Phim"
            icon={Film}
            placeholder="Chọn phim"
            value={selectedMovie}
            onChange={setSelectedMovie}
            options={availableMovies.map((m) => ({ id: m.id, label: m.title }))}
          />

          <CustomSelect
            label="Chọn Rạp"
            icon={MapPin}
            placeholder="Chọn rạp"
            value={selectedCinema}
            onChange={setSelectedCinema}
            options={availableCinemas.map((c) => ({ id: c.id, label: c.name }))}
          />

          <CustomSelect
            label="Chọn Ngày"
            icon={Calendar}
            placeholder="Chọn ngày"
            value={selectedDate}
            onChange={setSelectedDate}
            disabled={!selectedMovie || !selectedCinema}
            options={availableDates.map((d) => ({ id: d, label: d }))}
          />

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <CustomSelect
                label="Suất Chiếu"
                icon={Clock}
                placeholder="Chọn suất"
                value={selectedShowtime}
                onChange={setSelectedShowtime}
                disabled={!selectedDate || !selectedMovie || !selectedCinema}
                options={availableShowtimes.map((s) => ({
                  id: s.id,
                  label: new Date(s.startTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                }))}
              />
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedShowtime}
              className="h-[46px] bg-[#F25019] hover:bg-[#d14012] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-6 rounded-xl transition-all shadow-lg hover:shadow-orange-200 transform active:scale-95 whitespace-nowrap flex items-center justify-center"
            >
              MUA VÉ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
