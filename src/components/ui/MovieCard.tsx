"use client";

import React, { useState, useEffect } from "react";
import { Movie, Genre } from "@/types";
import Image from "next/image";
import { Clock, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface MovieCardProps {
  movie: Movie;
  showBookingButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showBookingButton = false,
}) => {
  if (!movie) return null;

  const [showTrailer, setShowTrailer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (showTrailer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showTrailer]);

  const handleGoToDetail = () => {
    router.push(`/movies/${movie.id}`);
  };

  const genreNames =
    movie.genres && Array.isArray(movie.genres)
      ? movie.genres.map((g: Genre) => g.name).join(", ")
      : "—";

  const isYoutube =
    movie.trailerUrl?.includes("youtube.com") ||
    movie.trailerUrl?.includes("youtu.be");

  const youtubeVideoId = isYoutube
    ? movie.trailerUrl?.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1]
    : null;

  const isCloudinaryVideo =
    movie.trailerUrl?.includes("res.cloudinary.com") &&
    movie.trailerUrl?.includes("/video/upload/");

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
              Trailer
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
              {genreNames.split(",")[0]}
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

      {showTrailer && movie.trailerUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
          onClick={() => setShowTrailer(false)}
        >
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-5 right-5 z-50 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
          >
            <X size={28} />
          </button>

          {/* Container Video */}
          <div
            className="w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-2xl relative outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {isYoutube ? (
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&fs=1`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-0"
                />
              </div>
            ) : isCloudinaryVideo ? (
              <video
                src={movie.trailerUrl}
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh] mx-auto object-contain"
              />
            ) : (
              <div className="text-white text-center py-20">
                <p>Định dạng video không hỗ trợ</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
