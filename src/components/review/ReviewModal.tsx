"use client";

import { useState } from "react";
import { Star, X, Pencil } from "lucide-react";
import { createReview } from "@/services";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

interface Props {
  movieId: string;
  movieTitle: string;
}

export default function ReviewModal({ movieId, movieTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { isLogged } = useAuth();

  const handleSubmit = async () => {
    if (!rating || content.trim().length < 10) {
      toast.error("Vui lòng cung cấp đánh giá hợp lệ (ít nhất 10 ký tự)!");
      return;
    }

    setLoading(true);
    try {
      await createReview(movieId, content.trim(), rating);
      toast.success("Cảm ơn bạn đã đánh giá!");
      setOpen(false);
      setRating(0);
      setContent("");
      router.refresh();
    } catch (error) {
      if (Array.isArray(error) && error[0]?.message) {
        toast.error(error[0].message);
      } else {
        toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!isLogged) {
      toast.error("Vui lòng đăng nhập để đánh giá!");
      router.push(`/login?callbackUrl=/movie/${movieId}`);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          className="group flex items-center gap-3 bg-[#FFF0EB] hover:bg-[#F25019] text-[#F25019] hover:text-white border border-[#F25019]/30 font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-sm hover:shadow-orange-500/20"
        >
          <Pencil
            size={22}
            className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"
          />
          <span>Viết đánh giá</span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#F25019] transition-colors"
            >
              <X size={28} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Đánh giá phim
            </h2>
            <p className="text-[#F25019] text-lg mb-8 font-medium">
              {movieTitle}
            </p>

            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={56}
                    className={`transition-all ${
                      star <= (hovered || rating)
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                        : "text-gray-200 fill-gray-50"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn (Tối thiểu 10 ký tự)..."
              rows={6}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F25019] focus:ring-1 focus:ring-[#F25019] transition-all"
            />

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !rating}
                className="bg-[#F25019] hover:bg-[#d64215] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold px-8 py-3 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg shadow-orange-500/20"
              >
                {loading ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
