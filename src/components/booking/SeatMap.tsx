"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { SeatType } from "@/types";
import { TicketSelection } from "./TicketSelector";
import { RenderSeat } from "@/utils/seat-helper";

const SEAT_STYLES: Record<SeatType, string> = {
  // Unselected seats: solid white background, colored border & text, gentle hover tint
  NORMAL:
    "border-green-500 text-green-600 bg-white hover:bg-green-50 h-9 w-9 transition-colors duration-150",
  VIP: "border-orange-500 text-orange-600 bg-white hover:bg-orange-50 h-9 w-9 transition-colors duration-150",
  COUPLE:
    "border-pink-500 text-pink-600 bg-white hover:bg-pink-50 h-9 w-20 transition-colors duration-150",
  EMPTY: "invisible border-none h-9 w-9",
};

const TICKET_TO_SEAT_MAP: Record<string, string> = {
  STANDARD: "NORMAL",
  VIP: "VIP",
  COUPLE: "COUPLE",
};

const SEAT_TO_TICKET_MAP: Record<string, string> = {
  NORMAL: "Người lớn (Đơn)",
  VIP: "Ghế VIP",
  COUPLE: "Ghế Đôi",
};

type Props = {
  seatLayout: RenderSeat[];
  bookedSeats?: string[];
  heldSeats?: string[];
  chosenSeats: RenderSeat[];
  selectedTickets: TicketSelection[];
  onToggleSeat: (seat: RenderSeat) => void;
};

