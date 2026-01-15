import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays } from "lucide-react";

import { getCinemaById, getMovies } from "@/services";
import { MovieStatus } from "@/types/movie";
import type { Movie, Cinema } from "@/types";
import MovieScheduleCard from "@/components/movie/MovieScheduleCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  const brandName = "Cinemago";
  let titlePrefix = cinema.name;
  let titleSuffix = "";

  if (cinema.name.includes(brandName)) {
    titlePrefix = brandName;
    titleSuffix = cinema.name.replace(brandName, "");
  } else {
    const firstSpaceIndex = cinema.name.indexOf(" ");
    if (firstSpaceIndex !== -1) {
      titlePrefix = cinema.name.substring(0, firstSpaceIndex);
      titleSuffix = cinema.name.substring(firstSpaceIndex);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FFF8F5] font-sans text-stone-800 selection:bg-[#F25019] selection:text-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 opacity-60"></div>

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
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="relative py-8 md:py-12 flex flex-col items-center text-center animate-fade-in-up">
            <span className="inline-block py-2 px-4 rounded-full bg-orange-50 border border-orange-100 text-[#E65100] text-xs font-bold tracking-widest uppercase mb-6">
              Rạp chiếu phim
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight tracking-tighter">
              <span className="text-stone-800">{titlePrefix}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] to-[#FFAB91]">
                {titleSuffix}
              </span>
            </h1>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-stone-500 font-medium text-base md:text-lg hover:text-[#FF7043] transition-colors duration-200 cursor-pointer mt-2"
            >
              <MapPin className="w-5 h-5 text-stone-400 group-hover:text-[#FF7043] transition-colors" />
              <span className="border-b border-transparent group-hover:border-[#FF7043]/30">
                {cinema.address}
              </span>
            </a>
          </div>

          <div className="overflow-hidden">
            <h2 className="text-3xl font-black mb-8 flex items-center justify-center md:justify-start gap-3 px-2">
              <MapPin className="w-8 h-8 text-[#FF7043]" strokeWidth={2.5} />
              <span className="bg-gradient-to-r from-[#FF7043] to-[#FFAB91] bg-clip-text text-transparent">
                Vị trí rạp chiếu
              </span>
            </h2>

            <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-lg border-4 border-white/60 ring-1 ring-white/50">
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
              <p className="text-sm text-stone-500 font-medium bg-white/40 px-6 py-2 rounded-full backdrop-blur-sm border border-stone-200/50">
                Nhấn vào bản đồ để mở Google Maps chỉ đường
              </p>
            </div>
          </div>

          <div>
            <div className="relative w-fit inline-grid grid-cols-2 items-center mb-8 border-b border-stone-200">
              <Link
                href={{ query: { tab: "now" } }}
                scroll={false}
                className={`text-center pb-3 text-lg md:text-xl font-black uppercase tracking-wide transition-colors duration-300 px-6 md:px-8 relative z-10 ${
                  isNowTab
                    ? "text-[#F25019]"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                Phim đang chiếu
              </Link>

              <Link
                href={{ query: { tab: "soon" } }}
                scroll={false}
                className={`text-center pb-3 text-lg md:text-xl font-black uppercase tracking-wide transition-colors duration-300 px-6 md:px-8 relative z-10 ${
                  isSoonTab
                    ? "text-[#F25019]"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                Phim sắp chiếu
              </Link>

              <div
                className={`absolute bottom-0 h-[3px] bg-[#F25019] w-1/2 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isNowTab ? "translate-x-0" : "translate-x-full"
                }`}
              ></div>
            </div>

            <div className="min-h-[400px]">
              {isNowTab && (
                <section className="space-y-6 animate-fadeIn">
                  {nowShowingMovies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/40 rounded-3xl border border-dashed border-stone-200">
                      <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                        <CalendarDays className="w-10 h-10 text-orange-300" />
                      </div>
                      <div className="text-xl font-bold text-stone-600">
                        Hiện tại rạp chưa có lịch chiếu
                      </div>
                      <p className="text-stone-400 text-sm mt-1">
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
                <section className="space-y-6 animate-fadeIn">
                  {comingSoonMovies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/40 rounded-3xl border border-dashed border-stone-200">
                      <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                        <CalendarDays className="w-10 h-10 text-orange-300" />
                      </div>
                      <div className="text-xl font-bold text-stone-600">
                        Chưa có phim sắp chiếu
                      </div>
                      <p className="text-stone-400 text-sm mt-1">
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

      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
}
