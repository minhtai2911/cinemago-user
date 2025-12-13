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
        className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)] h-full flex flex-col group cursor-pointer border border-gray-100"
        onClick={handleGoToDetail}
      >
        <div className="relative h-72 w-full bg-gray-200 overflow-hidden">
          <Image
            src={movie.thumbnail || "/placeholder.jpg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />

          {movie.rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-orange-600 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm z-10 flex items-center gap-1">
              <span>★</span> {movie.rating.toFixed(1)}
            </div>
          )}

          {movie.trailerUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(true);
              }}
              className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 hover:bg-[#F25019] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors duration-300"
            >
              <Play size={10} fill="currentColor" />
              Xem Trailer
            </button>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-[#F25019] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-[#F25019]" />
              <span className="font-medium">
                {movie.duration ? `${movie.duration}'` : "N/A"}
              </span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="truncate max-w-[150px] text-gray-500">
              {genreNames}
            </span>
          </div>
          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (showBookingButton) {
                  router.push(`/booking/${movie.id}`);
                } else {
                  handleGoToDetail();
                }
              }}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-all duration-300 transform active:scale-95
              ${
                showBookingButton
                  ? "bg-[#F25019] text-white hover:bg-[#d14012] hover:shadow-lg"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#F25019]"
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
