"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [cinemasMap, setCinemasMap] = useState<CinemasMap>({});
  const [expandedCinemas, setExpandedCinemas] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const didAutoSelectShowtimeRef = useRef(false);
  const didExpandCinemaRef = useRef(false);

  const [activeShowtimeId, setActiveShowtimeId] = useState<string | null>(null);

  const cinemaRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const allCinemaIds = Array.from(
      new Set(showtimes.map((st) => st.cinemaId)),
    );
    const missingIds = allCinemaIds.filter((id) => !cinemasMap[id] && id);

    if (missingIds.length === 0) return;

    const fetchMissingCinemas = async () => {
      const promises = missingIds.map(async (id) => {
        try {
          const res = await getCinemaById(id);
          return res.data ? { id, data: res.data } : null;
        } catch {
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
      const city = cinemaData?.city;

      if (cinemaData?.city) citySet.add(city);

      const formatKey = st.format || "2D";

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

    Object.keys(groups).forEach((d) => {
      Object.keys(groups[d]).forEach((c) => {
        Object.keys(groups[d][c].groups).forEach((f) => {
          groups[d][c].groups[f].sort(
            (a, b) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
          );
        });
      });
    });

    setSelectedCity((prev) => {
      if (prev && citySet.has(prev)) return prev;
      return citySet.size > 0 ? Array.from(citySet)[0] : "";
    });

    return {
      groupedData: groups,
      uniqueDates: Array.from(dateSet).sort(),
      cities: Array.from(citySet).sort(),
    };
  }, [showtimes, cinemasMap]);

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
    (id) => currentCinemas[id].city === selectedCity || cities.length <= 1,
  );

  useEffect(() => {
    if (
      !preSelectedShowtimeId ||
      didAutoSelectShowtimeRef.current ||
      showtimes.length === 0
    ) {
      return;
    }

    const targetShowtime = showtimes.find(
      (s) => s.id === preSelectedShowtimeId,
    );

    if (!targetShowtime) return;

    didAutoSelectShowtimeRef.current = true;

    setActiveShowtimeId(targetShowtime.id);

    if (onSelectShowtime) {
      const targetCinema = cinemasMap[targetShowtime.cinemaId] || null;
      onSelectShowtime(targetShowtime, targetCinema);
    }
  }, [preSelectedShowtimeId, showtimes, cinemasMap, onSelectShowtime]);

  useEffect(() => {
    if (didExpandCinemaRef.current) return;
    if (filteredCinemaIds.length === 0) return;

    didExpandCinemaRef.current = true;

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
  }, [filteredCinemaIds, preSelectedCinemaId]);

  const toggleCinema = (cinemaId: string) => {
    setExpandedCinemas((prev) =>
      prev.includes(cinemaId)
        ? prev.filter((id) => id !== cinemaId)
        : [...prev, cinemaId],
    );
  };

  const renderDateTabs = () => (
    <div className="flex justify-center gap-3 flex-wrap">
      {uniqueDates.map((date) => {
        const d = new Date(date);
        const dayName = format(d, "EEEE", { locale: vi });
        const dayMonth = format(d, "dd/MM");
        const isActive = selectedDate === date;

        return (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center justify-center px-6 py-4 rounded-2xl border-0 transition-all font-medium ${
              isActive
                ? "bg-gradient-to-br from-[#FF7C61] to-[#FF9B7A] text-white shadow-lg scale-105 hover:shadow-xl"
                : "bg-white/90 text-[#FF7C61] hover:bg-white hover:shadow-md"
            }`}
          >
            <span className="text-lg font-bold">{dayMonth}</span>
            <span className="text-xs mt-1 capitalize">{dayName}</span>
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
        <span className="inline-block py-2 px-4 rounded-full bg-orange-50 border border-orange-200 text-[#E65100] text-xs font-bold tracking-widest uppercase mb-6">
          ĐẶT VÉ NGAY
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-stone-800 mb-4 tracking-tight">
          KHÁM PHÁ{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] to-[#FFAB91]">
            LỊCH CHIẾU
          </span>
        </h2>
        <p className="text-lg text-stone-500 max-w-3xl mx-auto font-medium mb-6">
          Tìm kiếm lịch chiếu phù hợp và đặt vé nhanh chóng cùng CinemaGo!
        </p>
        <div>{renderDateTabs()}</div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 border-b border-gray-700 pb-2">
        <h3 className="text-3xl font-black uppercase tracking-tight text-orange-600">
          DANH SÁCH RẠP
        </h3>
        {cities.length > 0 && (
          <div className="relative mt-4 md:mt-0">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 w-4 h-4" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none bg-transparent border border-orange-400 text-orange-600 font-bold py-2 pl-10 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer uppercase text-sm"
            >
              {cities.map((c) => (
                <option
                  key={c}
                  value={c}
                  className="bg-[#fff7f0] text-orange-600"
                >
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-orange-500" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredCinemaIds.length === 0 ? (
          <div className="text-gray-500 text-center py-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
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
                className={`relative rounded-lg overflow-hidden shadow-md transition-all duration-300 border border-orange-200 hover:shadow-lg cinema-card ${
                  isHighlighted ? "ring-2 ring-orange-400" : ""
                }`}
              >
                <div
                  onClick={() => toggleCinema(cinemaId)}
                  className="p-4 cursor-pointer hover:bg-orange-100/50 transition-colors flex justify-between items-center select-none"
                >
                  <div>
                    <h4 className="text-lg font-extrabold text-orange-700 uppercase">
                      {cinemaData.cinemaName}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {cinemaData.cinemaAddress}
                    </p>
                  </div>
                  <div
                    className={`text-orange-600 transition-transform duration-300 ${
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
                  <div className="p-4 pt-0 pb-6 bg-white/40">
                    {Object.keys(cinemaData.groups).map((groupName) => (
                      <div
                        key={groupName}
                        className="mt-4 border-t border-orange-200 pt-4 first:border-0 first:pt-0"
                      >
                        <h5 className="text-sm font-semibold text-orange-700 mb-3 uppercase tracking-wide">
                          {groupName}
                        </h5>
                        <div className="flex flex-wrap gap-3">
                          {cinemaData.groups[groupName].map((st) => {
                            const isSelectedSlot = activeShowtimeId === st.id;

                            return (
                              <button
                                key={st.id}
                                className={`px-4 py-2 border rounded-lg transition-all text-sm font-bold min-w-[80px] ${
                                  isSelectedSlot
                                    ? "bg-gradient-to-r from-[#FF7C61] to-[#FFB464] border-orange-400 text-white scale-110 shadow-[0_4px_12px_rgba(255,124,97,0.3)]"
                                    : "border-orange-300 text-orange-700 bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:border-orange-400"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setActiveShowtimeId(st.id);

                                  if (onSelectShowtime) {
                                    const selectedCinema =
                                      cinemasMap[st.cinemaId] || null;

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
