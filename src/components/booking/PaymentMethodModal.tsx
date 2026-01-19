"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PaymentMethod = "MOMO" | "VNPAY" | "ZALOPAY";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSelect,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const methods = [
    { id: "MOMO", name: "MoMo", icon: "/momo.png" },
    { id: "VNPAY", name: "VNPay", icon: "/vnpay.png" },
    { id: "ZALOPAY", name: "ZaloPay", icon: "/zalopay.png" },
  ];

  const handleSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      onSelect(selectedMethod);
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#fffbf5] rounded-2xl shadow-2xl w-full max-w-[500px] aspect-square p-5 sm:p-8 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-300 relative border border-white">
          <div className="absolute inset-0 bg-[url('/corn.webp')] bg-cover bg-center opacity-8 pointer-events-none" />
          {/* THAY ĐỔI Ở ĐÂY: Thêm 'mb-4 sm:mb-8' */}
          <h3 className="text-3xl md:text-3xl font-black text-center text-gray-900 mb-2 tracking-tight">
            LỰA CHỌN{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] to-[#FFAB91]">
              PHƯƠNG THỨC THANH TOÁN
            </span>
          </h3>

          <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-4 px-3 py-3 mb-3">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSelect(method.id as PaymentMethod)}
                className={`w-full flex items-center gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300 border relative overflow-hidden group ${
                  selectedMethod === method.id
                    ? "bg-white border-orange-500 shadow-[0_4px_20px_rgba(249,115,22,0.15)] scale-[1.02]"
                    : "bg-white/50 hover:bg-white border-gray-200/60 hover:border-orange-300 hover:shadow-md backdrop-blur-sm"
                }`}
              >
                {selectedMethod === method.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FF7C61] to-[#FFB464]" />
                )}

                <div className="w-10 h-10 sm:w-12 sm:h-12 relative shrink-0">
                  <Image
                    src={method.icon}
                    alt={method.name}
                    fill
                    className="object-contain drop-shadow-sm"
                  />
                </div>
                <span
                  className={`font-bold text-base sm:text-lg ${
                    selectedMethod === method.id
                      ? "text-orange-600"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {method.name}
                </span>

                {selectedMethod === method.id && (
                  <div className="ml-auto text-orange-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 shrink-0 mt-4 sm:mt-0">
            <button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg uppercase tracking-wider transition-all duration-300 shadow-lg ${
                selectedMethod
                  ? "bg-gradient-to-r from-[#FF7C61] to-[#FFB464] text-white hover:shadow-orange-400/50 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border border-gray-200"
              }`}
            >
              Tiếp tục
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 text-gray-600 hover:text-gray-900 font-bold text-sm sm:text-base uppercase tracking-wider transition-colors hover:bg-black/5 rounded-xl"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
