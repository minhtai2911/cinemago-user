"use client";

import MovieCard from "./MovieCard";
import Link from "next/link";
import { Movie } from "@/types";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  showBookingButton?: boolean;
  showMoreLink?: string;
}

export default function MovieSection({
  title,
  movies,
  showBookingButton,
  showMoreLink,
}: MovieSectionProps) {
  return (
    <section className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showMoreLink && (
          <Link
            href={showMoreLink}
            className="text-red-500 hover:text-red-400 font-medium"
          >
            Xem thêm
          </Link>
        )}
      </div>
      {movies.length === 0 ? (
        <p className="text-gray-400">Không có phim nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              showBookingButton={showBookingButton}
            />
          ))}
        </div>
      )}
    </section>
  );
}
