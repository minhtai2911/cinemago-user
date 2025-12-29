"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import type { Movie, Showtime, Cinema, SeatCell } from "@/types";
import { format } from "date-fns";
import type { TicketSelection } from "./TicketSelector";
import type { FoodSelection } from "@/types";

type Props = {
  movie: Movie;
  showtime: Showtime;
  cinema?: Cinema | null;
  selectedTickets: TicketSelection[];
  roomName?: string;
  selectedSeats: SeatCell[];
  selectedFoods: FoodSelection[];
  holdTimer: number | null;
  onBook: () => void;
};

export default function BookingBottomBar({
  movie,
  showtime,
  cinema,
  selectedTickets,
  roomName,
  selectedSeats,
  selectedFoods,
  holdTimer,
  onBook,
}: Props) {
  const totalPrice = useMemo(() => {
    const ticketTotal = selectedTickets.reduce(
      (acc, t) => acc + t.price * t.quantity,
      0
    );
    const concessionTotal = selectedFoods.reduce(
      (acc, c) => acc + c.price * c.quantity,
      0
    );
    return ticketTotal + concessionTotal;
  }, [selectedTickets, selectedFoods]);

  const foodSummary = useMemo(() => {
    if (!selectedFoods || selectedFoods.length === 0) return "";
    return selectedFoods.map((c) => `${c.quantity} ${c.name}`).join(", ");
  }, [selectedFoods]);

  const ticketSummary = useMemo(() => {
    if (selectedTickets.length === 0) return "";
    return (
      " | " + selectedTickets.map((t) => `${t.quantity} ${t.name}`).join(", ")
    );
  }, [selectedTickets]);

  const seatString = useMemo(() => {
    if (!selectedSeats || selectedSeats.length === 0) return "";

    const sortedSeats = [...selectedSeats].sort((a, b) => {
      if (a.row === b.row) return a.col - b.col;
      return a.row.localeCompare(b.row);
    });

    return sortedSeats
      .map((s) => {
        const col1 = s.col < 10 ? `0${s.col}` : s.col;

        if (s.type === "COUPLE") {
          const nextCol = s.col + 1;
          const col2 = nextCol < 10 ? `0${nextCol}` : nextCol;
          return `${s.row}${col1},${col2}`;
        }

        return `${s.row}${col1}`;
      })
      .join(", ");
  }, [selectedSeats]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const formatTimer = (seconds: number | null) => {
    if (seconds === null || seconds <= 0) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const timerDisplay = formatTimer(holdTimer);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0f172a] border-t border-gray-700 shadow-[0_-4px_10px_rgba(0,0,0,0.5)] z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-lg md:text-xl font-bold text-white uppercase truncate font-oswald mb-1">
            {movie.title}
          </h3>

          <p className="text-sm text-gray-300 truncate">
            {cinema ? cinema.name : "Đang tải rạp..."}
            <span className="text-white font-medium">{ticketSummary}</span>
          </p>

          <p className="text-sm md:text-base font-bold mt-1 truncate">
            <span className="bg-gradient-to-r from-[#FF7C61] to-[#FFB464] bg-clip-text text-transparent">
              {roomName ? `Phòng chiếu: ${roomName}` : ""}
              {seatString ? ` | Ghế: ${seatString}` : ""}
              {` | ${format(new Date(showtime.startTime), "HH:mm")} - ${format(
                new Date(showtime.startTime),
                "dd/MM"
              )}`}
            </span>
          </p>

          {foodSummary && (
            <p className="text-sm md:text-base font-bold text-white mt-1 animate-in fade-in line-clamp-2 leading-snug">
              {foodSummary}
            </p>
          )}

          {timerDisplay && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">Thời gian giữ ghế:</span>
              <span
                className={`text-lg font-bold animate-pulse ${
                  holdTimer && holdTimer <= 60
                    ? "text-red-500"
                    : "text-orange-400"
                }`}
              >
                {timerDisplay}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-400">Tạm tính</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-[#FF7C61] to-[#FFB464] bg-clip-text text-transparent">
              {formatCurrency(totalPrice)}
            </p>
          </div>

          <Button
            onClick={onBook}
            disabled={selectedTickets.length === 0}
            className="bg-gradient-to-r from-[#FF6E3D] to-[#E9391B] hover:from-[#fc632f] hover:to-[#d42e11] text-white font-bold h-12 px-8 text-lg uppercase rounded-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_6px_18px_rgba(255,124,97,0.14)] hover:shadow-[0_10px_30px_rgba(255,124,97,0.18)]"
          >
            Đặt Vé
          </Button>
        </div>
      </div>
    </div>
  );
}
