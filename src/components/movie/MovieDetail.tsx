"use client";

import React, { useState } from "react";
import { Clock, Calendar, Tag, Star, PlayCircle } from "lucide-react";
import { Movie } from "@/types";
import Image from "next/image";
import TrailerModal from "@/components/movie/TrailerModal"; 

interface MovieDetailProps {
  movie: Movie;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie }) => {
  const [videoOpen, setVideoOpen] = useState(false);

  const formattedDate = new Date(movie.releaseDate).toLocaleDateString(
    "vi-VN",
    {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-4">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-gray-800 shadow-xl">
            <Image
              src={movie.thumbnail}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-8 flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-white">
            {movie.title}
          </h1>

          <div className="flex flex-wrap flex-col gap-4 text-sm text-gray-300">
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

          <div className="mt-6">
            {movie.trailerUrl ? (
              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors shadow-lg"
              >
                <PlayCircle size={24} className="fill-white" />
                Xem Trailer
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-gray-300 rounded font-semibold cursor-not-allowed"
              >
                <PlayCircle size={24} />
                Chưa có Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      <TrailerModal
        videoOpen={videoOpen}
        setVideoOpen={setVideoOpen}
        videoUrl={movie.trailerUrl}
      />
    </>
  );
};

export default MovieDetail;
