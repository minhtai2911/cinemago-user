import Link from "next/link";
import Image from "next/image";
import { MapPin, Ticket, CalendarDays, Film } from "lucide-react";

import { getCinemaById, getMovies } from "@/services";
import { MovieStatus } from "@/types/movie";
import type { Movie, Cinema } from "@/types";
import MovieScheduleCard from "@/components/movie/MovieScheduleCard";
import Navbar from "@/components/Navbar";

export default async function CinemaDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const { id } = await params;
  const { tab = "now" } = await searchParams;

  const [cinemaRes, nowShowingRes, comingSoonRes] = await Promise.all([
    getCinemaById(id),
    getMovies(
      undefined,
      undefined,
      "",
      undefined,
      "",
      true,
      MovieStatus.NOW_SHOWING
    ),
    getMovies(
      undefined,
      undefined,
      "",
      undefined,
      "",
      true,
      MovieStatus.COMING_SOON
    ),
  ]);

  const cinema: Cinema = cinemaRes.data || cinemaRes;
  const nowShowingMovies: Movie[] = nowShowingRes.data || [];
  const comingSoonMovies: Movie[] = comingSoonRes.data || [];

  const isNowTab = tab === "now";
  const isSoonTab = tab === "soon";

  const mapQuery = encodeURIComponent(`${cinema.address}, ${cinema.city}`);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${cinema.longitude}!3d${cinema.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${mapQuery}!5e0!3m2!1svi!2s!4v1234567890`;

  return (
    <div className="relative min-h-screen bg-peach-gradient font-sans selection:bg-[#F25019] selection:text-white flex flex-col">
      <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>
      <div className="fixed top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>

        <Image
          src="/corn.png"
          alt=""
          width={1000}
          height={1000}
          className="hidden lg:block absolute top-32 -right-10 w-[45%] max-w-[800px] opacity-15 select-none object-contain"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />
      </div>
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/30">
        <Navbar />
      </div>
      <main className="relative z-10 flex-grow pt-10 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Card Thông tin Rạp */}
          <div className="bg-white rounded-2xl shadow-xl border border-white/50 p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100/40 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Đã sửa: Căn giữa toàn bộ nội dung text và cập nhật Gradient */}
              <div className="flex flex-col items-center text-center w-full md:w-auto md:items-start md:text-left md:flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#F25019] rounded-lg text-sm font-bold border border-orange-100/50 mb-4 mx-auto md:mx-0">
                  <Film size={16} />
                  <span>Rạp chiếu phim</span>
                </div>

                {/* Tiêu đề Rạp: Gradient mới + Căn giữa (do thẻ cha flex-col items-center) */}
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] to-[#FFAB91]">
                  {cinema.name}
                </h1>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-500 font-medium text-lg bg-gray-50 px-4 py-2 rounded-full border border-gray-100 hover:bg-orange-50 hover:border-orange-200 hover:text-[#F25019] transition cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-[#F25019]" />
                  <span>{cinema.address}</span>
                </a>
              </div>

              <div className="hidden md:block opacity-10 rotate-12 transform group-hover:scale-110 transition-transform duration-700">
                <Ticket size={140} />
              </div>
            </div>
          </div>

          <div className="overflow-hidden py-4">
            <h2 className="text-3xl font-black mb-8 flex items-center justify-center md:justify-start gap-3 px-2">
              <MapPin className="w-8 h-8 text-[#FF7043]" strokeWidth={2.5} />
              {/* Đã sửa: Gradient giống trang About */}
              <span className="bg-gradient-to-r from-[#FF7043] to-[#FFAB91] bg-clip-text text-transparent">
                Vị trí rạp chiếu
              </span>
            </h2>

            <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(255,112,67,0.3)] border-[6px] border-white/60 ring-1 ring-white/50 transform hover:scale-[1.01] transition-transform duration-500 ease-out">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí rạp"
                className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>

            <div className="flex justify-center mt-6">
              <p className="text-sm text-gray-500 font-medium bg-white/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/50">
                Nhấn vào bản đồ để mở Google Maps chỉ đường
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-white/50 p-6 md:p-8 min-h-[600px]">
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between border-b border-gray-100 mb-10 pb-2">
              <div className="flex gap-8 overflow-x-auto">
                <Link
                  href={{ query: { tab: "now" } }}
                  className={`pb-4 text-lg md:text-xl font-black uppercase tracking-wide transition-all border-b-4 whitespace-nowrap ${
                    isNowTab
                      ? "text-[#F25019] border-[#F25019]"
                      : "text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-200"
                  }`}
                >
                  Phim đang chiếu
                </Link>
                <Link
                  href={{ query: { tab: "soon" } }}
                  className={`pb-4 text-lg md:text-xl font-black uppercase tracking-wide transition-all border-b-4 whitespace-nowrap ${
                    isSoonTab
                      ? "text-[#F25019] border-[#F25019]"
                      : "text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-200"
                  }`}
                >
                  Phim sắp chiếu
                </Link>
              </div>
            </div>

            <div className="min-h-[400px]">
              {isNowTab && (
                <section className="space-y-8 animate-fadeIn">
                  {nowShowingMovies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-orange-50/50 rounded-2xl border border-dashed border-orange-200">
                      <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                        <CalendarDays className="w-10 h-10 text-orange-400" />
                      </div>
                      <div className="text-xl font-bold text-gray-600">
                        Hiện tại rạp chưa có lịch chiếu
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Vui lòng quay lại sau
                      </p>
                    </div>
                  ) : (
                    nowShowingMovies.map((movie) => (
                      <MovieScheduleCard
                        key={movie.id}
                        movie={movie}
                        cinemaId={id}
                      />
                    ))
                  )}
                </section>
              )}

              {isSoonTab && (
                <section className="space-y-8 animate-fadeIn">
                  {comingSoonMovies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-orange-50/50 rounded-2xl border border-dashed border-orange-200">
                      <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                        <CalendarDays className="w-10 h-10 text-orange-400" />
                      </div>
                      <div className="text-xl font-bold text-gray-600">
                        Chưa có phim sắp chiếu
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Vui lòng quay lại sau
                      </p>
                    </div>
                  ) : (
                    comingSoonMovies.map((movie) => (
                      <MovieScheduleCard
                        key={movie.id}
                        movie={movie}
                        cinemaId={id}
                      />
                    ))
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
