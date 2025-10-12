"use client";
import { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const bannerImages = [
  "/banners/banner1.png",
  "/banners/banner2.jpg",
  "/banners/banner3.jpg",
  "/banners/banner4.png",
];
const BANNER_INTERVAL = 4000;

export default function BannerSlider() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, BANNER_INTERVAL);
    return () => {
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, [currentBanner]);

  const nextBanner = () =>
    setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
  const prevBanner = () =>
    setCurrentBanner((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );

  return (
    <div className="relative flex flex-col items-center justify-center max-w-7xl mx-auto px-4 mb-10">
      <button
        onClick={prevBanner}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-0 hover:text-yellow-400"
      >
        <FiChevronLeft size={48} />
      </button>

      <img
        src={bannerImages[currentBanner]}
        alt={`Banner ${currentBanner + 1}`}
        className="w-full h-[300px] md:h-[450px] object-cover rounded-2xl shadow-lg transition-all duration-500 bg-white"
      />

      <button
        onClick={nextBanner}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-0 hover:text-yellow-400"
      >
        <FiChevronRight size={48} />
      </button>

      <div className="flex justify-center gap-2 mt-4">
        {bannerImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentBanner(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentBanner === idx
                ? "bg-yellow-400 scale-125"
                : "bg-gray-400 opacity-60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
