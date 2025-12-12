"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import type { Room, Showtime } from "@/types";

// Định nghĩa các loại vé
export type TicketType = "STANDARD" | "VIP" | "COUPLE";

export interface TicketSelection {
  type: TicketType;
  quantity: number;
  price: number;
  name: string;
}

// --- CẬP NHẬT TYPE PROPS Ở ĐÂY ---
type Props = {
  showtime: Showtime;
  room: Room;
  selectedTickets: TicketSelection[]; // Nhận mảng vé từ cha
  onUpdate: (type: TicketType, delta: number) => void; // Hàm update từ cha
};

export default function TicketSelector({
  showtime,
  room,
  selectedTickets,
  onUpdate,
}: Props) {
  // Destructure đúng props mới

  // 1. Chuyển đổi mảng selectedTickets thành object quantities để dễ hiển thị
  // Ví dụ: [{type: 'VIP', quantity: 2}] -> { STANDARD: 0, VIP: 2, COUPLE: 0 }
  const quantities = useMemo(() => {
    const map = { STANDARD: 0, VIP: 0, COUPLE: 0 };
    selectedTickets.forEach((t) => {
      // Ép kiểu để TypeScript không báo lỗi index
      const key = t.type as keyof typeof map;
      if (map[key] !== undefined) {
        map[key] = t.quantity;
      }
    });
    return map;
  }, [selectedTickets]);

  // 2. Tính giá vé
  const prices = useMemo(() => {
    const base = showtime.price;
    return {
      STANDARD: base,
      VIP: base + (room.VIP || 0),
      COUPLE: (base + (room.COUPLE || 0)) * 2,
    };
  }, [showtime.price, room]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <div className="w-full bg-[#1e293b] p-8 rounded-xl shadow-2xl border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-24">
      <h3
        className="text-3xl font-bold text-center text-white mb-8 uppercase"
        style={{ fontFamily: "Oswald, sans-serif" }}
      >
        Chọn Loại Vé
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* VÉ THƯỜNG */}
        <div className="border border-gray-600 rounded-lg p-6 bg-[#0f172a] hover:border-yellow-400 transition-colors">
          <h4 className="text-lg font-bold text-white uppercase">Người lớn</h4>
          <p className="text-sm text-gray-400 mb-2">ĐƠN</p>
          <p className="text-xl font-bold text-yellow-400 mb-4">
            {formatCurrency(prices.STANDARD)}
          </p>
          <div className="flex items-center justify-between bg-gray-700 rounded-md p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate("STANDARD", -1)}
              className="text-white hover:text-yellow-400"
            >
              <Minus size={18} />
            </Button>
            <span className="text-xl font-bold text-white w-8 text-center">
              {quantities.STANDARD}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate("STANDARD", 1)}
              className="text-white hover:text-yellow-400"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>

        {/* VÉ VIP */}
        <div className="border border-gray-600 rounded-lg p-6 bg-[#0f172a] hover:border-yellow-400 transition-colors">
          <h4 className="text-lg font-bold text-white uppercase">NGƯỜI LỚN</h4>
          <p className="text-sm text-gray-400 mb-2">VIP</p>
          <p className="text-xl font-bold text-yellow-400 mb-4">
            {formatCurrency(prices.VIP)}
          </p>
          <div className="flex items-center justify-between bg-gray-700 rounded-md p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate("VIP", -1)}
              className="text-white hover:text-yellow-400"
            >
              <Minus size={18} />
            </Button>
            <span className="text-xl font-bold text-white w-8 text-center">
              {quantities.VIP}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate("VIP", 1)}
              className="text-white hover:text-yellow-400"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>

        {/* VÉ ĐÔI */}
        <div className="border border-gray-600 rounded-lg p-6 bg-[#0f172a] hover:border-yellow-400 transition-colors">
          <h4 className="text-lg font-bold text-white uppercase">NGƯỜI LỚN</h4>
          <p className="text-sm text-gray-400 mb-2">ĐÔI</p>
          <p className="text-xl font-bold text-yellow-400 mb-4">
            {formatCurrency(prices.COUPLE)}
          </p>
          <div className="flex items-center justify-between bg-gray-700 rounded-md p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate("COUPLE", -1)}
              className="text-white hover:text-yellow-400"
            >
              <Minus size={18} />
            </Button>
            <span className="text-xl font-bold text-white w-8 text-center">
              {quantities.COUPLE}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate("COUPLE", 1)}
              className="text-white hover:text-yellow-400"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
