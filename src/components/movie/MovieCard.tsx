"use client";

import React, { useState } from "react";
import { Movie, Genre } from "@/types";
import Image from "next/image";
import { Clock, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import TrailerModal from "@/components/movie/TrailerModal";
import { createPortal } from "react-dom";

interface MovieCardProps {
  movie: Movie;
  showBookingButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showBookingButton = false,
}) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const router = useRouter();

  if (!movie) {
    return null;
  }

  const handleGoToDetail = () => {
    router.push(`/movies/${movie.id}`);
  };

  const genreNames =
    movie.genres && Array.isArray(movie.genres)
      ? movie.genres.map((g: Genre) => g.name).join(", ")
      : "—";

  return (
    <>
      <div
        className="bg-white rounded-3xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] h-full flex flex-col group cursor-pointer border border-gray-100 hover:border-orange-200"
        onClick={handleGoToDetail}
      >
        <div className="relative aspect-[2/3] w-full bg-gray-100 overflow-hidden">
          <Image
            src={movie.thumbnail || "/placeholder.jpg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />

          {movie.rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-orange-600 text-xs font-black px-2.5 py-1.5 rounded-lg shadow-sm z-10 flex items-center gap-1">
              <span className="text-yellow-500 text-sm">★</span>{" "}
              {movie.rating.toFixed(1)}
            </div>
          )}

          {movie.trailerUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(true);
              }}
              className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-black/50 hover:bg-[#F25019] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full backdrop-blur-md transition-all duration-300 border border-white/20 hover:border-transparent active:scale-95"
            >
              <Play size={10} fill="currentColor" />
              Xem Trailer
            </button>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-black text-gray-800 line-clamp-1 mb-2 group-hover:text-[#F25019] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-5 font-medium">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
              <Clock size={14} className="text-[#F25019]" />
              <span>{movie.duration ? `${movie.duration}'` : "N/A"}</span>
            </div>
            <span className="truncate flex-1 text-gray-500 pl-1">
              {genreNames}
            </span>
          </div>
          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (showBookingButton) {
                  router.push(`/booking?movie=${movie.id}`);
                } else {
                  handleGoToDetail();
                }
              }}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-300 transform active:scale-95 border
              ${
                showBookingButton
                  ? "bg-[#F25019] text-white border-transparent hover:bg-[#d14012] hover:shadow-orange-200 hover:shadow-lg"
                  : "bg-white text-gray-600 border-gray-100 hover:border-[#F25019] hover:bg-[#F25019] hover:text-white"
              }`}
            >
              {showBookingButton ? "ĐẶT VÉ NGAY" : "XEM CHI TIẾT"}
            </button>
          </div>
        </div>
      </div>

      {showTrailer &&
        createPortal(
          <TrailerModal
            videoOpen={showTrailer}
            setVideoOpen={setShowTrailer}
            videoUrl={movie.trailerUrl}
          />,
          document.body
        )}
    </>
  );
};

export default MovieCard;
