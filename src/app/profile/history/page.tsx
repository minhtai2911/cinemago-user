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

const PrintableTicket = ({ booking }: { booking: EnrichedBooking }) => {
  return (
    <div className="w-[210mm] min-h-[297mm] p-[15mm] bg-white font-sans text-sm">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-700">
          ĐẶT VÉ THÀNH CÔNG!
        </h1>
        <p className="text-2xl mt-4">
          Mã vé: <strong>{booking.booking.id}</strong>
        </p>
      </div>

      <div className="text-center mb-8">
        <Image
          src={booking.movie?.thumbnail || "/placeholder-poster.jpg"}
          alt={booking.movie?.title || "N/A"}
          width={280}
          height={420}
          className="mx-auto rounded-lg object-cover"
        />
        <h2 className="text-2xl font-bold mt-4">
          {booking.movie?.title || "N/A"}
        </h2>
      </div>

      <table className="w-full mb-8">
        <tbody>
          <tr>
            <td className="font-bold py-2 w-32">Ngày chiếu:</td>
            <td>{booking.formattedDate}</td>
          </tr>
          <tr>
            <td className="font-bold py-2">Giờ chiếu:</td>
            <td>{booking.formattedTime}</td>
          </tr>
          <tr>
            <td className="font-bold py-2">Rạp:</td>
            <td>
              {booking.cinema?.name}
              <br />
              <small className="text-gray-600">{booking.cinema?.address}</small>
            </td>
          </tr>
          <tr>
            <td className="font-bold py-2">Phòng chiếu:</td>
            <td>{booking.room?.name}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-xl font-bold text-center mb-4 text-purple-700">
        Ghế đã chọn
      </h3>
      <table className="w-full mb-8 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-3">Số ghế</th>
            <th className="text-left py-2 px-3">Loại</th>
            <th className="text-right py-2 px-3">Giá</th>
          </tr>
        </thead>
        <tbody>
          {booking.selectedSeatsDetails.map((s) => (
            <tr key={s.seatNumber} className="border-t">
              <td className="py-2 px-3">{s.seatNumber}</td>
              <td className="py-2 px-3">{s.type}</td>
              <td className="py-2 px-3 text-right">
                {new Intl.NumberFormat("vi-VN").format(s.price)} ₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {booking.foodDrinks.length > 0 && (
        <>
          <h3 className="text-xl font-bold text-center mb-4 text-purple-700">
            Combo đồ ăn & nước uống
          </h3>
          <table className="w-full mb-8 border border-gray-300">
            <tbody>
              {booking.foodDrinks.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-3">
                    <strong>{item.name}</strong>
                    <br />
                    <small className="text-gray-600">SL: {item.quantity}</small>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {new Intl.NumberFormat("vi-VN").format(item.totalPrice)} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="text-center my-12">
        <Image
          src={booking.qrUrl}
          alt="QR Code vé"
          width={200}
          height={200}
          className="mx-auto border-2 border-gray-300 p-2 bg-white"
        />
        <p className="mt-4 text-gray-600">
          Quét mã này tại quầy để check-in nhanh chóng
        </p>
      </div>

      <div className="bg-purple-700 text-white p-8 text-center rounded-lg">
        <p className="text-2xl">Tổng thanh toán</p>
        <p className="text-4xl font-bold mt-2">
          {new Intl.NumberFormat("vi-VN").format(booking.booking.totalPrice)} ₫
        </p>
      </div>

      <p className="text-center mt-8 text-gray-600">
        Vui lòng xuất trình mã vé hoặc QR code khi vào rạp.
        <br />
        <strong className="text-lg">Chúc Quý khách xem phim vui vẻ!</strong>
      </p>
    </div>
  );
};

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
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            <p className="mt-4 text-lg text-gray-600">Đang tải lịch sử...</p>
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
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-700">{error}</p>
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
          <div className="text-center py-20">
            <Ticket className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Chưa có lịch sử đặt vé
            </h2>
            <Link
              href="/"
              className="bg-gradient-to-r from-[#F25019] to-[#E9391B] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
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
          <h1 className="text-3xl font-bold text-gray-800">Lịch sử mua hàng</h1>

          {enrichedBookings.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Không có vé nào ở trang này.
            </div>
          ) : (
            enrichedBookings.map((item) => {
              const isUpcoming =
                item.showtime && new Date(item.showtime.startTime) > new Date();
              const hasFood = item.foodDrinks.length > 0;

              return (
                <div
                  key={item.booking.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-[1.01]"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-90">Mã vé</p>
                        <p className="text-2xl font-mono font-bold">
                          {item.booking.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Trạng thái</p>
                        <p className="font-semibold">
                          {isUpcoming ? "Sắp chiếu" : "Đã chiếu"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-8 mb-6">
                      <div className="flex justify-center">
                        <Image
                          src={
                            item.movie?.thumbnail || "/placeholder-poster.jpg"
                          }
                          alt={item.movie?.title || "N/A"}
                          width={200}
                          height={300}
                          className="rounded-xl shadow-md object-cover"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-5">
                        <h3 className="text-2xl font-bold">
                          {item.movie?.title || "N/A"}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Ngày chiếu
                              </p>
                              <p className="font-medium">
                                {item.formattedDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Giờ chiếu</p>
                              <p className="font-medium">
                                {item.formattedTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Rạp</p>
                              <p className="font-medium">{item.cinema?.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.cinema?.address}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phòng chiếu</p>
                            <p className="font-medium">{item.room?.name}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-purple-600" />
                            <span>
                              Ghế:{" "}
                              {item.selectedSeatsDetails
                                .map((s) => s.seatNumber)
                                .join(", ")}
                            </span>
                          </div>
                          {hasFood && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <Popcorn className="w-5 h-5" />
                              <span>Có combo đồ ăn & nước uống</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t">
                      <div>
                        <p className="text-gray-600">Tổng thanh toán</p>
                        <p className="text-3xl font-bold text-purple-700">
                          {new Intl.NumberFormat("vi-VN").format(
                            item.booking.totalPrice
                          )}{" "}
                          ₫
                        </p>
                      </div>
                      <button
                        onClick={() => openDetail(item)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
                      >
                        Xem chi tiết vé
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-xl font-medium transition ${
                      page === currentPage
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white border hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl bg-white border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </ProfileLayout>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Chi tiết vé phim</h2>
              <button
                onClick={closeDetail}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-8 rounded-2xl text-center mb-8">
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-2">ĐẶT VÉ THÀNH CÔNG!</h1>
                <p className="text-xl flex items-center justify-center gap-2">
                  <Ticket className="w-8 h-8" />
                  Mã vé:{" "}
                  <span className="font-mono text-2xl">
                    {selectedBooking.booking.id}
                  </span>
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div>
                  <Image
                    src={
                      selectedBooking.movie?.thumbnail ||
                      "/placeholder-poster.jpg"
                    }
                    alt={selectedBooking.movie?.title || ""}
                    width={300}
                    height={450}
                    className="rounded-xl shadow-lg w-full object-cover"
                  />
                </div>

                <div className="md:col-span-2 space-y-6">
                  <h2 className="text-3xl font-bold">
                    {selectedBooking.movie?.title}
                  </h2>

                  <div className="grid grid-cols-2 gap-6 text-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="text-gray-600">Ngày chiếu</p>
                        <p className="font-bold">
                          {selectedBooking.formattedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="text-gray-600">Giờ chiếu</p>
                        <p className="font-bold">
                          {selectedBooking.formattedTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="text-gray-600">Rạp</p>
                        <p className="font-bold">
                          {selectedBooking.cinema?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedBooking.cinema?.address || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Phòng chiếu</p>
                      <p className="font-bold">{selectedBooking.room?.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-3 text-lg">Ghế đã chọn</p>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left p-2 bg-gray-100">Số ghế</th>
                          <th className="text-left p-2 bg-gray-100">Loại</th>
                          <th className="text-right p-2 bg-gray-100">Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBooking.selectedSeatsDetails.map((s, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">{s.seatNumber}</td>
                            <td className="p-2">{s.type}</td>
                            <td className="p-2 text-right">
                              {new Intl.NumberFormat("vi-VN").format(s.price)} ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-center my-8">
                    <div className="bg-gray-100 p-6 rounded-xl shadow-inner text-center">
                      <Image
                        src={selectedBooking.qrUrl}
                        alt="QR Code vé"
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                      <p className="mt-3 text-sm text-gray-600">
                        Quét mã này tại quầy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.foodDrinks.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                    <Popcorn className="w-8 h-8 text-yellow-500" />
                    Combo đồ ăn & nước uống
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedBooking.foodDrinks.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-xl p-5 flex gap-4"
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{item.name}</p>
                          <p className="text-gray-600">
                            Số lượng: {item.quantity}
                          </p>
                          <p className="font-bold text-purple-600 text-xl mt-2">
                            {new Intl.NumberFormat("vi-VN").format(
                              item.totalPrice
                            )}{" "}
                            ₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-purple-800 to-pink-700 rounded-2xl p-8 text-center text-white">
                <p className="text-2xl mb-2">Tổng thanh toán</p>
                <p className="text-5xl font-bold">
                  {new Intl.NumberFormat("vi-VN").format(
                    selectedBooking.booking.totalPrice
                  )}{" "}
                  ₫
                </p>
              </div>

              <div className="text-center mt-8 text-gray-600">
                <p>Xuất trình mã vé hoặc QR code tại quầy khi vào rạp.</p>
                <p className="mt-4 font-semibold">
                  Chúc Quý khách xem phim vui vẻ!
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition"
                >
                  <Download className="w-6 h-6" /> Tải vé PDF
                </button>
              </div>
            </div>
          </div>

          <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
            <div ref={printableRef}>
              <PrintableTicket booking={selectedBooking} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
