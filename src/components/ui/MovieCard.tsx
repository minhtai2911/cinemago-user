"use client";

import { Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  duration: string;
  genre: string;
  rating?: number;
  releaseDate?: string;
  isComingSoon?: boolean;
}

const SAMPLE_SHOWTIMES = ["09:30", "13:15", "19:45", "21:30"];

export default function MovieCard({
  id,
  title,
  poster,
  duration,
  genre,
  rating,
  isComingSoon,
}: MovieCardProps) {
  const linkHref = isComingSoon ? `/movies/${id}` : `/booking/${id}`;
  const buttonText = isComingSoon ? "Xem chi tiết" : "Đặt vé";

  return (
    <div className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
      {/* 1. POSTER IMAGE */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200">
        <Link href={`/movies/${id}`}>
          <Image
            src={poster || "https://placehold.co/400x600?text=No+Image"}
            alt={`Poster ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Rating Badge */}
          {rating && rating > 0 && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {rating.toFixed(1)}
            </div>
          )}
        </Link>
      </div>

      {/* 2. INFO CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        {/* Tên phim */}
        <Link href={`/movies/${id}`}>
          <h3
            className="text-lg font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-[#F25019] transition-colors"
            title={title}
          >
            {title}
          </h3>
        </Link>

        {/* Thời lượng & Thể loại */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{duration.replace(" phút", "p")}</span>
          </div>
          <span className="bg-orange-50 text-[#F25019] text-xs font-semibold px-2 py-0.5 rounded border border-orange-100 truncate max-w-[100px]">
            {genre.split(",")[0]}
          </span>
        </div>

        {!isComingSoon && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2 font-medium">
              Suất chiếu hôm nay:
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SHOWTIMES.map((time, index) => (
                <Link key={index} href={linkHref}>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-200 hover:bg-[#F25019] hover:text-white hover:border-[#F25019] transition-colors cursor-pointer">
                    {time}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-2 border-t border-gray-100">
          <Link href={linkHref} className="block w-full">
            <button className="w-full bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white font-bold py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 active:scale-95 text-sm uppercase tracking-wide">
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
