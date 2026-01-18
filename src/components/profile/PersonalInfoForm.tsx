"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { updateProfile } from "@/services";

export default function PersonalInfoSection() {
  const { profile, setProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: profile?.fullname || "",
    gender: profile?.gender || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("fullname", formData.fullname.trim());
    submitData.append("gender", formData.gender);

    const avatarInput = document.getElementById("avatar") as HTMLInputElement;
    const file = avatarInput?.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh đại diện không được quá 5MB");
        setIsLoading(false);
        return;
      }
      submitData.append("avatar", file);
    }

    try {
      const res = await updateProfile(submitData);

      const updatedUser = res.data?.data || res.data;

      toast.success("Cập nhật thông tin thành công!");
      setProfile(updatedUser);

      if (avatarInput) avatarInput.value = "";
    } catch {
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/90 p-6 rounded-2xl border border-white/30 shadow-xl soft-shadow">
        <div className="relative group">
          <Image
            src={
              profile.avatarUrl && profile.avatarUrl !== ""
                ? profile.avatarUrl
                : "/default-avatar.png"
            }
            alt="Avatar"
            width={140}
            height={140}
            className="rounded-full border-4 border-white shadow-2xl object-cover"
            priority
          />

          {isLoading && (
            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center z-10">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
          )}

          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-0 bg-gradient-to-r from-[#F25019] to-[#E9391B] p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all flex items-center justify-center z-20"
          >
            <Camera className="w-4 h-4 text-white" />
          </label>

          <input
            type="file"
            id="avatar"
            accept="image/*"
            className="absolute opacity-0 w-0 h-0"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              if (file.size > 5 * 1024 * 1024) {
                toast.error("Ảnh đại diện không được quá 5MB");
                e.target.value = "";
                return;
              }

              setIsLoading(true);

              const formData = new FormData();
              formData.append("avatar", file);
              formData.append("fullname", profile.fullname);
              formData.append("gender", profile.gender || "male");

              try {
                const res = await updateProfile(formData);
                const updatedUser = res.data?.data || res.data;

                setProfile(updatedUser);
                setFormData({
                  fullname: updatedUser.fullname,
                  gender: updatedUser.gender,
                });

                toast.success("Đã cập nhật ảnh đại diện!");
                e.target.value = "";
              } catch {
                toast.error(
                  "Cập nhật ảnh đại diện thất bại. Vui lòng thử lại.",
                );
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-base font-medium text-[#374151]">Xin chào,</p>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#F25019] to-[#E9391B] bg-clip-text text-transparent mt-2">
            {profile.fullname}
          </h1>
          <p className="text-sm text-gray-600 mt-2">{profile.email}</p>
          <span className="inline-block mt-3 px-3 py-1 bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white rounded-full text-xs font-semibold shadow-sm">
            {profile.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
          </span>
        </div>
      </div>

      <div className="bg-white/70 rounded-2xl p-6 shadow-xl border border-white/30">
        <h2 className="text-xl font-black uppercase tracking-tight mb-2 relative z-10">
          <span className="text-gray-900">THÔNG TIN </span>
          <span className="bg-gradient-to-r from-[#FF7043] to-[#FFAB91] bg-clip-text text-transparent">
            CÁ NHÂN
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-3 group-focus-within/input:text-[#F25019] transition-colors">
              Họ và tên
            </label>
            <input
              type="text"
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
              className="w-full px-5 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-800 font-bold focus:outline-none focus:bg-white focus:border-orange-300 focus:shadow-sm transition-all placeholder:text-gray-300 text-sm"
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-3 group-focus-within/input:text-[#F25019] transition-colors">
              Giới tính
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-5 pr-10 py-3 appearance-none bg-white/50 border border-gray-200 rounded-xl text-gray-800 font-bold focus:outline-none focus:bg-white focus:border-orange-300 focus:shadow-sm transition-all placeholder:text-gray-300 text-sm"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-3 group-focus-within/input:text-[#F25019] transition-colors">
              Email đăng nhập
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-5 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-bold cursor-not-allowed text-sm"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gradient-to-r hover:from-[#F25019] hover:to-red-500 text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-gray-200 hover:shadow-orange-500/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "ĐANG LƯU..." : "LƯU THÔNG TIN"}
          </button>
        </div>
      </div>
    </form>
  );
}
