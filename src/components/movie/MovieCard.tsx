"use client";

import React, { useState } from "react";
import { Movie, Genre } from "@/types";
import Image from "next/image";
import { Clock, Play, Star } from "lucide-react";
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
        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(242,80,25,0.15)] border border-gray-100 hover:border-orange-100 transition-all duration-300 h-full flex flex-col cursor-pointer"
        onClick={handleGoToDetail}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={movie.thumbnail || "/placeholder.jpg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {movie.rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-gray-900 text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 z-10">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              {movie.rating.toFixed(1)}
            </div>
          )}

          {movie.trailerUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(true);
              }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 flex items-center gap-2 bg-[#F25019] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:bg-[#d14012] active:scale-95 whitespace-nowrap"
            >
              <Play size={10} fill="currentColor" />
              Xem Trailer
            </button>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-[17px] font-black text-gray-800 line-clamp-1 mb-2 uppercase group-hover:text-[#F25019] transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center gap-3 text-gray-500 text-xs mb-4 font-medium">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-400" />
              <span>{movie.duration ? `${movie.duration}'` : "N/A"}</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <span className="truncate flex-1">{genreNames}</span>
          </div>

          <div className="mt-auto pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (showBookingButton) {
                  router.push(`/booking?movie=${movie.id}`);
                } else {
                  handleGoToDetail();
                }
              }}
              className={`w-full py-3 rounded-xl font-bold text-[13px] tracking-wide shadow-sm transition-all duration-300 active:scale-[0.98]
              ${
                showBookingButton
                  ? "bg-[#F25019] text-white hover:bg-[#d14012] hover:shadow-orange-200 hover:shadow-lg border border-transparent"
                  : "bg-orange-50 text-[#F25019] border border-orange-100 hover:bg-[#F25019] hover:text-white hover:border-[#F25019]"
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