export default function SeatMap({
  seatLayout,
  bookedSeats = [],
  heldSeats = [],
  chosenSeats,
  selectedTickets,
  onToggleSeat,
}: Props) {
  const seatQuotas = useMemo(() => {
    const quotas: Record<string, number> = {};
    selectedTickets.forEach((t) => {
      const seatType = TICKET_TO_SEAT_MAP[t.type];
      if (seatType) quotas[seatType] = t.quantity;
    });
    return quotas;
  }, [selectedTickets]);

  const currentSelectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    chosenSeats.forEach((s) => {
      if (s.type && s.type !== "EMPTY") {
        counts[s.type] = (counts[s.type] || 0) + 1;
      }
    });
    return counts;
  }, [chosenSeats]);

  const handleSeatClick = (seat: RenderSeat) => {
    if (seat.type === "EMPTY" || !seat.id) return;

    const seatId1 = seat.id;
    const seatId2 = seat.secondId;

    const isSelected = chosenSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      onToggleSeat(seat);
      return;
    }

    const isBooked =
      bookedSeats.includes(seatId1) ||
      (seatId2 && bookedSeats.includes(seatId2));
    const isHeld =
      heldSeats.includes(seatId1) || (seatId2 && heldSeats.includes(seatId2));

    if (isBooked || isHeld) {
      toast.error("Ghế này đã có người đặt!");
      return;
    }

    const limit = seatQuotas[seat.type] || 0;
    const current = currentSelectionCounts[seat.type] || 0;

    if (current >= limit) {
      const ticketName = SEAT_TO_TICKET_MAP[seat.type];
      toast.warning(
        limit === 0
          ? `Bạn chưa chọn vé loại ${ticketName}!`
          : `Đủ số lượng vé ${ticketName}. Bỏ chọn ghế cũ trước khi chọn mới.`,
      );
      return;
    }

    onToggleSeat(seat);
  };

  const rows = useMemo(() => {
    const grouped: Record<string, RenderSeat[]> = {};
    seatLayout.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });

    const sortedRows: RenderSeat[][] = [];

    Object.keys(grouped)
      .sort()
      .forEach((rowKey) => {
        const originalSeats = grouped[rowKey].sort((a, b) => a.col - b.col);
        const mergedSeats: RenderSeat[] = [];

        for (let i = 0; i < originalSeats.length; i++) {
          const current = originalSeats[i];
          const next = originalSeats[i + 1];

          if (
            current.type === "COUPLE" &&
            next &&
            next.type === "COUPLE" &&
            next.col === current.col + 1
          ) {
            mergedSeats.push({
              ...current,
              isMerged: true,
              displayLabel: `${
                current.seatNumber || current.row + current.col
              }-${next.seatNumber || next.row + next.col}`,
              secondId: next.id,
            });
            i++;
          } else {
            mergedSeats.push({
              ...current,
              isMerged: false,
              displayLabel:
                current.seatNumber || `${current.row}${current.col}`,
            });
          }
        }
        sortedRows.push(mergedSeats);
      });

    return sortedRows;
  }, [seatLayout]);

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-[0_40px_80px_rgba(255,110,70,0.08)] border border-white/10 mt-12 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* --- 1. AMBIENT BACKGROUND (Sáng, Mơ màng & Đốm sáng trôi) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Lớp Noise (Tạo texture giấy/phim cũ) */}
        <div
          className="absolute inset-0 opacity-[0.04] z-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Các Đốm sáng trôi lơ lửng (Floating Blobs) */}
        {/* Đốm Cam đào (Góc trên trái) */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>

        {/* Đốm Hồng phấn (Góc dưới phải) */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

        {/* Đốm Vàng nhạt (Giữa trái) */}
        <div className="absolute top-[30%] left-[20%] w-[200px] h-[200px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-4000"></div>

        {/* Popcorn Watermark (Mờ hơn để hợp nền sáng) */}
      </div>
      <h3 className="text-3xl md:text-3xl font-black text-center text-gray-900 mb-8 tracking-tight">
        CHỌN{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] to-[#FFAB91]">
          GHẾ NGỒI
        </span>
      </h3>

      <div className="w-full max-w-3xl mx-auto mb-12 relative flex flex-col items-center">
        {/* Single white screen with stronger orange glow and expanded shadow */}
        <div className="relative w-[85%] mb-2">
          {/* blurred orange glow behind the screen */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-3 rounded-full bg-gradient-to-r from-transparent via-[#FFB07A]/40 to-transparent filter blur-[18px] opacity-95"></div>
          </div>

          {/* white screen on top */}
          <div className="relative z-10 h-3 bg-white rounded-full w-full shadow-[0_20px_80px_rgba(255,120,60,0.28)]"></div>
        </div>
        <p className="text-center text-gray-600 text-sm uppercase tracking-widest mt-4">
          Màn hình
        </p>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-fit mx-auto flex flex-col gap-3 items-center">
          {rows.map((rowSeats, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-4">
              <span className="text-gray-700 font-bold w-6 text-center text-lg">
                {rowSeats[0].row}
              </span>
              <div className="flex gap-2">
                {rowSeats.map((seat) => {
                  if (!seat.id && seat.type !== "EMPTY") return null;

                  const seatId1 = seat.id;
                  const seatId2 = seat.secondId;

                  const isSelected = chosenSeats.some((s) => s.id === seat.id);

                  const isBooked =
                    (!!seatId1 && bookedSeats.includes(seatId1)) ||
                    (!!seatId2 && bookedSeats.includes(seatId2));

                  const isHeldRaw =
                    (!!seatId1 && heldSeats.includes(seatId1)) ||
                    (!!seatId2 && heldSeats.includes(seatId2));

                  const isHeld = isHeldRaw && !isSelected;

                  const baseStyle =
                    SEAT_STYLES[seat.type] || SEAT_STYLES.NORMAL;
                  const widthClass = seat.type === "COUPLE" ? "w-20" : "w-9";

                  let seatClass = "";

                  if (seat.type === "EMPTY") {
                    seatClass = `invisible border-none h-9 ${widthClass}`;
                  } else if (isBooked) {
                    seatClass = `bg-gray-200 border-gray-700 text-gray-400 cursor-not-allowed h-9 ${widthClass}`;
                  } else if (isHeld) {
                    seatClass = `bg-gray-400 border-gray-600 text-gray-700 cursor-not-allowed opacity-90 h-9 ${widthClass}`;
                  } else if (isSelected) {
                    seatClass = `bg-gradient-to-r from-[#FF7043] to-[#FFAB91]
                     border-transparent text-white font-bold scale-100 z-10 h-9 ${widthClass} cursor-pointer`;
                    // Selected gradients per seat type as requested
                    /*if (seat.type === "NORMAL") {
                      seatClass = `bg-gradient-to-r from-[#FFE089] to-[#FFAE57] border-transparent text-white font-bold scale-100 z-10 h-9 ${widthClass} cursor-pointer`;
                    } else if (seat.type === "VIP") {
                      seatClass = `bg-gradient-to-r from-[#FF894E] to-[#FC2727] border-transparent text-black font-bold shadow-[0_6px_20px_rgba(252,39,39,0.35)] scale-100 z-10 h-9 ${widthClass} cursor-pointer`;
                    } else if (seat.type === "COUPLE") {
                      seatClass = `bg-gradient-to-r from-[#FFD2EF] to-[#FF9E9E] border-transparent text-black font-bold shadow-[0_6px_20px_rgba(255,159,159,0.30)] scale-100 z-10 h-9 ${widthClass} cursor-pointer`;
                    } else {
                      seatClass = `bg-gradient-to-r from-[#FFE089] to-[#FFAE57] border-transparent text-black font-bold shadow-[0_6px_20px_rgba(255,174,87,0.35)] scale-100 z-10 h-9 ${widthClass} cursor-pointer`;
                    }*/
                  } else {
                    seatClass = `${baseStyle} ${widthClass} cursor-pointer`;
                  }

                  return (
                    <button
                      key={seat.id || `${seat.row}-${seat.col}`}
                      disabled={seat.type === "EMPTY" || isBooked || isHeld}
                      onClick={() => handleSeatClick(seat)}
                      className={cn(
                        "rounded-t-lg border flex items-center justify-center text-xs font-semibold transition-all duration-200 relative group",
                        seatClass,
                      )}
                    >
                      {seat.type !== "EMPTY" && (
                        <>
                          <span className={seat.isMerged ? "text-[10px]" : ""}>
                            {seat.displayLabel}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-12 border-t border-gray-200/20 pt-6">
        <LegendItem
          color="border-green-500 text-green-500 bg-white/5"
          label="Ghế Thường"
        />

        <LegendItem
          color="border-red-500 text-red-500 bg-white/5"
          label="Ghế VIP"
        />

        <LegendItem
          color="border-pink-500 text-pink-500 bg-white/5"
          label="Ghế Đôi"
          w="w-10"
        />

        <LegendItem
          color="bg-gradient-to-r from-[#FF7043] to-[#FFAB91] border-transparent"
          label="Đang chọn"
        />

        <LegendItem
          color="bg-gray-300 border-gray-700"
          label="Đã đặt/Đang giữ"
        />
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  w = "w-6",
}: {
  color: string;
  label: string;
  w?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${w} h-6 rounded-md border ${color} flex items-center justify-center`}
      />

      <span className="text-gray-700 text-sm">{label}</span>
    </div>
  );
}
