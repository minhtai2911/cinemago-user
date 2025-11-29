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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
          THÔNG TIN CÁ NHÂN
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 text-white">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-4 px-5 py-4 rounded-lg transition-all ${
                          isActive
                            ? "bg-white/25 font-bold border-l-4 border-yellow-300"
                            : "hover:bg-white/15"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-lg hover:bg-white/15 transition-all text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Đăng xuất</span>
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
