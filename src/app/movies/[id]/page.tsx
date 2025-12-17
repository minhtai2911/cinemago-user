import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Ticket,
  MessageSquare,
} from "lucide-react";
import { getMovieById, getReviews, getReviewOverview } from "@/services";
import { Review } from "@/types";
import ReviewCard from "@/components/review/ReviewCard";
import Navbar from "@/components/Navbar";
import ReviewModal from "@/components/review/ReviewModal";
import MovieDetail from "@/components/movie/MovieDetail";
import Footer from "@/components/Footer";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="relative min-h-screen bg-peach-gradient flex flex-col font-sans">
      <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>
      <div className="fixed top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none z-0">
        <Image
          src="/corn.png"
          alt=""
          width={1000}
          height={1000}
          className="hidden lg:block absolute top-32 -right-10 w-[45%] max-w-[800px] opacity-20 select-none"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />
      </div>

      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/30">
        <Navbar />
      </div>

      <main className="relative z-10 flex-grow pt-10 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-white/30 p-6 md:p-8">
            <MovieDetail movie={movie} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-white/30 p-6 sticky top-28">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                  Tổng quan
                </h3>

                <div className="text-center mb-8">
                  <div className="text-7xl font-black text-gray-900 tracking-tighter">
                    {avgRating}
                  </div>
                  <div className="flex justify-center gap-1 my-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.round(Number(avgRating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200 fill-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 font-medium text-sm">
                    {totalReviews.toLocaleString("vi-VN")} lượt đánh giá
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {ratingBars.map(({ star, count }) => {
                    const width =
                      totalReviews > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="w-3 font-bold text-gray-400">
                          {star}
                        </span>
                        <Star className="w-4 h-4 text-gray-300" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-gray-400 text-xs">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href={`/booking?movie=${id}`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/30 hover:-translate-y-0.5 uppercase tracking-wide"
                >
                  <Ticket size={22} />
                  Mua vé ngay
                </Link>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Đặt vé nhanh chóng, tiện lợi
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-xl border border-white/30 p-6 md:p-8 min-h-[500px]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
                    Bình luận mới nhất
                  </h2>
                  <ReviewModal movieId={id} movieTitle={movie.title} />
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="transition-transform hover:translate-x-1 duration-200"
                      >
                        <ReviewCard review={review} showResponse={true} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-orange-50/50 rounded-2xl border border-dashed border-orange-200">
                    <div className="bg-white p-4 rounded-full mb-3 shadow-sm">
                      <MessageSquare className="w-8 h-8 text-orange-400" />
                    </div>
                    <p className="text-lg font-bold text-gray-600">
                      Chưa có đánh giá nào
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Hãy là người đầu tiên review phim này!
                    </p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-10 pt-6 border-t border-gray-100">
                    <Link
                      href={{ query: { page: currentPage - 1 } }}
                      className={`p-3 rounded-xl border transition-colors ${
                        hasPrevPage
                          ? "bg-white hover:bg-orange-50 text-gray-700 border-gray-200 shadow-sm"
                          : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                      }`}
                      prefetch={hasPrevPage}
                    >
                      <ChevronLeft size={20} />
                    </Link>
                    <span className="px-5 py-2 bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white rounded-xl font-bold shadow-md shadow-orange-500/20">
                      {currentPage} / {totalPages}
                    </span>
                    <Link
                      href={{ query: { page: currentPage + 1 } }}
                      className={`p-3 rounded-xl border transition-colors ${
                        hasNextPage
                          ? "bg-white hover:bg-orange-50 text-gray-700 border-gray-200 shadow-sm"
                          : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                      }`}
                      prefetch={hasNextPage}
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
