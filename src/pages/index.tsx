import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-red-500 mb-4">Welcome to CinemaGo!</h1>
        <p className="mb-8 text-lg text-gray-300">
          Đây là trang chủ. Navbar và Footer đã được thêm thành công 🎉
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold text-red-400 mb-2">CinemaGo</h2>
            <p className="mb-2 text-gray-300">Be happy, be a star <span className="text-yellow-400">⭐</span></p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-red-400 underline">Facebook</a>
              <a href="#" className="hover:text-red-400 underline">YouTube</a>
              <a href="#" className="hover:text-red-400 underline">TikTok</a>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-red-400 mb-2">Tài khoản</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-red-400 underline">Đăng nhập</a></li>
              <li><a href="#" className="hover:text-red-400 underline">Đăng ký</a></li>
              <li><a href="#" className="hover:text-red-400 underline">Membership</a></li>
            </ul>
            <h2 className="text-xl font-semibold text-red-400 mt-6 mb-2">Xem phim</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-red-400 underline">Phim đang chiếu</a></li>
              <li><a href="#" className="hover:text-red-400 underline">Phim sắp chiếu</a></li>
              <li><a href="#" className="hover:text-red-400 underline">Suất chiếu đặc biệt</a></li>
            </ul>
            <h2 className="text-xl font-semibold text-red-400 mt-6 mb-2">Liên hệ</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-red-400 underline">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-red-400 underline">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-red-400 underline">Hỗ trợ</a></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;