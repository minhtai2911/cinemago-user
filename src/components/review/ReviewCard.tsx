"use client";

import { Star, MessageCircle, Reply, Loader2, LogIn } from "lucide-react";
import { Review, ReviewResponse } from "@/types/review";
import { useState } from "react";
import { replyToReview } from "@/services";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

interface ReviewCardProps {
  review: Review;
  showResponse?: boolean;
}

export default function ReviewCard({
  review,
  showResponse = true,
}: ReviewCardProps) {
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<ReviewResponse[]>(
    review.response || []
  );

  const router = useRouter();
  const { isLogged, profile } = useAuth();

  const handleSendReply = async () => {
    const content = reply.trim();
    if (!content || isLoading || !isLogged) {
      return;
    }

    setIsLoading(true);

    const tempResponse: ReviewResponse = {
      content,
      createdAt: new Date().toISOString(),
      userId: profile!.id,
      userDetail: {
        fullname: profile?.fullname || "Bạn",
        avatarUrl: profile?.avatarUrl || "",
      },
    };

    setResponses((prev) => [...prev, tempResponse]);
    setReply("");
    setIsReplying(false);

    try {
      await replyToReview(review.id, content);
      router.refresh();
      toast.success("Phản hồi đã được gửi!");
    } catch {
      setResponses((prev) =>
        prev.filter((r) => r.createdAt !== tempResponse.createdAt)
      );
      toast.error("Gửi phản hồi thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(Number(dateStr)).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Vừa xong";
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-500/40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
            {review.userDetail?.avatarUrl ? (
              <Image
                src={review.userDetail.avatarUrl}
                alt={review.userDetail.fullname || "User"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.jpg";
                }}
              />
            ) : (
              <>
                <Image
                  src="/default-avatar.jpg"
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </>
            )}
          </div>

          <div>
            <p className="font-bold text-white text-lg">
              {review.userDetail?.fullname || "Khán giả ẩn danh"}
            </p>
            <p className="text-xs text-gray-500">
              {review.createdAt ? formatDate(review.createdAt) : "Vừa xong"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={`${
                i < Math.floor(review.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : i < review.rating
                  ? "fill-yellow-400/40 text-yellow-400"
                  : "text-gray-700"
              }`}
            />
          ))}
          <span className="ml-2 font-bold text-yellow-400">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <p className="text-gray-200 text-lg leading-relaxed mb-4">
        {review.content}
      </p>

      {showResponse && (
        <>
          {isLogged ? (
            <button
              onClick={() => setIsReplying(!isReplying)}
              disabled={isLoading}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium mb-4 transition-colors disabled:opacity-50"
            >
              <Reply size={16} />
              {isReplying ? "Hủy" : "Trả lời"}
            </button>
          ) : (
            <Link href="/login">
              <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium mb-4 transition-colors">
                <LogIn size={16} />
                Đăng nhập để trả lời
              </button>
            </Link>
          )}
        </>
      )}

      {isReplying && isLogged && (
        <div className="mb-4 flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isLoading && handleSendReply()
            }
            placeholder="Viết phản hồi của bạn..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendReply}
            disabled={isLoading || !reply.trim()}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 text-black font-bold px-5 py-2 rounded-lg transition-transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Gửi"
            )}
          </button>
        </div>
      )}

      {showResponse && responses.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-700">
          {responses.map((res) => (
            <div
              key={res.createdAt}
              className="flex gap-3 text-sm bg-gray-800/70 p-4 rounded-xl"
            >
              <MessageCircle
                size={18}
                className="text-yellow-400 mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="font-medium text-yellow-300">
                  {isLogged && profile?.id === res.userId
                    ? "Bạn"
                    : res.userDetail?.fullname || "Rạp phim"}
                </p>
                <p className="text-gray-300 mt-1">{res.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(res.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
