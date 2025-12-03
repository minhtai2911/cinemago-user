import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/sections/HeroSection";
import QuickBooking from "../components/sections/QuickBooking";
import NowShowing from "../components/sections/NowShowing";
import ComingSoon from "../components/sections/ComingSoon";
import Features from "../components/sections/Features";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-peach-gradient bg-[#FFF3EA]">
      {/* Logo & background chỉ ở đầu trang */}
      <Navbar />
      <main className="relative overflow-visible">
        <HeroSection />
        <QuickBooking />
        <NowShowing />
        <ComingSoon />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
