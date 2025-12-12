"use client";

import React, { useState } from "react";
import { Clock, Calendar, Tag, Star, PlayCircle, X } from "lucide-react";
import { Movie } from "@/types"; // Import type Movie của bạn

interface MovieDetailProps {
  movie: Movie;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false);

  // --- LOGIC XỬ LÝ URL TRAILER ---
  const isYoutube =
    movie.trailerUrl?.includes("youtube.com") ||
    movie.trailerUrl?.includes("youtu.be");

  const getYoutubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const youtubeVideoId =
    isYoutube && movie.trailerUrl ? getYoutubeId(movie.trailerUrl) : null;

  const isCloudinaryVideo =
    movie.trailerUrl?.includes("res.cloudinary.com") &&
    movie.trailerUrl?.includes("/video/upload/");

  // --- LOGIC FORMAT NGÀY ---
  const formattedDate = new Date(movie.releaseDate).toLocaleDateString(
    "vi-VN",
    { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit" }
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* CỘT TRÁI: Poster */}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-4">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-gray-800 shadow-xl">
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* CỘT PHẢI: Thông tin */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-white">
            {movie.title}
          </h1>

          <div className="flex flex-wrap flex-col gap-4 text-sm text-gray-300 ">
            <div className="flex items-center gap-2">
              <Tag className="text-yellow-500 w-5 h-5" />
              <span>
                {movie.genres && movie.genres.length > 0
                  ? movie.genres.map((g) => g.name).join(", ")
                  : "Đang cập nhật"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="text-yellow-500 w-5 h-5" />
              <span>{movie.duration} phút</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="text-yellow-500 w-5 h-5" />
              <span className="capitalize">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Star className="text-yellow-500 w-5 h-5 fill-yellow-500" />
            <span className="text-xl font-bold text-white">
              {typeof movie.rating === "number"
                ? movie.rating.toFixed(1)
                : movie.rating}
            </span>
            <span className="text-xl text-gray-400">/ 5</span>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-white uppercase mb-2">
              NỘI DUNG PHIM
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed text-justify">
              {movie.description}
            </p>
          </div>

          <div className="mt-4">
            {movie.trailerUrl ? (
              <button
                onClick={() => setShowTrailer(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors shadow-lg"
              >
                <PlayCircle size={24} className="fill-white text-red-600" />
                Xem Trailer
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-gray-300 rounded font-semibold cursor-not-allowed"
              >
                <PlayCircle size={24} /> Chưa có Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL TRAILER --- */}
      {showTrailer && movie.trailerUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative pt-[56.25%] w-full bg-black">
              {isYoutube && youtubeVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : isCloudinaryVideo ? (
                <video
                  src={movie.trailerUrl}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <p>Định dạng video không được hỗ trợ.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetail;
