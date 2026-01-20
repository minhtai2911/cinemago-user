"use client";

export default function Features() {
  const features = [
    {
      title: "Đặt vé nhanh chóng",
      description:
        "Giao diện tối ưu hóa trải nghiệm, hoàn tất đặt vé chỉ trong 30 giây.",
    },
    {
      title: "Thanh toán an toàn",
      description:
        "Tích hợp đa dạng cổng thanh toán, bảo mật thông tin tuyệt đối.",
    },
    {
      title: "Chọn ghế trực quan",
      description:
        "Sơ đồ rạp hiển thị rõ ràng, dễ dàng chọn được vị trí ưng ý nhất.",
    },
    {
      title: "Công nghệ đỉnh cao",
      description:
        "Hệ thống màn hình IMAX & âm thanh Dolby Atmos chuẩn quốc tế.",
    },
    {
      title: "Ưu đãi thành viên",
      description: "Tích điểm đổi quà và hàng ngàn voucher giảm giá mỗi tuần.",
    },
    {
      title: "Hỗ trợ tận tâm",
      description:
        "Đội ngũ chăm sóc khách hàng 24/7, cam kết hoàn tiền nếu có lỗi.",
    },
  ];

  return (
    <section className="py-24 relative bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="w-16 h-1.5 bg-[#F25019] mx-auto mb-8 rounded-full"></div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Tại sao chọn <span className="text-[#F25019]">CinemaGo</span>?
          </h2>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            Nâng tầm trải nghiệm điện ảnh với dịch vụ chất lượng hàng đầu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const itemNumber = `0${index + 1}`;

            return (
              <div
                key={index}
                className="group relative bg-white h-full p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(242,80,25,0.06)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-1/2 -translate-y-1/2 right-0 text-[120px] leading-none font-black text-[#FFF6E5] select-none z-0 pointer-events-none transform translate-x-1/4 group-hover:translate-x-0 transition-transform duration-500">
                  {itemNumber}
                </div>

                <div className="relative z-10 flex flex-col justify-center h-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#F25019] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
