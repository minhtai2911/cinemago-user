"use client";

import Image from "next/image";
import {
  Smartphone,
  CreditCard,
  Users,
  Star,
  MapPin,
  Shield,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Smartphone,
      title: "Đặt vé dễ dàng",
      description: "Giao diện tối ưu, đặt vé chỉ với vài thao tác đơn giản.",
    },
    {
      icon: CreditCard,
      title: "Thanh toán đa dạng",
      description: "Tích hợp ví điện tử, thẻ ngân hàng an toàn tuyệt đối.",
    },
    {
      icon: Users,
      title: "Chọn ghế trực quan",
      description: "Sơ đồ rạp 3D, dễ dàng lựa chọn vị trí ngồi yêu thích.",
    },
    {
      icon: Star,
      title: "Trải nghiệm đỉnh cao",
      description: "Màn hình IMAX, âm thanh Dolby Atmos sống động.",
    },
    {
      icon: MapPin,
      title: "Hệ thống rộng khắp",
      description: "Hơn 50 rạp chiếu phim hiện đại phủ sóng toàn quốc.",
    },
    {
      icon: Shield,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ CSKH tận tâm, cam kết hoàn tiền nếu lỗi.",
    },
  ];

  return (
    <section className="pt-24 pb-12 relative bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFF0EC] overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      <Image
        src="/corn.png"
        alt=""
        width={800}
        height={800}
        className="hidden lg:block absolute top-10 -left-20 w-[30%] max-w-[600px] opacity-10 select-none object-contain pointer-events-none animate-float"
        style={{ transform: "rotate(12deg)" }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-gray-900 tracking-tight">
            Tại sao chọn <span className="text-[#F25019]">CinemaGo</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Trải nghiệm điện ảnh tuyệt vời nhất với phong cách trẻ trung và hiện
            đại.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-orange-100/50 hover:border-orange-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(242,80,25,0.1)] transition-all duration-500 hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFF0EC] rounded-2xl mb-6 group-hover:bg-[#F25019] group-hover:rotate-6 transition-all duration-300 shadow-inner">
                  <IconComponent className="w-7 h-7 text-[#F25019] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#F25019] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
