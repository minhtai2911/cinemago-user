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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] group border border-gray-100">
            <Image
              src={movie.thumbnail}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {movie.trailerUrl ? (
              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 hover:border-[#F25019] hover:text-[#F25019] rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md"
              >
                <PlayCircle size={18} />
                Xem Trailer
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg font-semibold text-sm cursor-not-allowed"
              >
                <PlayCircle size={18} />
                Chưa có Trailer
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-5">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 leading-tight mb-2">
              {movie.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-bold text-gray-900">
                {typeof movie.rating === "number"
                  ? movie.rating.toFixed(1)
                  : movie.rating}
              </span>
              <span className="text-gray-400 text-sm">/ 5 điểm</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F25019]/10 text-[#F25019] rounded-lg text-sm font-bold border border-[#F25019]/20">
              <Tag size={16} />
              <span>
                {movie.genres?.map((g) => g.name).join(", ") || "Phim hay"}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
              <Clock size={16} />
              <span>{movie.duration} phút</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
              <Calendar size={16} />
              <span className="capitalize">{formattedDate}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 uppercase mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#F25019] rounded-full block"></span>
              Nội dung phim
            </h3>
            <p className="text-gray-600 leading-relaxed text-justify text-base">
              {movie.description}
            </p>
          </div>

          <div className="mt-4">
            {movie.trailerUrl && (
              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 hover:border-[#F25019] hover:text-[#F25019] rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md"
              >
                <PlayCircle size={18} />
                Xem Trailer
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
