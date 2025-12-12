"use client";

import React, { useState } from "react";
import { Movie, Genre } from "@/types";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

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
        className="flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer"
        onClick={handleGoToDetail}
      >
        <div className="relative w-full rounded-xl overflow-hidden shadow-md border border-gray-700">
          <Image
            src={movie.thumbnail}
            alt={movie.title}
            width={400}
            height={450}
            suppressHydrationWarning
          />

          <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-4">
            <h3 className="text-lg font-bold text-white uppercase mb-2">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-300 mb-1">{genreNames}</p>
            <p className="text-sm text-gray-300 mb-1">
              {movie.duration ? `${movie.duration} phút` : "—"}
            </p>
            {movie.rating > 0 && (
              <p className="text-sm text-gray-300 mb-1">
                Phân loại: {movie.rating}
              </p>
            )}
          </div>
        </div>

        <h4 className="mt-3 text-center text-base font-bold text-white group-hover:text-red-500 transition">
          {movie.title}
        </h4>

        <div className="flex items-center justify-center gap-4 mt-2">
          {movie.trailerUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(true);
              }}
              className="flex items-center gap-1 text-sm text-white hover:text-red-400 transition"
            >
              Xem Trailer
            </button>
          )}

          {showBookingButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/booking?movie=${movie.id}`);
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-6 py-1.5 rounded-lg transition"
            >
              ĐẶT VÉ
            </button>
          )}
        </div>
      </div>

      {showTrailer && movie.trailerUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl">
              {isYoutube ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              ) : isCloudinaryVideo ? (
                <video
                  src={movie.trailerUrl}
                  controls
                  autoPlay
                  className="absolute top-0 left-0 w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Không hỗ trợ định dạng trailer
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
