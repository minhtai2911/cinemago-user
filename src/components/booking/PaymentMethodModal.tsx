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
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

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
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Chọn phương thức thanh toán
          </h3>

          <div className="space-y-3">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSelect(method.id as PaymentMethod)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all border ${
                  selectedMethod === method.id
                    ? "bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/20"
                    : "bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-purple-500"
                }`}
              >
                <div className="w-12 h-12 relative">
                  <Image
                    src={method.icon}
                    alt={method.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-white font-medium">{method.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                selectedMethod
                  ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                  : "bg-slate-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              Tiếp tục
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-gray-400 hover:text-white font-medium"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}