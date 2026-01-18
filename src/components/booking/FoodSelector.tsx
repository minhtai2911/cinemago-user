"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import type { FoodDrink, FoodSelection } from "@/types";

type Props = {
  items: FoodDrink[];
  selectedItems: FoodSelection[];
  onUpdate: (item: FoodDrink, delta: number) => void;
};

const TYPE_MAP: Record<string, string> = {
  COMBO: "COMBO",
  SNACK: "ĐỒ ĂN",
  DRINK: "NƯỚC UỐNG",
};

const TYPE_COLOR: Record<string, string> = {
  COMBO: "bg-red-600",
  SNACK: "bg-orange-500",
  DRINK: "bg-blue-500",
};

export default function FoodDrinkSelector({
  items,
  selectedItems,
  onUpdate,
}: Props) {
  const getQuantity = (id: string) => {
    return selectedItems.find((i) => i.id === id)?.quantity || 0;
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <div className="w-full relative overflow-hidden rounded-xl shadow-2xl border border-white/10 mt-12 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="absolute inset-0 bg-[url('/screenpack.webp')] bg-cover bg-center opacity-20 pointer-events-none" />

      <div className="absolute inset-0 bg-black/80 pointer-events-none" />

      <div className="relative z-10 p-6">
        <h3 className="text-3xl font-black text-center text-white mb-8 uppercase">
          Chọn Bắp Nước
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const qty = getQuantity(item.id);
            const typeLabel = TYPE_MAP[item.type] || item.type;
            const typeColor = TYPE_COLOR[item.type] || "bg-gray-600";

            return (
              <div
                key={item.id}
                className={`flex bg-white/5 border rounded-lg overflow-hidden transition-all duration-300 group ${
                  qty > 0
                    ? "border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.1)]"
                    : "border-white/10 hover:border-gray-500"
                }`}
              >
                <div className="relative w-28 h-auto bg-white/5 shrink-0 flex items-center justify-center p-2">
                  <div className="relative w-20 h-20">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center text-[10px] text-gray-400">
                        No Img
                      </div>
                    )}
                  </div>
                  <span
                    className={`absolute top-0 left-0 text-[9px] font-bold px-1.5 py-0.5 text-white rounded-br ${typeColor}`}
                  >
                    {typeLabel}
                  </span>
                </div>

                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase line-clamp-1 group-hover:text-yellow-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-snug">
                      {item.description ||
                        "Thơm ngon, hấp dẫn, trọn vị điện ảnh."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-bold bg-gradient-to-r from-[#FF7C61] to-[#FFB464] bg-clip-text text-transparent">
                      {formatCurrency(item.price)}
                    </span>

                    <div className="flex items-center bg-gray-800 rounded border border-gray-600">
                      <button
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-l"
                        onClick={() => onUpdate(item, -1)}
                        disabled={qty === 0}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-white bg-gray-900 h-7 leading-7">
                        {qty}
                      </span>
                      <button
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors rounded-r"
                        onClick={() => onUpdate(item, 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
