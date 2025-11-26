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
          className="group flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-2xl"
        >
          <Pencil
            size={24}
            className="group-hover:rotate-12 transition-transform"
          />
          Viết đánh giá của bạn
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={28} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">
              Đánh giá phim
            </h2>
            <p className="text-yellow-400 text-lg mb-8">{movieTitle}</p>

            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                >
                  <Star
                    size={56}
                    className={`transition-all ${
                      star <= (hovered || rating)
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn..."
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-gray-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !rating}
                className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 text-black font-bold px-8 py-3 rounded-xl transition-all transform hover:scale-105 disabled:scale-100"
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
