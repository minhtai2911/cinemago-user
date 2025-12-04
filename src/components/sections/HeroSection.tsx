"use client";

import { useState, useEffect } from "react";
import { getMovies } from "@/services/movieService";
import { Movie, MovieStatus } from "@/types/movie";
import { ChevronLeft, ChevronRight, Calendar, Star } from "lucide-react";

const fallbackBanners = [
  {
    id: "1",
    title: "VENOM: THE LAST DANCE",
    subtitle: "Cuộc chiến cuối cùng bắt đầu",
    image: "/banners/venom.jpg",
    releaseDate: "25/10/2024",
    genres: "Hành động, Khoa học viễn tưởng",
  },
  {
    id: "2",
    title: "TRANSFORMERS ONE",
    subtitle: "Hành trình về nguồn gốc",
    image: "/banners/transformers.jpg",
    releaseDate: "11/10/2024",
    genres: "Hoạt hình, Hành động",
  },
  {
    id: "3",
    title: "JOKER: FOLIE À DEUX",
    subtitle: "Điên loạn trở lại",
    image: "/banners/joker.jpg",
    releaseDate: "04/10/2024",
    genres: "Tội phạm, Tâm lý",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState(fallbackBanners);
  const [loading, setLoading] = useState(true);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, banners.length]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await getMovies(
          1,
          5, // Lấy 5 phim mới nhất làm banner
          undefined,
          undefined,
          undefined,
          true,
          MovieStatus.NOW_SHOWING
        );
        if (response && response.data && response.data.length > 0) {
          const formattedBanners = response.data.map(
            (movie: Movie, index: number) => ({
              id: movie.id,
              title: movie.title,
              subtitle: movie.genres.map((g) => g.name).join(", "),
              genres: movie.genres.map((g) => g.name).join(", "),
              image:
                movie.thumbnail ||
                movie.thumbnail ||
                fallbackBanners[index % fallbackBanners.length].image,
              releaseDate: new Date(movie.releaseDate).toLocaleDateString(
                "vi-VN"
              ),
            })
          );
          setBanners(formattedBanners);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F25019]"></div>
      </div>
    );
  }

  return (
    // Container chính - Chiều cao khớp với khung kính ở page.tsx
    <div className="relative w-full h-[400px] md:h-[500px] group overflow-hidden bg-gray-900 rounded-2xl">
      {/* 1. BACKGROUND IMAGE SLIDER */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Ảnh nền */}
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />

          {/* Lớp phủ gradient để chữ dễ đọc hơn */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
      ))}

      {/* 2. NỘI DUNG CHỮ (OVERLAY) */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
        <div className="max-w-3xl space-y-4 animate-fadeIn">
          {/* Badge Thể loại */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F25019]/20 border border-[#F25019]/50 backdrop-blur-md">
            <Star className="w-3 h-3 text-[#F25019] mr-2" fill="currentColor" />
            <span className="text-xs md:text-sm font-bold text-[#F25019] uppercase tracking-wider">
              {banners[currentSlide].genres || "Phim Hot"}
            </span>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-xl">
            {banners[currentSlide].title}
          </h1>

          {/* Ngày chiếu & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F25019]" />
              <span className="text-sm font-medium">
                Khởi chiếu: {banners[currentSlide].releaseDate}
              </span>
            </div>
            <span className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></span>
            <p className="text-sm md:text-base line-clamp-1 italic opacity-80">
              {banners[currentSlide].subtitle}
            </p>
          </div>

          {/* Nút đặt vé */}
          <div className="pt-4">
            <button className="bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-500/30 hover:scale-105 hover:shadow-orange-500/50 transition-all duration-300 transform">
              Đặt vé ngay
            </button>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION BUTTONS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white backdrop-blur-sm border border-white/10 hover:bg-[#F25019] hover:border-[#F25019] transition-all opacity-0 group-hover:opacity-100 z-30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white backdrop-blur-sm border border-white/10 hover:bg-[#F25019] hover:border-[#F25019] transition-all opacity-0 group-hover:opacity-100 z-30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 4. DOTS INDICATOR */}
      <div className="absolute bottom-6 right-6 md:right-12 flex space-x-2 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-[#F25019]"
                : "w-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
