"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black z-50">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-white text-lg">Đang tải...</p>
    </div>
  );
}
