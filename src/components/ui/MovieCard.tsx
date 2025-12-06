"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface MovieCardData {
  id: string;
  title: string;
  poster: string;
  duration: string;
  genre: string;
  rating?: number;
  releaseDate?: string;
  isComingSoon?: boolean;
}

// Dữ liệu suất chiếu mẫu, sau này sẽ được thay bằng dữ liệu từ API
const sampleShowtimes = ["11:30", "16:00", "20:30"];

export default function MovieCard({
  id,
  title,
  poster,
  duration,
  genre,
  isComingSoon,
}: MovieCardData) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-visible transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Movie Poster */}
      <div className="relative h-64 w-full">
        <Image
          src={poster || "/fallback-poster.png"}
          alt={`Poster for ${title}`}
          layout="fill"
          objectFit="contain"
          className="transition-transform duration-300 rounded-lg"
        />
      </div>

      {/* Movie Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 truncate mb-3">
          {title}
        </h3>

        {/* Duration and Genre */}
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-gray-500" />
            <span>{duration}</span>
          </div>
          <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            {genre.split(",")[0]}
          </span>
        </div>

        {/* Showtimes */}
        {!isComingSoon && (
          <div className="mb-5">
            <p className="text-sm text-gray-500 mb-2">Suất chiếu:</p>
            <div className="flex flex-wrap gap-2">
              {sampleShowtimes.map((time) => (
                <button
                  key={time}
                  className="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-orange-50 hover:border-orange-400 transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link href={isComingSoon ? `/movies/${id}` : `/booking/${id}`} passHref>
          <button className="w-full bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
            {isComingSoon ? "Xem chi tiết" : "Đặt vé"}
          </button>
        </Link>
      </div>
    </div>
  );
}
