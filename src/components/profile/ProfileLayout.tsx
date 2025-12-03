"use client";

import { User, History, LogOut } from "lucide-react";
import Link from "next/link";
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

  return (
    <div className="relative min-h-screen bg-peach-gradient flex items-start justify-center py-3 px-4 sm:px-6 lg:px-8">
      {/* subtle white overlay to make the peach gradient lighter */}
      <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>

      <div className="relative max-w-7xl w-full px-6 py-10">
        <img
          src="/corn.png"
          alt=""
          aria-hidden
          className="hidden lg:block pointer-events-none select-none absolute top-6 w-[70%] opacity-20"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/30 min-w-[220px] lg:h-[192px]">
                <div className="p-4 text-[#374151] h-full flex items-center">
                  <nav className="flex flex-col justify-center gap-2 w-full">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-4 text-sm px-5 py-3 rounded-2xl transition-all whitespace-nowrap ${
                            isActive
                              ? "bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white shadow-md font-semibold"
                              : "hover:bg-[#fff4ee] hover:text-[#E94B22]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 text-sm px-5 py-3 rounded-2xl hover:bg-[#fff4ee] transition-all text-left border border-[#F25019] text-[#F25019] bg-white font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Đăng xuất</span>
                    </button>
                  </nav>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3">
              <div className="p-0">{children}</div>
            </main>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center absolute right-6 top-10"></div>
      </div>
    </div>
  );
}
