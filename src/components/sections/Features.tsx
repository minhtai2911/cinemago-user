"use client";

import {
  Smartphone,
  CreditCard,
  Users,
  Star,
  MapPin,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function Features() {
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

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-800">
            Tại sao chọn{" "}
            <span className="text-[#F25019] font-extrabold">CinemaGo</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
            Chúng tôi mang đến trải nghiệm điện ảnh tuyệt vời nhất với công nghệ
            hiện đại và dịch vụ chất lượng cao
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 bg-white shadow-lg hover:shadow-2xl border border-orange-100/50"
              >
                <div className="relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${iconGradient} shadow-lg rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
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

        <div className="mt-24 text-center">
          <div className="relative w-full bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFE5D0] to-[#fff0e6] opacity-50"></div>
            <div className="relative z-10 p-12 md:p-16">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
                Sẵn sàng trải nghiệm điện ảnh đẳng cấp?
              </h3>
              <p className="text-xl mb-8 text-gray-600">
                Tham gia cộng đồng hơn 1 triệu người yêu phim tại Việt Nam
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* 1. Nút Đăng ký -> /register */}
                <Link href="/register">
                  <button className="bg-[#F25019] text-white px-8 py-4 rounded-full font-bold hover:bg-[#d13a0b] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/30">
                    Đăng ký thành viên
                  </button>
                </Link>

                {/* 2. Nút Tìm hiểu thêm -> /about */}
                <Link href="/about">
                  <button className="bg-white border-2 border-[#F25019] text-[#F25019] px-8 py-4 rounded-full font-bold hover:bg-orange-50 transition-all duration-300">
                    Tìm hiểu thêm
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics - Giữ nguyên */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "1M+", label: "Khách hàng tin tưởng" },
            { num: "50+", label: "Rạp chiếu toàn quốc" },
            { num: "500+", label: "Phim đã chiếu" },
            { num: "4.8/5", label: "Đánh giá khách hàng" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100/50 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-extrabold text-[#F25019] mb-2">
                {stat.num}
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
