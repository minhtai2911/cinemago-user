"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Minus } from "lucide-react";
import type { Room, Showtime } from "@/types";

export type TicketType = "STANDARD" | "VIP" | "COUPLE";

export interface TicketSelection {
  type: TicketType;
  quantity: number;
  price: number;
  name: string;
}

type Props = {
  showtime: Showtime;
  room: Room;
  selectedTickets: TicketSelection[];
  onUpdate: (type: TicketType, delta: number) => void;
};

export default function TicketSelector({
  showtime,
  room,
  selectedTickets,
  onUpdate,
}: Props) {
  const quantities = useMemo(() => {
    const map = { STANDARD: 0, VIP: 0, COUPLE: 0 };
    selectedTickets.forEach((t) => {
      const key = t.type as keyof typeof map;
      if (map[key] !== undefined) {
        map[key] = t.quantity;
      }
    });
    return map;
  }, [selectedTickets]);

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
    <div className="w-full bg-[#1e293b] p-6 rounded-xl shadow-2xl border border-gray-700 mt-12 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h3
        className="text-3xl font-bold text-center text-white mb-8 uppercase"
        style={{ fontFamily: "Oswald, sans-serif" }}
      >
        Chọn Loại Vé
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className={`flex bg-[#0f172a] border rounded-lg overflow-hidden transition-all duration-300 group ${
            quantities.STANDARD > 0
              ? "border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.1)]"
              : "border-gray-700 hover:border-gray-500"
          }`}
        >
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white uppercase line-clamp-1 group-hover:text-yellow-400 transition-colors">
                Người lớn
              </h4>
              <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-snug">
                ĐƠN
              </p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-base font-bold bg-gradient-to-r from-[#FF7C61] to-[#FFB464] bg-clip-text text-transparent">
                {formatCurrency(prices.STANDARD)}
              </span>

              <div className="flex items-center bg-gray-800 rounded border border-gray-600">
                <button
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-l"
                  onClick={() => onUpdate("STANDARD", -1)}
                  disabled={quantities.STANDARD === 0}
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-sm font-bold text-white bg-gray-900 h-7 leading-7">
                  {quantities.STANDARD}
                </span>
                <button
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors rounded-r"
                  onClick={() => onUpdate("STANDARD", 1)}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex bg-[#0f172a] border rounded-lg overflow-hidden transition-all duration-300 group ${
            quantities.VIP > 0
              ? "border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.1)]"
              : "border-gray-700 hover:border-gray-500"
          }`}
        >
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white uppercase line-clamp-1 group-hover:text-yellow-400 transition-colors">
                Người lớn
              </h4>
              <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-snug">
                VIP
              </p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-base font-bold bg-gradient-to-r from-[#FF7C61] to-[#FFB464] bg-clip-text text-transparent">
                {formatCurrency(prices.VIP)}
              </span>

              <div className="flex items-center bg-gray-800 rounded border border-gray-600">
                <button
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-l"
                  onClick={() => onUpdate("VIP", -1)}
                  disabled={quantities.VIP === 0}
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-sm font-bold text-white bg-gray-900 h-7 leading-7">
                  {quantities.VIP}
                </span>
                <button
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors rounded-r"
                  onClick={() => onUpdate("VIP", 1)}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex bg-[#0f172a] border rounded-lg overflow-hidden transition-all duration-300 group ${
            quantities.COUPLE > 0
              ? "border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.1)]"
              : "border-gray-700 hover:border-gray-500"
          }`}
        >
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white uppercase line-clamp-1 group-hover:text-yellow-400 transition-colors">
                Người lớn
              </h4>
              <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-snug">
                ĐÔI
              </p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-base font-bold bg-gradient-to-r from-[#FF7C61] to-[#FFB464] bg-clip-text text-transparent">
                {formatCurrency(prices.COUPLE)}
              </span>

              <div className="flex items-center bg-gray-800 rounded border border-gray-600">
                <button
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-l"
                  onClick={() => onUpdate("COUPLE", -1)}
                  disabled={quantities.COUPLE === 0}
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-sm font-bold text-white bg-gray-900 h-7 leading-7">
                  {quantities.COUPLE}
                </span>
                <button
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors rounded-r"
                  onClick={() => onUpdate("COUPLE", 1)}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
