"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { Movie, Showtime, Cinema, SeatCell } from "@/types";
import { format } from "date-fns";
import type { TicketSelection } from "./TicketSelector";
import type { FoodSelection } from "@/types";

type Props = {
  movie: Movie;
  showtime: Showtime;
  cinema?: Cinema | null; // Thông tin rạp (để lấy tên)
  selectedTickets: TicketSelection[];
  roomName?: string;
  selectedSeats: SeatCell[];
  selectedFoods: FoodSelection[];
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
  onBook,
}: Props) {
  // Tính tổng tiền
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

  // Chuỗi tóm tắt ( Bắp nước)
  const foodSummary = useMemo(() => {
    if (!selectedFoods || selectedFoods.length === 0) return "";
    return selectedFoods.map((c) => `${c.quantity} ${c.name}`).join(", ");
  }, [selectedFoods]);

  // Tạo chuỗi tóm tắt vé (VD: 2 Người lớn, 1 VIP)
  const ticketSummary = useMemo(() => {
    if (selectedTickets.length === 0) return "";
    return (
      " | " + selectedTickets.map((t) => `${t.quantity} ${t.name}`).join(", ")
    );
  }, [selectedTickets]);

  //  TẠO CHUỖI TÊN GHẾ ---
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

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0f172a] border-t border-gray-700 shadow-[0_-4px_10px_rgba(0,0,0,0.5)] z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Bên trái: Thông tin phim & Rạp */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-lg md:text-xl font-bold text-white uppercase truncate font-oswald mb-1">
            {movie.title}
          </h3>

          {/* Dòng 1: Tên Rạp | Loại vé */}
          <p className="text-sm text-gray-300 truncate">
            {cinema ? cinema.name : "Đang tải rạp..."}
            <span className="text-white font-medium">{ticketSummary}</span>
          </p>

          {/* Dòng 2: Phòng | Ghế | Giờ chiếu (Highlight Vàng như ảnh mẫu) */}
          <p className="text-sm md:text-base text-yellow-400 font-bold mt-1 truncate">
            {roomName ? `Phòng chiếu: ${roomName}` : ""}
            {seatString ? ` | Ghế: ${seatString}` : ""}
            {` | ${format(new Date(showtime.startTime), "HH:mm")} - ${format(
              new Date(showtime.startTime),
              "dd/MM"
            )}`}
          </p>

          {foodSummary && (
            <p className="text-sm md:text-base font-bold text-white mt-1 animate-in fade-in line-clamp-2 leading-snug">
              {foodSummary}
            </p>
          )}
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-400">Tạm tính</p>
            <p className="text-2xl font-bold text-yellow-400">
              {formatCurrency(totalPrice)}
            </p>
          </div>

          <Button
            onClick={onBook}
            disabled={selectedTickets.length === 0}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 px-8 text-lg uppercase rounded-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Đặt Vé
          </Button>
        </div>
      </div>
    </div>
  );
}
