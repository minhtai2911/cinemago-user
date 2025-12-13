"use client";

import React, { useState } from "react";
import { Movie, Genre } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TrailerModal from "./TrailerModal";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  showBookingButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showBookingButton = false,
}) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const router = useRouter();

  const handleGoToDetail = () => {
    router.push(`/movies/${movie.id}`);
  };

  const genreNames = movie.genres?.map((g: Genre) => g.name).join(", ") || "—";

  const rating = Number(movie.rating) || 0;
  const hasRating = rating > 0 && rating <= 5;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.3 && rating % 1 < 0.8;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      <div
        className="group flex flex-col items-center cursor-pointer select-none"
        onClick={handleGoToDetail}
      >
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-gray-800 transition-transform group-hover:scale-105 duration-500">
          <Image
            src={movie.thumbnail}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">
              {movie.title}
            </h3>

            <p className="text-gray-200 text-sm mb-1">{genreNames}</p>
            <p className="text-gray-300 text-sm">
              {movie.duration ? `${movie.duration} phút` : "—"}
            </p>

            {hasRating && (
              <div className="mt-4 flex items-center gap-1">
                {[...Array(fullStars)].map((_, i) => (
                  <Star
                    key={`full-${i}`}
                    className="w-8 h-8 fill-yellow-400 text-yellow-400"
                  />
                ))}

                {hasHalfStar && (
                  <Star className="w-8 h-8 fill-yellow-400/50 text-yellow-400 relative">
                    <div className="absolute inset-0 w-1/2 overflow-hidden">
                      <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                    </div>
                  </Star>
                )}

                {[...Array(emptyStars)].map((_, i) => (
                  <Star
                    key={`empty-${i}`}
                    className="w-8 h-8 fill-gray-700 text-gray-700"
                  />
                ))}
                <span className="ml-3 text-2xl font-bold text-yellow-400">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        <h4 className="mt-4 text-center text-lg font-bold text-white group-hover:text-red-500 transition line-clamp-2 px-2">
          {movie.title}
        </h4>

        <div className="flex items-center justify-center gap-8 mt-4">
          {movie.trailerUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsTrailerOpen(true);
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition font-medium"
            >
              Xem Trailer
            </button>
          )}

          {showBookingButton && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/booking/${movie.id}`);
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-10 py-3 rounded-full text-sm uppercase tracking-wider shadow-2xl transition-all hover:shadow-yellow-500/50 hover:-translate-y-1"
            >
              Đặt vé ngay
            </button>
          )}
        </div>
      </div>

      <TrailerModal
        videoOpen={isTrailerOpen}
        setVideoOpen={setIsTrailerOpen}
        videoUrl={movie.trailerUrl}
      />
    </>
  );
};

export default MovieCard;
