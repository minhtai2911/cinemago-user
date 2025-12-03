"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Smartphone,
  CreditCard,
  Users,
  Star,
  MapPin,
  Shield,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Smartphone,
      title: "Đặt vé dễ dàng",
      description:
        "Giao diện thân thiện, đặt vé chỉ với vài cú click trên điện thoại hoặc máy tính",
    },
    {
      icon: CreditCard,
      title: "Thanh toán an toàn",
      description:
        "Hỗ trợ nhiều hình thức thanh toán: thẻ tín dụng, ví điện tử, internet banking",
    },
    {
      icon: Users,
      title: "Chọn ghế tự do",
      description:
        "Xem sơ đồ rạp trực tuyến, tự do lựa chọn vị trí ghế ngồi yêu thích",
    },
    {
      icon: Star,
      title: "Chất lượng cao",
      description:
        "Âm thanh Dolby Atmos, hình ảnh 4K sắc nét, ghế ngồi cao cấp thoải mái",
    },
    {
      icon: MapPin,
      title: "Nhiều rạp chiếu",
      description:
        "Hệ thống rạp chiếu hiện đại trên khắp cả nước, dễ dàng tìm rạp gần nhất",
    },
    {
      icon: Shield,
      title: "Dịch vụ tin cậy",
      description:
        "Cam kết hoàn tiền 100% nếu có sự cố, hỗ trợ khách hàng 24/7",
    },
  ];

  const iconGradient =
    "bg-gradient-to-br from-[#FFB6A3] via-[#FFD6C0] to-[#F25019]";

  const branches = [
    {
      name: "CinemaGo Quốc Thanh",
      address: "Quận 1, TP. Hồ Chí Minh",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070",
    },
    {
      name: "CinemaGo Hai Bà Trưng",
      address: "Quận 3, TP. Hồ Chí Minh",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070",
    },
    {
      name: "CinemaGo Sinh Viên",
      address: "Thủ Đức, TP. Hồ Chí Minh",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070",
    },
    {
      name: "CinemaGo Huế",
      address: "TP. Huế",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070",
    },
    {
      name: "CinemaGo Đà Lạt",
      address: "Đà Lạt, Lâm Đồng",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070",
    },
    {
      name: "CinemaGo Lâm Đồng",
      address: "Đức Trọng, Lâm Đồng",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-[#1f2937]">
      {/* Navbar Sticky */}
      <div className="sticky top-0 z-50 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-orange-100/50">
        <Navbar />
      </div>

      <main>
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/banners/audience.png"
              alt="Cinema Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#FFF9F5]"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6 mt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-200 text-sm font-medium tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#F25019]"></span>
              Since 2025
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
              TRẢI NGHIỆM ĐIỆN ẢNH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F25019] to-[#FFD6C0]">
                KHÔNG GIỚI HẠN
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
              Chào mừng bạn đến với <strong>CinemaGo</strong>. Nơi công nghệ
              đỉnh cao gặp gỡ niềm đam mê điện ảnh, mang đến cho bạn những
              khoảnh khắc sống động nhất.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Text */}
              <div className="space-y-6">
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  Câu chuyện thương hiệu
                </h2>
                <div className="w-24 h-1.5 bg-[#F25019]"></div>{" "}
                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                  CinemaGo ra đời với sứ mệnh "bình dân hóa" trải nghiệm điện
                  ảnh cao cấp. Chúng tôi tin rằng ai cũng xứng đáng được thưởng
                  thức những bộ phim bom tấn với chất lượng âm thanh và hình ảnh
                  tốt nhất mà không phải lo lắng về giá vé.
                </p>
                <div className="grid grid-cols-3 gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#F25019]">
                      Top 1
                    </div>
                    <div className="text-sm text-gray-500 uppercase">
                      Giá vé
                    </div>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <div className="text-3xl font-bold text-[#F25019]">
                      100%
                    </div>
                    <div className="text-sm text-gray-500 uppercase">
                      Hài lòng
                    </div>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <div className="text-3xl font-bold text-[#F25019]">4K</div>
                    <div className="text-sm text-gray-500 uppercase">Laser</div>
                  </div>
                </div>
              </div>

              <div className="relative h-[400px] w-full">
                <img
                  src="/banners/audience.png"
                  className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 w-full object-cover aspect-[4/3]"
                  alt="Cinema Hall"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F25019]/10 -z-10"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#F25019]/10 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-800">
                Tại sao chọn <span className="text-[#F25019]">CinemaGo</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Chúng tôi mang đến trải nghiệm khác biệt từ những điều nhỏ nhất
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-8 transition-all duration-500 transform hover:-translate-y-2 bg-[#FFF9F5] hover:bg-white hover:shadow-2xl border border-transparent hover:border-orange-100"
                  >
                    <div className="relative z-10">
                      {/* Icon */}
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 ${iconGradient} shadow-lg rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#F25019] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>

                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-1 bg-[#F25019] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Hệ thống rạp chiếu
                </h2>
                <div className="w-16 h-1 bg-[#F25019]"></div>
              </div>
              <Link
                href="/"
                className="text-[#F25019] font-bold hover:underline flex items-center gap-1"
              >
                Xem bản đồ chi tiết <MapPin size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-200 mb-4 shadow-sm">
                    <img
                      src={branch.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={branch.name}
                    />
                    <div className="absolute top-4 left-4 bg-[#F25019] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                      Đang mở cửa
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#F25019] transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      {branch.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
