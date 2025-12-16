import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Ticket } from "lucide-react"; // Thêm Ticket icon
import { getMovieById, getReviews, getReviewOverview } from "@/services";
import { Review } from "@/types";
import ReviewCard from "@/components/review/ReviewCard";
import Navbar from "@/components/Navbar";
import ReviewModal from "@/components/review/ReviewModal";
import MovieDetail from "@/components/movie/MovieDetail";

export default async function MovieDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const pageSize = 5;

  const movieRes = await getMovieById(id);
  const movie = movieRes.data;
  if (!movie) return notFound();

  const overviewRes = await getReviewOverview(id);
  const overview = overviewRes.data?.getReviewOverview || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
  };

  const avgRating = Number(overview.averageRating || 0).toFixed(1);
  const totalReviews = overview.totalReviews || 0;
  const distribution = overview.ratingDistribution || [0, 0, 0, 0, 0];

  const ratingBars = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: distribution[star - 1] || 0,
  }));

  const maxCount = Math.max(...ratingBars.map((b) => b.count), 1);

  const reviewsRes = await getReviews(currentPage, pageSize, id);
  const reviewsData = reviewsRes.data?.getReviews;
  const reviews: Review[] = reviewsData?.data || [];
  const {
    totalPages = 1,
    hasNextPage = false,
    hasPrevPage = false,
  } = reviewsData?.pagination || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 pt-[120px]">
        <MovieDetail movie={movie} />

        <div className="my-12 text-center">
          <Link
            href={`/booking?movie=${id}`}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
          >
            <Ticket size={32} className="fill-white" />
            Mua vé ngay
          </Link>

          <p className="mt-4 text-gray-400 text-sm">
            Đặt vé nhanh chóng • Ghế VIP • Ưu đãi thành viên
          </p>
        </div>

        <div className="space-y-16">
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-10 text-center">
            <div className="text-8xl font-black text-yellow-400 mb-4">
              {avgRating}
            </div>
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={40}
                  className={
                    i < Math.round(Number(avgRating))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-600"
                  }
                />
              ))}
            </div>
            <p className="text-2xl text-gray-300">
              {totalReviews.toLocaleString("vi-VN")} đánh giá
            </p>

            <div className="max-w-2xl mx-auto mt-10 space-y-4">
              {ratingBars.map(({ star, count }) => {
                const width = totalReviews > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-4">
                    <span className="w-12 text-gray-400">{star} stars</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-12 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000"
                        style={{ width: `${width}%` }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold">
                        {count > 0 && count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            <h2 className="text-4xl font-bold">Đánh giá từ khán giả</h2>
            <ReviewModal movieId={id} movieTitle={movie.title} />
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showResponse={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-900/40 rounded-3xl">
              <p className="text-2xl text-gray-400">Chưa có đánh giá nào</p>
              <p className="text-gray-500 mt-2">Hãy là người đầu tiên!</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              <Link
                href={{ query: { page: currentPage - 1 } }}
                className={`px-4 py-3 rounded-xl flex items-center ${
                  hasPrevPage
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-900 text-gray-600 cursor-not-allowed"
                } transition`}
                prefetch={hasPrevPage}
              >
                <ChevronLeft size={24} />
              </Link>
              <span className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl">
                {currentPage} / {totalPages}
              </span>
              <Link
                href={{ query: { page: currentPage + 1 } }}
                className={`px-4 py-3 rounded-xl flex items-center ${
                  hasNextPage
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-900 text-gray-600 cursor-not-allowed"
                } transition`}
                prefetch={hasNextPage}
              >
                <ChevronRight size={24} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
