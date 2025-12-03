"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { getMovies } from "@/services/movieService";
import { getCinemas } from "@/services/cinemaService";
import { Movie, MovieStatus } from "@/types/movie";

interface Cinema {
  id: string;
  name: string;
  address?: string;
}

export default function QuickBooking() {
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackMovies = [
    "Venom: The Last Dance",
    "Transformers One", 
    "Joker: Folie À Deux",
    "The Wild Robot",
    "Beetlejuice Beetlejuice",
  ];

  const fallbackCinemas = [
    "CinemaGo Vincom Center",
    "CinemaGo Landmark 81", 
    "CinemaGo Saigon Center",
    "CinemaGo Diamond Plaza",
  ];

  const showtimes = [
    "09:00", "11:30", "14:00", "16:30", "19:00", "21:30"
  ];

  // Load data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Load movies và cinemas song song
        const [moviesResponse, cinemasResponse] = await Promise.all([
          getMovies(1, 20, undefined, undefined, undefined, true, MovieStatus.NOW_SHOWING) as Promise<any>,
          getCinemas(1, 20, undefined, true) as Promise<any>
        ]);

        // Set movies
        if (moviesResponse?.data && Array.isArray(moviesResponse.data)) {
          setMovies(moviesResponse.data);
        }

        // Set cinemas  
        if (cinemasResponse?.data && Array.isArray(cinemasResponse.data)) {
          setCinemas(cinemasResponse.data);
        }
      } catch (err) {
        console.error("Error fetching booking data:", err);
        // Fallback data sẽ được sử dụng trong render
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#F25019] mb-8 text-center">Đặt vé nhanh</h2>
        <div className="glass-overlay soft-shadow p-8 md:p-12 rounded-3xl border border-white/30">
          <div className="space-y-6">
            {/* Movie Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Chọn phim
              </label>
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                disabled={loading}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none bg-white text-gray-800 transition-all duration-300 disabled:opacity-50"
              >
                <option value="">{loading ? "Đang tải..." : "Chọn phim bạn muốn xem"}</option>
                {movies.length > 0 ? 
                  movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  )) :
                  fallbackMovies.map((movie, index) => (
                    <option key={index} value={movie}>
                      {movie}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Cinema Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Chọn rạp
              </label>
              <select
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
                disabled={loading}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none bg-white text-gray-800 transition-all duration-300 disabled:opacity-50"
              >
                <option value="">{loading ? "Đang tải..." : "Chọn rạp chiếu"}</option>
                {cinemas.length > 0 ?
                  cinemas.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </option>
                  )) :
                  fallbackCinemas.map((cinema, index) => (
                    <option key={index} value={cinema}>
                      {cinema}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Date & Time Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Ngày chiếu
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F25019] focus:outline-none bg-white text-gray-800 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Giờ chiếu
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none bg-white text-gray-800 transition-all duration-300"
                >
                  <option value="">Chọn suất chiếu</option>
                  {showtimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Book Button */}
            <button 
              disabled={loading || !selectedMovie || !selectedCinema || !selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Đang tải..." : "Chọn ghế & Thanh toán"}
            </button>

            {/* Info */}
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Miễn phí hủy vé trước 2 giờ chiếu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
