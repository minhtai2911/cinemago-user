import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCinemas } from "@/services/cinemaService";

interface Cinema {
  id: number;
  name: string;
  address: string;
}

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#E65100]"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#E65100]"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.12 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#E65100]"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default async function AboutPage() {
  let totalCinemas = 0;
  let cinemaList: Cinema[] = [];

  try {
    const cinemaRes = await getCinemas(1, 100, "", true);

    if (cinemaRes?.total) {
      totalCinemas = cinemaRes.total;
      cinemaList = cinemaRes.data || [];
    } else if (Array.isArray(cinemaRes?.data)) {
      totalCinemas = cinemaRes.data.length;
      cinemaList = cinemaRes.data;
    } else if (Array.isArray(cinemaRes)) {
      totalCinemas = cinemaRes.length;
      cinemaList = cinemaRes;
    } else {
      totalCinemas = 15;
    }
  } catch (error) {
    console.error("Lỗi lấy data rạp:", error);
    totalCinemas = 15;
  }

  const missions = [
    {
      id: "01",
      title: "Thị phần & vị thế",
      desc: "Mở rộng hệ thống rạp toàn quốc, khẳng định thương hiệu Việt.",
    },
    {
      id: "02",
      title: "Trải nghiệm 5 sao",
      desc: "Công nghệ hiện đại, dịch vụ tận tâm với mức giá hợp lý.",
    },
    {
      id: "03",
      title: "Kết nối văn hóa",
      desc: "Mang tinh hoa điện ảnh thế giới về Việt Nam.",
    },
  ];

  return (
    <div className="min-h-screen font-sans text-stone-800 flex flex-col bg-[#FFF8F5]">
      <Navbar />

      <main className="flex-grow">
        <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-orange-100 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40rem] h-[40rem] bg-red-50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 animate-fade-in-up">
              <span className="inline-block py-2 px-4 rounded-full bg-orange-50 border border-orange-100 text-[#E65100] text-xs font-bold tracking-widest uppercase">
                Về chúng tôi
              </span>

              <h1 className="text-5xl lg:text-7xl font-black text-stone-800 leading-[1.15] tracking-tight">
                Vị ngọt của <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] to-[#FFAB91]">
                  Điện ảnh
                </span>
              </h1>

              <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
                Không gian giải trí phức hợp, nơi cảm xúc thăng hoa cùng những
                bộ phim bom tấn và hương vị bắp nước giòn tan.
              </p>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-4xl font-black text-stone-800">
                    {totalCinemas}+
                  </div>
                  <div className="text-stone-500 text-sm font-semibold uppercase mt-1 tracking-wider">
                    Cụm rạp
                  </div>
                </div>
                <div className="w-px h-12 bg-stone-200"></div>
                <div>
                  <div className="text-4xl font-black text-stone-800">100%</div>
                  <div className="text-stone-500 text-sm font-semibold uppercase mt-1 tracking-wider">
                    Hài lòng
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center">
              <div className="absolute w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] bg-gradient-to-b from-[#FFF3E0] to-white rounded-full shadow-2xl shadow-orange-100/50"></div>
              <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-700 animate-float">
                <Image
                  src="/popcorn.webp"
                  alt="Delicious Popcorn"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24 bg-gradient-to-b from-[#FFF8F5] via-white to-[#FFF8F5] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(#E65100 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          <div className="absolute top-0 right-0 w-64 h-64 opacity-90 hidden lg:block animate-bounce-slow pointer-events-none z-0">
            <Image
              src="/popcorn.webp"
              width={300}
              height={300}
              alt="Popcorn"
              className="rotate-12 drop-shadow-2xl opacity-60"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-black text-stone-800 uppercase tracking-tighter">
                Sứ mệnh <span className="text-[#FF6D00]">Tiên phong</span>
              </h2>
              <div className="w-24 h-1.5 bg-[#FF6D00] mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {missions.map((item, idx) => (
                <div key={idx} className="group relative h-full">
                  <div className="relative h-full bg-white/80 backdrop-blur-lg border border-orange-50 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(230,81,0,0.04)] hover:shadow-[0_20px_40px_rgba(255,109,0,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-9xl font-black text-orange-50 group-hover:text-orange-100 transition-colors -z-10 rotate-12">
                      {item.id}
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-stone-800 mb-4 group-hover:text-[#E65100] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-stone-600 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#FF6D00] group-hover:w-full transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#FFF8F5]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[#E65100] font-bold tracking-widest text-sm uppercase">
                  Our Locations
                </span>
                <h2 className="text-3xl lg:text-4xl font-black text-stone-800 mt-2">
                  MẠNG LƯỚI RẠP
                </h2>
              </div>
              <div className="hidden md:block w-full md:w-auto h-px bg-orange-200 flex-grow mx-8 self-center"></div>
              <div className="text-stone-500 font-medium">
                Hiện có{" "}
                <span className="text-[#E65100] font-bold">{totalCinemas}</span>{" "}
                chi nhánh đang hoạt động
              </div>
            </div>

            {cinemaList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cinemaList.map((cinema, index) => (
                  <div
                    key={cinema.id || index}
                    className="group bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#E65100]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0" />
                          <circle cx="12" cy="8" r="3" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
                        Rạp {index + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-stone-800 mb-2 group-hover:text-[#E65100] transition-colors line-clamp-1">
                      {cinema.name}
                    </h3>
                    <p className="text-stone-500 text-sm line-clamp-2 min-h-[40px]">
                      {cinema.address}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-stone-300">
                <p className="text-stone-500">Đang cập nhật danh sách rạp...</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-stone-200/50 overflow-hidden border border-stone-100">
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
                  <Image
                    src="/cinestar-hall.jpg"
                    alt="Headquarters"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
                </div>

                <div className="lg:col-span-7 p-10 lg:p-16 flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                  <div className="mb-10">
                    <h2 className="text-3xl lg:text-4xl font-black text-stone-800 mb-2">
                      TRỤ SỞ CHÍNH
                    </h2>
                    <p className="text-stone-400 font-medium text-sm tracking-widest uppercase">
                      Headquarters & Office
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                    <div className="flex gap-4">
                      <div className="shrink-0 p-3 bg-orange-50 rounded-2xl h-fit">
                        <MapPinIcon />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800 mb-1">
                          Địa chỉ
                        </h4>
                        <p className="text-stone-500 text-sm leading-relaxed">
                          12 Hai Bà Trưng, P. Bến Nghé,
                          <br /> Quận 1, TP.HCM
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="shrink-0 p-3 bg-orange-50 rounded-2xl h-fit">
                        <MailIcon />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800 mb-1">
                          Email hỗ trợ
                        </h4>
                        <p className="text-stone-500 text-sm">
                          info@cinemago.vn
                        </p>
                        <p className="text-stone-500 text-sm">
                          recruitment@cinemago.vn
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 sm:col-span-2">
                      <div className="shrink-0 p-3 bg-orange-50 rounded-2xl h-fit">
                        <PhoneIcon />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800 mb-1">
                          Hotline CSKH
                        </h4>
                        <p className="text-[#E65100] text-2xl font-black tracking-tight">
                          1900 1234
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-stone-100">
                    <Link
                      href="/"
                      className="group inline-flex items-center gap-2 text-stone-800 font-bold hover:text-[#E65100] transition-colors"
                    >
                      Đặt vé ngay hôm nay
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
