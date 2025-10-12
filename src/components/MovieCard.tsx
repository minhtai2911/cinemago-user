import React from "react";

interface MovieCardProps {
  movie: any;
  showBookingButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showBookingButton = false,
}) => {
  const genreNames =
    movie.genres && Array.isArray(movie.genres)
      ? movie.genres.map((g: any) => g.name).join(", ")
      : "—";

  return (
    <div className="flex flex-col items-center group transition-transform hover:scale-105">
      <div className="relative w-full rounded-xl overflow-hidden shadow-md border border-gray-700">
        <img
          src={movie.thumbnail || "/no-image.jpg"}
          alt={movie.title}
          className="w-full h-80 object-cover rounded-xl transition-opacity duration-300 group-hover:opacity-30"
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

      {/* Tên phim */}
      <h4 className="mt-3 text-center text-base font-bold text-white group-hover:text-red-500 transition">
        {movie.title}
      </h4>

      {/* Hành động */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button className="flex items-center gap-1 text-sm text-white hover:text-red-400 transition">
          ▶ Xem Trailer
        </button>

        {showBookingButton && (
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold px-6 py-1.5 rounded-lg transition">
            ĐẶT VÉ
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
