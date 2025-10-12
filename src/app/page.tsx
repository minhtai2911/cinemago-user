"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FixedMenu from "../components/FixedMenu";
import BannerSlider from "../components/BannerSlider";
import QuickBooking from "../components/QuickBooking";
import MovieSection from "../components/MovieSection";

const API_URL = "http://localhost:8000/v1";

export default function Home() {
  const [nowShowing, setNowShowing] = useState<any[]>([]);
  const [comingSoon, setComingSoon] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    // Lấy Phim Đang Chiếu
    fetch(`${API_URL}/movies/public?isActive=true`)
      .then((res) => res.json())
      .then((data) => setNowShowing(data.data || []))
      .catch((error) => console.error("Lỗi khi tải Phim Đang Chiếu:", error));

    // Lấy Phim Sắp Chiếu
    fetch(`${API_URL}/movies/public?isActive=false`)
      .then((res) => res.json())
      .then((data) => setComingSoon(data.data || []))
      .catch((error) => console.error("Lỗi khi tải Phim Sắp Chiếu:", error));

    // Lấy Cụm Rạp
    fetch(`${API_URL}/cinemas/public`)
      .then((res) => res.json())
      .then((data) => setCinemas(data.data || []))
      .catch((error) => console.error("Lỗi khi tải Cụm Rạp:", error));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">
        <Navbar />
      </div>

      <FixedMenu />

      <div className="pt-[150px]">
        <BannerSlider />
        <QuickBooking
          cinemas={cinemas}
          nowShowing={nowShowing}
          showtimes={showtimes}
          selectedMovie={selectedMovie}
          selectedCinema={selectedCinema}
          selectedShowtime={selectedShowtime}
          selectedDate={selectedDate}
          availableDates={availableDates}
          setSelectedMovie={setSelectedMovie}
          setSelectedCinema={setSelectedCinema}
          setSelectedShowtime={setSelectedShowtime}
          setSelectedDate={setSelectedDate}
        />
        <MovieSection
          title="PHIM ĐANG CHIẾU"
          movies={nowShowing}
          showBookingButton
        />
        <MovieSection title="PHIM SẮP CHIẾU" movies={comingSoon} />
      </div>

      <Footer />
    </div>
  );
}
