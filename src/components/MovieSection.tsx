import React from "react";
import MovieCard from "./MovieCard";

interface MovieSectionProps {
  title: string;
  movies: any[];
  showBookingButton?: boolean;
}

const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  showBookingButton = false,
}) => {
  return (
    <section className="max-w-6xl mx-auto mb-16 mt-12 text-center">
      <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            showBookingButton={showBookingButton}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieSection;
