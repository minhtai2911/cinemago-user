"use client";

import { User, History, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Image
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

const menuItems = [
  { href: "/profile", label: "Thông tin khách hàng", icon: User },
  { href: "/profile/history", label: "Lịch sử mua hàng", icon: History },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setAccessToken, setIsLogged, setProfile } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setAccessToken(null);
      setIsLogged(false);
      setProfile(null);
      localStorage.removeItem("accessToken");
      router.push("/");
      toast.success("Đăng xuất thành công!");
    } catch {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  // --- Background Component ---
  const AmbientBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FFF9F6]">
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-orange-200/10 to-rose-200/10 blur-[120px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-rose-100/20 to-orange-100/10 blur-[120px]"></div>
      <div className="absolute top-[40%] -left-[0%] w-[600px] h-[600px] opacity-[0.15] z-0 rotate-56">
        <Image
          src="/corn.webp"
          alt="Popcorn Background - Cinemago"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen font-sans text-gray-800 flex flex-col">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* --- SIDEBAR MENU --- */}
          <aside className="lg:col-span-3 sticky top-24">
            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-4 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-4 text-sm font-bold px-6 py-4 rounded-2xl transition-all duration-500 ease-out ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 translate-x-2"
                          : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                      />
                      <span className="tracking-wide">{item.label}</span>
                    </Link>
                  );
                })}

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 text-sm font-bold px-6 py-4 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
