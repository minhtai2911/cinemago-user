"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { MapPin, ChevronDown } from "lucide-react";
import { getCinemaById } from "@/services";
import type { Showtime, Cinema } from "@/types";

type Props = {
  showtimes: Showtime[];
  preSelectedDate?: string;
  preSelectedCinemaId?: string;
  preSelectedShowtimeId?: string;
  onSelectShowtime?: (showtime: Showtime, cinema: Cinema | null) => void;
};

type CinemasMap = Record<string, Cinema>;
type GroupedByCinema = {
  [cinemaId: string]: {
    cinemaName: string;
    cinemaAddress: string;
    city: string;
    groups: {
      [format: string]: Showtime[];
    };
  };
};

type GroupedByDate = {
  [date: string]: GroupedByCinema;
};

export default function ShowtimeList({
  showtimes,
  preSelectedDate,
  preSelectedCinemaId,
  preSelectedShowtimeId,
  onSelectShowtime,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("Hồ Chí Minh");
  const [cinemasMap, setCinemasMap] = useState<CinemasMap>({});
  const [expandedCinemas, setExpandedCinemas] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [activeShowtimeId, setActiveShowtimeId] = useState<string | null>(null);

  const cinemaRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ... (useEffect Fetch Cinema giữ nguyên) ...
  useEffect(() => {
    const allCinemaIds = Array.from(
      new Set(showtimes.map((st) => st.cinemaId))
    );
    const missingIds = allCinemaIds.filter((id) => !cinemasMap[id] && id);

    if (missingIds.length === 0) return;

    const fetchMissingCinemas = async () => {
      const promises = missingIds.map(async (id) => {
        try {
          const res = await getCinemaById(id);
          return res.data ? { id, data: res.data } : null;
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(promises);
      setCinemasMap((prev) => {
        const next = { ...prev };
        results.forEach((item) => {
          if (item) next[item.id] = item.data as Cinema;
        });
        return next;
      });
    };
    fetchMissingCinemas();
  }, [showtimes, cinemasMap]);

  // ... (useMemo Group Data giữ nguyên) ...
  const { groupedData, uniqueDates, cities } = useMemo(() => {
    const groups: GroupedByDate = {};
    const dateSet = new Set<string>();
    const citySet = new Set<string>();

    showtimes.forEach((st) => {
      const dateKey = format(new Date(st.startTime), "yyyy-MM-dd");
      dateSet.add(dateKey);

      const cinemaData = cinemasMap[st.cinemaId];
      const cinemaName = cinemaData?.name || "Đang tải tên rạp...";
      const cinemaAddress = cinemaData?.address || "Đang tải địa chỉ...";
      const cinemaId = st.cinemaId;
      const city = cinemaData?.city || "Hồ Chí Minh";
      if (cinemaData?.city) citySet.add(city);

      const formatKey = st.format || "2D"; // Fallback format

      if (!groups[dateKey]) groups[dateKey] = {};
      if (!groups[dateKey][cinemaId]) {
        groups[dateKey][cinemaId] = {
          cinemaName,
          cinemaAddress,
          city,
          groups: {},
        };
      }
      if (!groups[dateKey][cinemaId].groups[formatKey]) {
        groups[dateKey][cinemaId].groups[formatKey] = [];
      }
      groups[dateKey][cinemaId].groups[formatKey].push(st);
    });

    // Sort time inside groups
    Object.keys(groups).forEach((d) => {
      Object.keys(groups[d]).forEach((c) => {
        Object.keys(groups[d][c].groups).forEach((f) => {
          groups[d][c].groups[f].sort(
            (a, b) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        });
      });
    });

    return {
      groupedData: groups,
      uniqueDates: Array.from(dateSet).sort(),
      cities: Array.from(citySet).sort(),
    };
  }, [showtimes, cinemasMap]);

  // --- Logic Tự động chọn ngày ---
  useEffect(() => {
    if (!isInitialized && uniqueDates.length > 0) {
      if (preSelectedDate && uniqueDates.includes(preSelectedDate)) {
        setSelectedDate(preSelectedDate);
      } else {
        setSelectedDate(uniqueDates[0]);
      }
      setIsInitialized(true);
    }
  }, [uniqueDates, preSelectedDate, isInitialized]);

  const currentCinemas = selectedDate ? groupedData[selectedDate] : {};
  const filteredCinemaIds = Object.keys(currentCinemas || {}).filter(
    (id) => currentCinemas[id].city === selectedCity || cities.length <= 1
  );

  useEffect(() => {
    if (preSelectedShowtimeId) {
      setActiveShowtimeId(preSelectedShowtimeId);

      const targetShowtime = showtimes.find(
        (s) => s.id === preSelectedShowtimeId
      );
      if (targetShowtime && onSelectShowtime) {
        const targetCinema = cinemasMap[targetShowtime.cinemaId] || null;
        onSelectShowtime(targetShowtime, targetCinema);
      }
    }

    if (filteredCinemaIds.length > 0) {
      if (
        preSelectedCinemaId &&
        filteredCinemaIds.includes(preSelectedCinemaId)
      ) {
        setExpandedCinemas([preSelectedCinemaId]);
        setTimeout(() => {
          const element = cinemaRefs.current[preSelectedCinemaId];
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);
      } else {
        setExpandedCinemas(filteredCinemaIds);
      }
    }
  }, [filteredCinemaIds.length, preSelectedCinemaId, preSelectedShowtimeId]);

  const toggleCinema = (cinemaId: string) => {
    setExpandedCinemas((prev) =>
      prev.includes(cinemaId)
        ? prev.filter((id) => id !== cinemaId)
        : [...prev, cinemaId]
    );
  };

  const renderDateTabs = () => (
    <div className="flex justify-center gap-4 flex-wrap">
      {uniqueDates.map((date) => {
        const d = new Date(date);
        const dayName = format(d, "EEEE", { locale: vi });
        const dayMonth = format(d, "dd/MM");
        const isActive = selectedDate === date;

        return (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center justify-center w-[100px] h-[80px] rounded-lg border-2 transition-all ${
              isActive
                ? "bg-yellow-400 border-yellow-400 text-[#0f172a]"
                : "border-yellow-400 text-yellow-400 bg-transparent hover:bg-yellow-400/10"
            }`}
          >
            <span className="text-xl font-bold">{dayMonth}</span>
            <span className="text-sm font-semibold capitalize">{dayName}</span>
          </button>
        );
      })}
    </div>
  );

  if (showtimes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        Hiện chưa có lịch chiếu cho phim này.
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl font-bold uppercase text-white mb-8 tracking-tighter"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          Lịch Chiếu
        </h2>
        <div>{renderDateTabs()}</div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 border-b border-gray-700 pb-2">
        <h3
          className="text-3xl font-bold uppercase text-white tracking-tighter"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          Danh Sách Rạp
        </h3>
        {cities.length > 0 && (
          <div className="relative mt-4 md:mt-0">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 w-4 h-4" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 pl-10 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer uppercase text-sm"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-[#0f172a] text-white">
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredCinemaIds.length === 0 ? (
          <div className="text-gray-400 text-center py-12 bg-[#1e293b]/50 rounded-lg border border-dashed border-gray-700">
            Không có suất chiếu tại {selectedCity} vào ngày này.
          </div>
        ) : (
          filteredCinemaIds.map((cinemaId) => {
            const cinemaData = currentCinemas[cinemaId];
            const isExpanded = expandedCinemas.includes(cinemaId);
            const isHighlighted = preSelectedCinemaId === cinemaId;

            return (
              <div
                key={cinemaId}
                ref={(el) => {
                  cinemaRefs.current[cinemaId] = el;
                }}
                className={`bg-[#60368c] rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                  isHighlighted ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                <div
                  onClick={() => toggleCinema(cinemaId)}
                  className="p-4 cursor-pointer hover:bg-[#6d409e] transition-colors flex justify-between items-center select-none"
                >
                  <div>
                    <h4 className="text-lg font-bold text-yellow-400 uppercase">
                      {cinemaData.cinemaName}
                    </h4>
                    <p className="text-sm text-white/80 mt-1">
                      {cinemaData.cinemaAddress}
                    </p>
                  </div>
                  <div
                    className={`text-white transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown />
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    isExpanded
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 pt-0 pb-6">
                    {Object.keys(cinemaData.groups).map((groupName) => (
                      <div
                        key={groupName}
                        className="mt-4 border-t border-white/10 pt-4 first:border-0 first:pt-0"
                      >
                        <h5 className="text-sm font-medium text-white mb-3">
                          {groupName}
                        </h5>
                        <div className="flex flex-wrap gap-3">
                          {cinemaData.groups[groupName].map((st) => {
                            const isSelectedSlot = activeShowtimeId === st.id;

                            return (
                              <button
                                key={st.id}
                                className={`px-4 py-2 border rounded transition-all text-sm font-bold min-w-[80px] ${
                                  isSelectedSlot
                                    ? "bg-yellow-400 border-yellow-400 text-black scale-110 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                    : "border-white/30 text-white hover:bg-white hover:text-[#60368c]"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setActiveShowtimeId(st.id);

                                  if (onSelectShowtime) {
                                    const selectedCinema =
                                      cinemasMap[st.cinemaId] || null;

                                    // Truyền cả 2 ra ngoài: Suất chiếu + Rạp
                                    onSelectShowtime(st, selectedCinema);
                                  }
                                }}
                              >
                                {format(new Date(st.startTime), "HH:mm")}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
