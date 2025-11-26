import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Calendar,
  Clock,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getMovieById, getReviews, getReviewOverview } from "@/services";
import { Genre, Movie, Review } from "@/types";
import ReviewCard from "@/components/ReviewCard";
import Navbar from "@/components/Navbar";
import ReviewModal from "@/components/ReviewModal";

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
  const movie: Movie | null = movieRes.data || null;
  if (!movie) {
    return notFound();
  }

  const overviewRes = await getReviewOverview(id);
  const overview = overviewRes.data?.getReviewOverview || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
  };

  const avgRating = overview.averageRating
    ? Number(overview.averageRating).toFixed(1)
    : "0.0";
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
  const pagination = reviewsData?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const hasNext = pagination.hasNextPage || false;
  const hasPrev = pagination.hasPrevPage || false;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 pt-[120px]">
        <div className="grid md:grid-cols-3 gap-10 mb-16">
          <div className="md:col-span-1">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={movie.thumbnail}
                alt={movie.title}
                width={400}
                height={600}
                className="w-full h-auto object-cover rounded-2xl transition-transform hover:scale-105 duration-300"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">
              {movie.title}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>{movie.duration} phút</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-yellow-400" />
                <span>{movie.genres.map((g: Genre) => g.name).join(", ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <span>
                  {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            <Link href={`/booking?movie=${movie.id}`}>
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl">
                ĐẶT VÉ NGAY
              </button>
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 md:p-12">
            <div className="text-center mt-10 mb-10">
              <div className="text-7xl font-bold text-yellow-400 mb-3">
                {avgRating}
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={36}
                    className={`${
                      i < Math.round(Number(avgRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xl text-gray-300">
                {totalReviews.toLocaleString("vi-VN")} người đã đánh giá
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {ratingBars.map(({ star, count }) => {
                const barWidth =
                  totalReviews > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-4">
                    <div className="w-10 text-right text-gray-400 font-medium">
                      {star} stars
                    </div>
                    <div className="flex-1 bg-gray-800 rounded-full h-10 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-1000 ease-out"
                        style={{ width: `${barWidth}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-end pr-4 text-sm font-bold text-black">
                        {count > 0 && count.toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <h2 className="text-3xl font-bold text-white text-center sm:text-left">
              Đánh giá từ khán giả
            </h2>

            <div className="flex justify-center sm:justify-end">
              <ReviewModal movieId={id} movieTitle={movie.title} />
            </div>
          </div>

          <div>
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
              <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
                <p className="text-gray-400 text-xl mb-3">
                  Chưa có đánh giá nào
                </p>
                <p className="text-gray-500">
                  Hãy là người đầu tiên chia sẻ cảm nhận!
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <Link
                  href={{ query: { page: currentPage - 1 } }}
                  className={`p-2 rounded-lg transition-all ${
                    hasPrev
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-900 text-gray-600 cursor-not-allowed"
                  }`}
                  aria-disabled={!hasPrev}
                >
                  <ChevronLeft size={20} />
                </Link>

                <span className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg">
                  Trang {currentPage} / {totalPages}
                </span>

                <Link
                  href={{ query: { page: currentPage + 1 } }}
                  className={`p-2 rounded-lg transition-all ${
                    hasNext
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-900 text-gray-600 cursor-not-allowed"
                  }`}
                  aria-disabled={!hasNext}
                >
                  <ChevronRight size={20} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
