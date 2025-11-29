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
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="flex flex-col sm:flex-row items-center gap-10 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-3xl p-10 shadow-2xl">
        <div className="relative group">
          <Image
            src={
              profile.avatarUrl && profile.avatarUrl !== ""
                ? profile.avatarUrl
                : "/default-avatar.jpg"
            }
            alt="Avatar"
            width={180}
            height={180}
            className="rounded-full border-8 border-white shadow-2xl object-cover"
            priority
          />

          {isLoading && (
            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center z-10">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
          )}

          <label
            htmlFor="avatar"
            className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full shadow-2xl cursor-pointer hover:scale-110 transition-all flex items-center justify-center z-20"
          >
            <Camera className="w-7 h-7 text-white" />
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
                  "Cập nhật ảnh đại diện thất bại. Vui lòng thử lại."
                );
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-2xl font-light text-gray-600">Xin chào,</p>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-3">
            {profile.fullname}
          </h1>
          <p className="text-lg text-gray-600 mt-3">{profile.email}</p>
          <span className="inline-block mt-5 px-6 py-3 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
            {profile.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-10 shadow-2xl">
        <h3 className="text-3xl font-bold text-gray-800 mb-10">
          Thông tin cá nhân
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Họ và tên
            </label>
            <input
              type="text"
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
              className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition"
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Giới tính
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-300"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email đăng nhập
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-6 py-5 text-lg bg-gray-100 border-2 border-gray-300 rounded-2xl text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-20 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-7 h-7 animate-spin" />}
            {isLoading ? "Đang lưu..." : "LƯU THÔNG TIN"}
          </button>
        </div>
      </div>
    </form>
  );
}
