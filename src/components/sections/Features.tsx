"use client";

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
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Tại sao chọn <span className="text-[#F25019]">CinemaGo</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#F25019]/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFF0EC] rounded-xl mb-6 group-hover:bg-[#F25019] transition-colors duration-300">
                  <IconComponent className="w-7 h-7 text-[#F25019] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
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
