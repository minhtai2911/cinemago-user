"use client";

import { useState, useEffect } from "react";
import { getMovies } from "@/services/movieService";
import { Movie, MovieStatus } from "@/types/movie";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackBanners = [
  {
    id: "1",
    title: "VENOM: THE LAST DANCE",
    subtitle: "Cuộc chiến cuối cùng bắt đầu",
    image: "/banners/venom.jpg",
    releaseDate: "25/10/2024",
  },
  {
    id: "2",
    title: "TRANSFORMERS ONE",
    subtitle: "Hành trình về nguồn gốc",
    image: "/banners/transformers.jpg",
    releaseDate: "11/10/2024",
  },
  {
    id: "3",
    title: "JOKER: FOLIE À DEUX",
    subtitle: "Điên loạn trở lại",
    image: "/banners/joker.jpg",
    releaseDate: "04/10/2024",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState(fallbackBanners);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await getMovies(1, 3, undefined, undefined, undefined, true, MovieStatus.NOW_SHOWING);
        if (response && response.data && response.data.length > 0) {
          const formattedBanners = response.data.map((movie: Movie, index: number) => ({
            id: movie.id,
            title: movie.title,
            subtitle: movie.genres.map(g => g.name).join(', '),
            image: movie.poster || fallbackBanners[index % fallbackBanners.length].image,
            releaseDate: new Date(movie.releaseDate).toLocaleDateString('vi-VN'),
          }));
          setBanners(formattedBanners);
        } else {
          setBanners(fallbackBanners);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        setBanners(fallbackBanners);
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
      <section className="relative h-[70vh] bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-[70vh] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Không có banner để hiển thị</h2>
          <p className="text-gray-500">Vui lòng thử lại sau.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] overflow-hidden bg-peach-gradient">
      {/* Peach gradient background & popcorn image */}
      <img src="/popcorn.png" alt="popcorn" className="hidden md:block absolute left-0 top-0 w-[40vw] opacity-20 pointer-events-none select-none" style={{zIndex:1}} />
      {/* Glass overlay */}
      <div className="absolute inset-0 glass-overlay soft-shadow pointer-events-none" style={{zIndex:2}} />
      {/* Slider */}
      <div className="relative h-full z-10 flex items-center justify-center">
        {banners.length > 0 ? (
          <div className="w-full max-w-4xl mx-auto flex items-center">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/80 border border-[#F25019] mr-4 shadow-lg hover:bg-orange-100 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-[#F25019]" />
            </button>
            <div className="flex-1">
              <img
                src={banners[currentSlide].image}
                alt={banners[currentSlide].title}
                className="w-full h-72 object-cover rounded-2xl shadow-lg mb-6"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-[#F25019] mb-2">
                {banners[currentSlide].title}
              </h1>
              <p className="text-lg text-gray-700 mb-2">
                {banners[currentSlide].subtitle}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-500">Khởi chiếu:</span>
                <span className="font-bold text-[#F25019]">
                  {banners[currentSlide].releaseDate}
                </span>
              </div>
              <button className="bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white px-8 py-3 rounded-full font-semibold shadow hover:scale-105 transition-all">
                Đặt vé ngay
              </button>
            </div>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/80 border border-[#F25019] ml-4 shadow-lg hover:bg-orange-100 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-[#F25019]" />
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">Không có phim nổi bật để hiển thị</div>
        )}
      </div>
    </section>
  );
}
