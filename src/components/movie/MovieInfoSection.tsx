"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Film } from "lucide-react";
import { Movie, Genre } from "@/types";
import TrailerModal from "./TrailerModal";
import { useState } from "react";

interface MovieInfoSectionProps {
  movie: Movie;
}

export default function MovieInfoSection({ movie }: MovieInfoSectionProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const genreNames = movie.genres?.map((g: Genre) => g.name).join(", ") || "—";
  const releaseDate = new Date(movie.releaseDate).toLocaleDateString("vi-VN");

  return (
    <>
      <div className="grid md:grid-cols-3 gap-10 mb-16">
        <div className="md:col-span-1">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
            <Image
              src={movie.thumbnail}
              alt={movie.title}
              width={400}
              height={600}
              className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl" />

            {movie.trailerUrl && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm rounded-2xl"
              >
                <div className="flex flex-col items-center gap-3 text-white">
                  <div className="p-6 bg-red-600 rounded-full animate-pulse">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold tracking-wider">
                    XEM TRAILER
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 leading-tight">
              {movie.title}
            </h1>

            <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
              {movie.description || "Đang cập nhật nội dung phim..."}
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-base">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-200">{movie.duration} phút</span>
            </div>
            <div className="flex items-center gap-3">
              <Film className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-200">{genreNames}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-200">{releaseDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <Link href={`/booking?movie=${movie.id}`}>
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 py-5 rounded-2xl text-xl uppercase tracking-wider shadow-2xl transition-all transform hover:scale-105 hover:shadow-yellow-400/50">
                Đặt vé ngay
              </button>
            </Link>

            {movie.trailerUrl && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="bg-transparent border-2 border-white hover:border-red-500 text-white hover:text-red-400 font-bold px-10 py-5 rounded-2xl text-xl uppercase tracking-wider transition-all flex items-center gap-3 group"
              >
                <svg
                  className="w-7 h-7 group-hover:scale-110 transition"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Xem Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      <TrailerModal
        videoOpen={isTrailerOpen}
        setVideoOpen={setIsTrailerOpen}
        videoUrl={movie.trailerUrl}
      />
    </>
  );
}
