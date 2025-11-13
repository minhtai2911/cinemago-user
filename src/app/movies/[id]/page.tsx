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
import { getMovieById, getReviews } from "@/services";
import { Genre, Movie, Review } from "@/types";
import ReviewCard from "@/components/ReviewCard";
import Navbar from "@/components/Navbar";

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

  if (!movie) return notFound();

  const reviewsRes = await getReviews(currentPage, pageSize, id);
  const reviewsData = reviewsRes.data?.getReviews;
  const reviews = reviewsData?.data || [];
  const pagination = reviewsData?.pagination;

  const totalPages = pagination?.totalPages || 1;
  const hasNext = pagination?.hasNextPage || false;
  const hasPrev = pagination?.hasPrevPage || false;
  const totalReviews = pagination?.totalItems || 0;
  const avgRating = movie.rating?.toFixed(1) || "0.0";

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 pt-[120px]">
        {/* Movie Info */}
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
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-3">
                {movie.title}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                {movie.description}
              </p>
            </div>

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
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg">
                ĐẶT VÉ NGAY
              </button>
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-white">
              Đánh giá từ khán giả
            </h2>

            <div className="flex items-center gap-3 bg-gray-900 px-6 py-3 rounded-xl shadow-md">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(Number(avgRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : i < Number(avgRating)
                        ? "fill-yellow-400/30 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-yellow-400">
                {avgRating}
              </span>
              <span className="text-gray-400">/ 5</span>
              <span className="text-sm text-gray-500">
                ({totalReviews} đánh giá)
              </span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review: Review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showResponse={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900 rounded-2xl">
              <p className="text-gray-400 text-xl">Chưa có đánh giá nào.</p>
              <p className="text-sm text-gray-500 mt-2">
                Hãy là người đầu tiên chia sẻ cảm nhận!
              </p>
            </div>
          )}

          {/* Pagination */}
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
  );
}
