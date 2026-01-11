"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Popcorn,
  Loader2,
  AlertCircle,
  X,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Armchair,
  Info,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

import {
  getBookingsByUserId,
  getShowtimeById,
  getMovieById,
  getCinemaById,
  getRoomById,
  getFoodDrinkById,
} from "@/services";

import type {
  Booking,
  Showtime,
  Movie,
  Cinema,
  Room,
  FoodDrink,
} from "@/types";

import useAuth from "@/hooks/useAuth";
import ProfileLayout from "@/components/profile/ProfileLayout";
import Navbar from "@/components/Navbar";

// --- INTERFACES ---
interface EnrichedBooking {
  booking: Booking;
  showtime?: Showtime;
  movie?: Movie;
  cinema?: Cinema;
  room?: Room;
  formattedDate: string;
  formattedTime: string;
  selectedSeatsDetails: Array<{
    seatNumber: string;
    type: string;
    price: number;
  }>;
  foodDrinks: Array<FoodDrink & { quantity: number; totalPrice: number }>;
  qrUrl: string;
}

// --- COMPONENT: PRINTABLE TICKET ---
const PrintableTicket = ({ booking }: { booking: EnrichedBooking }) => {
  return (
    <div className="w-[210mm] min-h-[297mm] p-[15mm] bg-white font-sans text-sm relative">
      {/* Decorative Header */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-orange-500 to-amber-500"></div>

      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold text-orange-700 uppercase tracking-wider">
          VÉ XEM PHIM
        </h1>
        <p className="text-gray-500 mt-2">
          Cảm ơn quý khách đã sử dụng dịch vụ
        </p>
        <div className="mt-4 inline-block border-2 border-orange-200 px-6 py-2 rounded-lg bg-orange-50">
          <p className="text-lg text-orange-800">
            Mã vé:{" "}
            <strong className="font-mono text-xl">{booking.booking.id}</strong>
          </p>
        </div>
      </div>

      <div className="flex gap-8 mb-8 border-b border-orange-100 pb-8">
        <div className="w-1/3">
          <Image
            src={booking.movie?.thumbnail || "/placeholder-poster.jpg"}
            alt={booking.movie?.title || "N/A"}
            width={280}
            height={420}
            className="rounded-lg object-cover shadow-lg border border-gray-200"
          />
        </div>
        <div className="w-2/3 space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            {booking.movie?.title || "N/A"}
          </h2>

          <div className="grid grid-cols-2 gap-4 text-base">
            <div>
              <span className="text-gray-500 block text-xs uppercase font-bold">
                Ngày chiếu
              </span>
              <span className="font-semibold text-gray-800">
                {booking.formattedDate}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase font-bold">
                Giờ chiếu
              </span>
              <span className="font-semibold text-gray-800">
                {booking.formattedTime}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500 block text-xs uppercase font-bold">
                Rạp chiếu
              </span>
              <span className="font-semibold text-orange-600">
                {booking.cinema?.name}
              </span>
              <p className="text-gray-600 text-sm">{booking.cinema?.address}</p>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase font-bold">
                Phòng
              </span>
              <span className="font-semibold text-gray-800">
                {booking.room?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-orange-500 pl-3">
        Chi tiết ghế ngồi
      </h3>
      <table className="w-full mb-8 border-collapse">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="text-left py-3 px-4 rounded-l-lg">Số ghế</th>
            <th className="text-left py-3 px-4">Loại ghế</th>
            <th className="text-right py-3 px-4 rounded-r-lg">Giá vé</th>
          </tr>
        </thead>
        <tbody>
          {booking.selectedSeatsDetails.map((s, index) => (
            <tr
              key={s.seatNumber}
              className={index % 2 === 0 ? "bg-white" : "bg-orange-50/30"}
            >
              <td className="py-3 px-4 font-bold">{s.seatNumber}</td>
              <td className="py-3 px-4">{s.type}</td>
              <td className="py-3 px-4 text-right font-mono">
                {new Intl.NumberFormat("vi-VN").format(s.price)} ₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {booking.foodDrinks.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-orange-500 pl-3">
            Combo & Bắp nước
          </h3>
          <table className="w-full mb-8 border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="text-left py-3 px-4 rounded-l-lg">Tên món</th>
                <th className="text-center py-3 px-4">Số lượng</th>
                <th className="text-right py-3 px-4 rounded-r-lg">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {booking.foodDrinks.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-orange-50/30"}
                >
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-mono">
                    {new Intl.NumberFormat("vi-VN").format(item.totalPrice)} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="flex justify-between items-end mt-10 pt-6 border-t-2 border-dashed border-gray-300">
        <div className="text-center">
          <Image
            src={booking.qrUrl}
            alt="QR Code vé"
            width={120}
            height={120}
            className="border-2 border-gray-200 p-1 bg-white rounded-lg"
          />
          <p className="mt-2 text-xs text-gray-500 uppercase tracking-wide">
            Quét mã check-in
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-500 mb-1">Tổng thanh toán</p>
          <p className="text-4xl font-bold text-orange-600">
            {new Intl.NumberFormat("vi-VN").format(booking.booking.totalPrice)}{" "}
            ₫
          </p>
          <p className="text-gray-400 text-xs mt-2 italic">Đã bao gồm VAT</p>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full text-center text-gray-400 text-xs">
        <p>
          Vé chỉ có giá trị cho suất chiếu đã chọn. Vui lòng đến trước giờ chiếu
          15 phút.
        </p>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function HistoryPage() {
  const { profile, isLogged } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enrichedBookings, setEnrichedBookings] = useState<EnrichedBooking[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<EnrichedBooking | null>(null);

  const printableRef = useRef<HTMLDivElement>(null);
  const limit = 5;

  useEffect(() => {
    if (!isLogged || !profile?.id) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: response } = await getBookingsByUserId(
          currentPage,
          limit
        );

        const bookingList = response.data || [];
        const total =
          response.pagination?.totalItems ||
          response.total ||
          bookingList.length;

        const pages = Math.ceil(total / limit);
        setTotalPages(pages > 0 ? pages : 1);
        setBookings(bookingList);

        const enriched: EnrichedBooking[] = [];

        for (const booking of bookingList) {
          try {
            const { data: showtime } = await getShowtimeById(
              booking.showtimeId
            );

            const date = new Date(showtime.startTime);
            const formattedDate = date.toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            const formattedTime = date.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const [movieRes, cinemaRes, roomRes] = await Promise.all([
              getMovieById(showtime.movieId),
              getCinemaById(showtime.cinemaId),
              getRoomById(showtime.roomId),
            ]);

            const selectedSeats = roomRes.data.seats.filter(
              (s: { id: string }) =>
                booking.bookingSeats.some(
                  (bs: { seatId: string }) => bs.seatId === s.id
                )
            );

            const foodTotal = booking.bookingFoodDrinks.reduce(
              (sum: number, item: { totalPrice: number }) =>
                sum + item.totalPrice,
              0
            );
            const ticketTotal = booking.totalPrice - foodTotal;
            const sumExtra = selectedSeats.reduce(
              (sum: number, seat: { extraPrice?: number }) =>
                sum + (seat.extraPrice || 0),
              0
            );
            const seatCount = selectedSeats.length;
            const basePrice =
              seatCount > 0 ? (ticketTotal - sumExtra) / seatCount : 0;

            const seatsDetails = selectedSeats.map(
              (seat: {
                seatNumber: string;
                seatType?: string;
                extraPrice?: number;
              }) => ({
                seatNumber: seat.seatNumber,
                type: seat.seatType || "N/A",
                price: basePrice + (seat.extraPrice || 0),
              })
            );

            const foodDrinks = await Promise.all(
              booking.bookingFoodDrinks.map(
                async (item: {
                  foodDrinkId: string;
                  quantity: number;
                  totalPrice: number;
                }) => {
                  try {
                    const { data: food } = await getFoodDrinkById(
                      item.foodDrinkId
                    );
                    return {
                      ...food,
                      quantity: item.quantity,
                      totalPrice: item.totalPrice,
                    };
                  } catch {
                    return {
                      id: item.foodDrinkId,
                      name: "N/A",
                      image: "",
                      quantity: item.quantity,
                      totalPrice: item.totalPrice,
                    };
                  }
                }
              )
            );

            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              booking.id
            )}&ecc=H`;

            enriched.push({
              booking,
              showtime,
              movie: movieRes.data,
              cinema: cinemaRes.data,
              room: roomRes.data,
              formattedDate,
              formattedTime,
              selectedSeatsDetails: seatsDetails,
              foodDrinks,
              qrUrl,
            });
          } catch (err) {
            console.error("Lỗi tải chi tiết booking:", booking.id, err);
          }
        }

        setEnrichedBookings(enriched);
      } catch (err) {
        console.error("Lỗi tải lịch sử đặt vé:", err);
        setError("Không thể tải lịch sử đặt vé. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage, profile?.id, isLogged]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetail = (booking: EnrichedBooking) => {
    setSelectedBooking(booking);
  };

  const closeDetail = () => {
    setSelectedBooking(null);
  };

  const downloadPDF = async () => {
    if (!printableRef.current || !selectedBooking) return;

    try {
      const canvas = await html2canvas(printableRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = pageHeight - 2 * margin;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", margin, margin, width, height);
      pdf.save(`Ve-phim-${selectedBooking.booking.id}.pdf`);
    } catch (err) {
      console.error("Lỗi tạo PDF:", err);
      alert("Không thể tạo PDF. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <ProfileLayout>
          <div className="flex flex-col items-center justify-center py-32 min-h-[60vh]">
            <Loader2 className="h-14 w-14 animate-spin text-orange-500" />
            <p className="mt-4 text-lg font-medium text-gray-500 animate-pulse">
              Đang tải lịch sử mua hàng...
            </p>
          </div>
        </ProfileLayout>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <ProfileLayout>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Đã xảy ra lỗi
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Tải lại trang
            </button>
          </div>
        </ProfileLayout>
      </>
    );
  }

  if (bookings.length === 0 && currentPage === 1) {
    return (
      <>
        <Navbar />
        <ProfileLayout>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-gray-50 p-8 rounded-full mb-6">
              <Ticket className="h-20 w-20 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Chưa có lịch sử đặt vé
            </h2>
            <p className="text-gray-500 max-w-md mb-8">
              Bạn chưa thực hiện giao dịch nào. Hãy khám phá các bộ phim đang
              chiếu và đặt vé ngay nhé!
            </p>
            <Link
              href="/"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Đặt vé ngay
            </Link>
          </div>
        </ProfileLayout>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProfileLayout>
        <div className="space-y-8 pb-20">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Lịch sử vé đã mua
            </h1>
            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              Trang {currentPage} / {totalPages}
            </div>
          </div>

          <div className="grid gap-6">
            {enrichedBookings.map((item) => {
              const isUpcoming =
                item.showtime && new Date(item.showtime.startTime) > new Date();
              const hasFood = item.foodDrinks.length > 0;

              return (
                <div
                  key={item.booking.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Left: Image & Badge */}
                  <div className="relative w-full md:w-48 h-64 md:h-auto shrink-0">
                    <Image
                      src={item.movie?.thumbnail || "/placeholder-poster.jpg"}
                      alt={item.movie?.title || "N/A"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                        isUpcoming
                          ? "bg-green-500/90 text-white"
                          : "bg-gray-800/80 text-gray-200"
                      }`}
                    >
                      {isUpcoming ? "Sắp chiếu" : "Đã chiếu"}
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {item.movie?.title || "N/A"}
                        </h3>
                        <p className="font-mono text-sm text-gray-400">
                          #{item.booking.id}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{item.formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>{item.formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="line-clamp-1">
                            {item.cinema?.name} - {item.room?.name}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <Armchair className="w-4 h-4 text-orange-500 mt-0.5" />
                          <span className="font-medium text-gray-900">
                            Ghế:{" "}
                            {item.selectedSeatsDetails
                              .map((s) => s.seatNumber)
                              .join(", ")}
                          </span>
                        </div>
                        {hasFood && (
                          <div className="flex items-center gap-2 sm:col-span-2 text-orange-700 bg-orange-50 w-fit px-3 py-1 rounded-md">
                            <Popcorn className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              Đã đặt kèm đồ ăn & nước uống
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4 mt-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                          Tổng tiền
                        </p>
                        <p className="text-2xl font-bold text-orange-600">
                          {new Intl.NumberFormat("vi-VN").format(
                            item.booking.totalPrice
                          )}{" "}
                          ₫
                        </p>
                      </div>
                      <button
                        onClick={() => openDetail(item)}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-orange-500/30"
                      >
                        <Info className="w-4 h-4" />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl font-bold transition flex items-center justify-center ${
                        page === currentPage
                          ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </ProfileLayout>

      {/* --- MODAL DETAIL --- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeDetail}
          ></div>

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-orange-600" />
                Chi tiết vé
              </h2>
              <button
                onClick={closeDetail}
                className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-red-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {/* Status Banner */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-green-800">
                  ĐẶT VÉ THÀNH CÔNG
                </h1>
                <p className="text-green-700 mt-1">
                  Mã vé của bạn:{" "}
                  <span className="font-mono font-bold text-xl bg-white px-3 py-1 rounded border border-green-200 ml-1">
                    {selectedBooking.booking.id}
                  </span>
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Column 1: Poster & QR */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <Image
                    src={
                      selectedBooking.movie?.thumbnail ||
                      "/placeholder-poster.jpg"
                    }
                    alt={selectedBooking.movie?.title || ""}
                    width={300}
                    height={450}
                    className="rounded-xl shadow-lg w-full object-cover aspect-[2/3]"
                  />

                  <div className="mt-6 bg-white border-2 border-dashed border-gray-300 p-4 rounded-xl w-full flex flex-col items-center">
                    <Image
                      src={selectedBooking.qrUrl}
                      alt="QR Code"
                      width={180}
                      height={180}
                    />
                    <p className="text-sm text-center text-gray-500 mt-2">
                      Đưa mã này cho nhân viên soát vé
                    </p>
                  </div>
                </div>

                {/* Column 2: Info */}
                <div className="w-full md:w-2/3 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedBooking.movie?.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {/*<span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-medium">
                        2D Phụ đề
                      </span>*/}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F25019]/10 text-[#F25019] rounded-lg text-sm font-bold border border-[#F25019]/20">
                        <MapPin className="w-4 h-4" />
                        {selectedBooking.cinema?.name}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/3 text-[#4c4c4c] rounded-lg text-sm font-bold border border-black/20">
                        <Clock className="w-4 h-4" />
                        {selectedBooking.movie?.duration} phút
                      </div>
                    </div>
                  </div>

                  {/* Grid Info */}
                  <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
                    <div>
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Ngày chiếu
                      </p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.formattedDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Giờ chiếu
                      </p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.formattedTime}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Địa chỉ rạp
                      </p>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.cinema?.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phòng chiếu</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.room?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Số lượng ghế</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.selectedSeatsDetails.length} ghế
                      </p>
                    </div>
                  </div>

                  {/* Seats Table */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Armchair className="w-5 h-5 text-orange-600" /> Ghế đã
                      chọn
                    </h3>
                    <div className="border rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th className="px-4 py-3 text-left">Số ghế</th>
                            <th className="px-4 py-3 text-left">Loại</th>
                            <th className="px-4 py-3 text-right">Giá</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedBooking.selectedSeatsDetails.map((s, i) => (
                            <tr key={i} className="bg-white">
                              <td className="px-4 py-3 font-medium">
                                {s.seatNumber}
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {s.type}
                              </td>
                              <td className="px-4 py-3 text-right font-mono">
                                {new Intl.NumberFormat("vi-VN").format(s.price)}{" "}
                                ₫
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Food & Drink */}
                  {selectedBooking.foodDrinks.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Popcorn className="w-5 h-5 text-amber-500" /> Bắp &
                        Nước
                      </h3>
                      <div className="space-y-3">
                        {selectedBooking.foodDrinks.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-orange-50/50 p-3 rounded-xl border border-orange-100"
                          >
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt=""
                                  width={40}
                                  height={40}
                                  className="rounded-md object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  x{item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium text-orange-700">
                              {new Intl.NumberFormat("vi-VN").format(
                                item.totalPrice
                              )}{" "}
                              ₫
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total Footer */}
                  <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Tổng tiền thanh toán
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        {new Intl.NumberFormat("vi-VN").format(
                          selectedBooking.booking.totalPrice
                        )}{" "}
                        ₫
                      </p>
                    </div>
                    <button
                      onClick={downloadPDF}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-5 h-5" /> Tải vé PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable Area */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {selectedBooking && (
          <div ref={printableRef}>
            <PrintableTicket booking={selectedBooking} />
          </div>
        )}
      </div>
    </>
  );
}
