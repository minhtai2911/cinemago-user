import { Smartphone, CreditCard, Users, Star, MapPin, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Smartphone,
      title: "Đặt vé dễ dàng",
      description: "Giao diện thân thiện, đặt vé chỉ với vài cú click trên điện thoại hoặc máy tính",
      color: "bg-blue-500",
    },
    {
      icon: CreditCard,
      title: "Thanh toán an toàn", 
      description: "Hỗ trợ nhiều hình thức thanh toán: thẻ tín dụng, ví điện tử, internet banking",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "Chọn ghế tự do",
      description: "Xem sơ đồ rạp trực tuyến, tự do lựa chọn vị trí ghế ngồi yêu thích",
      color: "bg-purple-500",
    },
    {
      icon: Star,
      title: "Chất lượng cao",
      description: "Âm thanh Dolby Atmos, hình ảnh 4K sắc nét, ghế ngồi cao cấp thoải mái",
      color: "bg-yellow-500",
    },
    {
      icon: MapPin,
      title: "Nhiều rạp chiếu",
      description: "Hệ thống rạp chiếu hiện đại trên khắp cả nước, dễ dàng tìm rạp gần nhất",
      color: "bg-red-500",
    },
    {
      icon: Shield,
      title: "Dịch vụ tin cậy",
      description: "Cam kết hoàn tiền 100% nếu có sự cố, hỗ trợ khách hàng 24/7",
      color: "bg-indigo-500",
    },
  ];

  const iconGradient = "bg-gradient-to-br from-[#FFB6A3] via-[#FFD6C0] to-[#F25019]";

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-800">
            Tại sao chọn <span className="text-[#F25019] font-extrabold">CinemaGo</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
            Chúng tôi mang đến trải nghiệm điện ảnh tuyệt vời nhất với công nghệ hiện đại và dịch vụ chất lượng cao
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group relative p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${iconGradient} shadow-lg rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-red-500 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-1 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative w-full bg-gradient-to-r from-[#FFE5D0] to-[#FFD6C0] p-12 text-[#F25019]">
            <div className="relative z-10 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Sẵn sàng trải nghiệm điện ảnh đẳng cấp?
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Tham gia cộng đồng hơn 1 triệu người yêu phim tại Việt Nam
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-[#F25019] px-8 py-4 rounded-full font-bold hover:bg-[#FFE5D0] transition-all duration-300 transform hover:scale-105">
                  Đăng ký thành viên
                </button>
                <button className="border-2 border-[#F25019] text-[#F25019] px-8 py-4 rounded-full font-bold hover:bg-[#FFE5D0] hover:text-[#F25019] transition-all duration-300">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="relative text-center p-6 rounded-2xl">
            <div className="relative z-10">
              <div className="text-4xl font-bold text-red-500 mb-2">1M+</div>
              <p className="text-gray-600">Khách hàng tin tưởng</p>
            </div>
          </div>
          <div className="relative text-center p-6 rounded-2xl">
            <div className="relative z-10">
              <div className="text-4xl font-bold text-red-500 mb-2">50+</div>
              <p className="text-gray-600">Rạp chiếu toàn quốc</p>
            </div>
          </div>
          <div className="relative text-center p-6 rounded-2xl">
            <div className="relative z-10">
              <div className="text-4xl font-bold text-red-500 mb-2">500+</div>
              <p className="text-gray-600">Phim đã chiếu</p>
            </div>
          </div>
          <div className="relative text-center p-6 rounded-2xl">
            <div className="relative z-10">
              <div className="text-4xl font-bold text-red-500 mb-2">4.8/5</div>
              <p className="text-gray-600">Đánh giá khách hàng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
