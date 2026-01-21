"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// Thêm icon (Home, Armchair, Info)
import {
  Armchair,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Home,
  Loader2,
  MapPin,
  Popcorn,
  Ticket,
  XCircle,
} from "lucide-react";

import {
  checkStatusTransactionMoMo,
  checkStatusTransactionZaloPay,
  getBookingById,
  getCinemaById,
  getFoodDrinkById,
  getMovieById,
  getRoomById,
  getShowtimeById,
  sendEmailNotification,
} from "@/services";

import type {
  Booking,
  Cinema,
  FoodDrink,
  Movie,
  Room,
  Showtime,
} from "@/types";

import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export default function BookingCompletedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useAuth();

  const printableRef = useRef<HTMLDivElement>(null);

  // --- START ---
  let bookingId: string | null =
    searchParams.get("orderId") || searchParams.get("bookingId");

  const apptransid = searchParams.get("apptransid");
  if (apptransid?.includes("_")) {
    const uuid = apptransid.split("_")[1];
    bookingId =
      uuid.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5") ||
      null;
  }

  const method = searchParams.get("orderId")
    ? "MOMO"
    : searchParams.get("vnp_TxnRef")
      ? "VNPAY"
      : searchParams.get("apptransid")
        ? "ZALOPAY"
        : null;
  const statusParam = searchParams.get("status");

  const [verifying, setVerifying] = useState(true);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [foodDrinks, setFoodDrinks] = useState<
    Array<FoodDrink & { quantity: number; totalPrice: number }>
  >([]);

  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [selectedSeatsDetails, setSelectedSeatsDetails] = useState<
    Array<{
      seatNumber: string;
      type: string;
      price: number;
    }>
  >([]);

  useEffect(() => {
    if (!bookingId) {
      setVerifyError("Không tìm thấy mã đặt vé.");
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        if (method === "VNPAY" && statusParam !== "success") {
          throw new Error("Thanh toán VNPAY thất bại.");
        }
        if (method === "MOMO") {
          await checkStatusTransactionMoMo(bookingId);
        }
        if (method === "ZALOPAY") {
          await checkStatusTransactionZaloPay(apptransid!);
        }
      } catch {
        setVerifyError("Xác thực thanh toán thất bại.");
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [bookingId, method, statusParam, apptransid]);

  useEffect(() => {
    if (verifying || verifyError || !bookingId || !profile?.email) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setLoadError(null);

      const emailSentKey = `emailSent_${bookingId}`;
      const alreadySent = localStorage.getItem(emailSentKey) === "true";

      try {
        const {
          data: { data: bookingData },
        } = await getBookingById(bookingId!);
        setBooking(bookingData);

        const generatedQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          bookingData.id,
        )}&ecc=H`;
        setQrUrl(generatedQrUrl);

        const { data: showtimeData } = await getShowtimeById(
          bookingData.showtimeId,
        );
        setShowtime(showtimeData);

        const date = new Date(showtimeData.startTime);
        const formattedDateLocal = date.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        setFormattedDate(formattedDateLocal);
        const formattedTimeLocal = date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setFormattedTime(formattedTimeLocal);

        const [movieRes, cinemaRes, roomRes] = await Promise.all([
          getMovieById(showtimeData.movieId),
          getCinemaById(showtimeData.cinemaId),
          getRoomById(showtimeData.roomId),
        ]);

        setMovie(movieRes.data);
        setCinema(cinemaRes.data);
        setRoom(roomRes.data);

        const foodTotal = bookingData.bookingFoodDrinks.reduce(
          (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
          0,
        );

        const ticketTotal = bookingData.totalPrice - foodTotal;

        const selectedSeats = roomRes.data.seats.filter((s: { id: string }) =>
          bookingData.bookingSeats.some(
            (bs: { seatId: string }) => bs.seatId === s.id,
          ),
        );

        const sumExtra = selectedSeats.reduce(
          (sum: number, seat: { extraPrice: number }) => sum + seat.extraPrice,
          0,
        );

        const seatCount = selectedSeats.length;
        const calculatedBasePrice =
          seatCount > 0 ? (ticketTotal - sumExtra) / seatCount : 0;

        const seatsDetails = selectedSeats.map(
          (seat: {
            seatNumber: string;
            seatType: string;
            extraPrice: number;
          }) => ({
            seatNumber: seat.seatNumber,
            type: seat.seatType,
            price: calculatedBasePrice + seat.extraPrice,
          }),
        );
        setSelectedSeatsDetails(seatsDetails);

        if (bookingData.bookingFoodDrinks.length > 0) {
          const foods = await Promise.all(
            bookingData.bookingFoodDrinks.map(
              async (item: {
                foodDrinkId: string;
                quantity: number;
                totalPrice: number;
              }) => {
                try {
                  const { data: food } = await getFoodDrinkById(
                    item.foodDrinkId,
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
              },
            ),
          );
          setFoodDrinks(foods);
        }

        if (!alreadySent && !emailSent) {
          try {
            const foodRows =
              foodDrinks.length > 0
                ? foodDrinks
                    .map(
                      (item) => `
                  <tr>
                    <td style="padding:8px 0; border-bottom:1px solid #eee;">
                      <strong>${item.name}</strong><br>
                      <small style="color:#666;">Số lượng: ${
                        item.quantity
                      }</small>
                    </td>
                    <td style="text-align:right; padding:8px 0; border-bottom:1px solid #eee;">
                      ${new Intl.NumberFormat("vi-VN").format(
                        item.totalPrice,
                      )} ₫
                    </td>
                  </tr>`,
                    )
                    .join("")
                : `<tr><td colspan="2" style="text-align:center; color:#666; padding:20px;">Không có combo</td></tr>`;

            const seatRows = seatsDetails
              .map(
                (s: { seatNumber: string; type: string; price: number }) => `
              <tr>
                <td style="padding:8px 0; border-bottom:1px solid #eee;">
                  Ghế ${s.seatNumber}<br>
                  <small style="color:#666;">Loại: ${s.type}</small>
                </td>
                <td style="text-align:right; padding:8px 0; border-bottom:1px solid #eee;">
                  ${new Intl.NumberFormat("vi-VN").format(s.price)} ₫
                </td>
              </tr>`,
              )
              .join("");

            const emailQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              bookingData.id,
            )}&ecc=H`;

            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Vé phim - ${bookingData.id}</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background:#fff7ed; margin:0; padding:40px 0; }
                .container { max-width:600px; margin:auto; background:white; border-radius:16px; overflow:hidden; box-shadow: 0 10px 25px rgba(242, 80, 25, 0.15); }
                .header { background: #F25019; color:white; padding:30px; text-align:center; }
                .content { padding:30px; }
                table { width:100%; border-collapse:collapse; margin:10px 0; }
                td { padding:8px 0; font-size: 14px; }
                .qr { text-align:center; margin:30px 0; padding: 20px; background: #fff7ed; border-radius: 12px; border: 1px dashed #fdba74; }
                .total { background: #F25019; color:white; padding:20px; text-align:center; border-radius:12px; margin-top: 20px; }
                .footer { text-align:center; padding:20px; color:#9a3412; font-size:12px; background:#fff7ed; border-top: 1px solid #fed7aa; }
                .label { color: #666; font-size: 13px; }
                .value { font-weight: bold; color: #000; font-size: 15px; }
                .section-title { text-align:center; color:#c2410c; margin:30px 0 15px; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; border-bottom: 2px solid #fed7aa; display: inline-block; padding-bottom: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin:0; font-size:26px; text-transform: uppercase;">Đặt Vé Thành Công!</h1>
                  <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 5px 15px; border-radius: 20px; margin-top: 10px;">
                    <p style="font-size:16px; margin:0;">Mã vé: <strong style="font-family: monospace; font-size: 18px;">${
                      bookingData.id
                    }</strong></p>
                  </div>
                </div>
                
                <div class="content">
                  <div style="text-align:center; margin-bottom:20px;">
                    <img src="${movieRes.data.thumbnail || ""}" alt="${
                      movieRes.data.title
                    }" style="max-width:180px; height:auto; border-radius:12px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);" />
                  </div>
                  
                  <h2 style="text-align:center; color:#c2410c; margin:10px 0 25px; font-size: 24px; line-height: 1.3;">${
                    movieRes.data.title
                  }</h2>

                  <table style="background: #fff; border-collapse: separate; border-spacing: 0 8px;">
                    <tr>
                      <td class="label">Ngày chiếu:</td>
                      <td class="value" style="text-align: right;">${formattedDateLocal}</td>
                    </tr>
                    <tr>
                      <td class="label">Giờ chiếu:</td>
                      <td class="value" style="text-align: right;">${formattedTimeLocal}</td>
                    </tr>
                    <tr>
                      <td class="label">Rạp:</td>
                      <td class="value" style="text-align: right;">${
                        cinemaRes.data.name
                      }<br><span style="font-weight: normal; font-size: 12px; color: #666;">${
                        cinemaRes.data.address
                      }</span></td>
                    </tr>
                    <tr>
                      <td class="label">Phòng chiếu:</td>
                      <td class="value" style="text-align: right;">${roomRes.data.name}</td>
                    </tr>
                  </table>

                  <div style="text-align: center;"><div class="section-title">Ghế đã chọn</div></div>
                  <table style="width: 100%;">${seatRows}</table>

                  ${
                    foodDrinks.length > 0
                      ? `
                  <div style="text-align: center;"><div class="section-title">Combo bắp nước</div></div>
                  <table style="width: 100%;">${foodRows}</table>
                  `
                      : ""
                  }

                  <div class="qr">
                    <p style="color:#c2410c; margin: 0 0 10px; font-weight: bold; font-size: 14px;">QUÉT MÃ ĐỂ CHECK-IN</p>
                    <img src="${emailQrUrl}" alt="QR Code" style="width:200px; height:200px; border:2px solid white; border-radius: 8px;" />
                  </div>

                  <div class="total">
                    <div style="font-size:14px; opacity: 0.9; text-transform: uppercase;">Tổng thanh toán</div>
                    <div style="font-size:36px; font-weight:900; margin: 5px 0;">
                      ${new Intl.NumberFormat("vi-VN").format(bookingData.totalPrice)} ₫
                    </div>
                    ${
                      method
                        ? `<div style="font-size:12px; background: rgba(0,0,0,0.1); display: inline-block; padding: 4px 12px; border-radius: 20px;">Qua cổng: ${method}</div>`
                        : ""
                    }
                  </div>

                  <p style="text-align:center; margin-top:30px; color:#666; font-size: 13px; line-height: 1.6;">
                    Vui lòng xuất trình mã vé hoặc QR code khi vào rạp.<br>
                    <strong>Chúc Quý khách xem phim vui vẻ!</strong>
                  </p>
                </div>
                
                <div class="footer">
                  Email được gửi tự động từ hệ thống đặt vé phim CinemaGO.<br>
                  Vui lòng không trả lời email này.
                </div>
              </div>
            </body>
            </html>`; /* --- END OF htmlContent for mail --- */

            await sendEmailNotification(
              profile.email,
              `Vé phim - Mã vé ${bookingData.id}`,
              htmlContent,
            );

            localStorage.setItem(emailSentKey, "true");
            setEmailSent(true);
          } catch (err) {
            console.error("Gửi email thất bại:", err);
          } finally {
            setEmailSent(true);
          }
        }
      } catch {
        setLoadError("Thanh toán thất bại hoặc không tìm thấy vé.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [verifying, verifyError, bookingId, profile?.email, method, apptransid]);

  const downloadPDF = async () => {
    if (!printableRef.current || !booking || !qrUrl) return;

    try {
      const canvas = await html2canvas(printableRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = pageHeight - 2 * margin;

      const ratio = Math.min(
        maxWidth / canvas.width,
        maxHeight / canvas.height,
      );
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;

      // Căn giữa PDF
      const xOffset = (pageWidth - width) / 2;

      pdf.addImage(imgData, "PNG", xOffset, margin, width, height);
      pdf.save(`Ve-phim-${booking.id}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    }
  };
  // --- END ---

  // ==================================================================================
  // UI
  // ==================================================================================

  // 1. Màn hình Loading
  if (verifying || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#fffbf5]">
        <Loader2 className="h-16 w-16 animate-spin text-[#F25019]" />
        <p className="text-2xl font-bold text-gray-700 animate-pulse">
          {verifying
            ? "Đang xác thực thanh toán..."
            : "Đang tải thông tin vé..."}
        </p>
        <p className="text-gray-500">Vui lòng không tắt trình duyệt</p>
      </div>
    );
  }

  // 2. Màn hình Error
  if (verifyError || loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbf5] p-4">
        <div className="bg-white rounded-3xl p-10 max-w-lg text-center shadow-xl border-t-8 border-red-500">
          <XCircle className="h-20 w-20 mx-auto mb-6 text-red-500" />
          <h1 className="text-3xl font-black text-gray-800 mb-4 uppercase">
            Thanh toán thất bại
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {verifyError || loadError}
            <br />
            Vui lòng thử lại hoặc liên hệ hỗ trợ.
          </p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-xl font-bold transition transform active:scale-95"
          >
            <Home className="w-5 h-5" /> Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!booking || !showtime || !movie || !cinema || !room || !qrUrl)
    return null;

  // 3. Màn hình Success (Ticket Style)
  return (
    <>
      <Navbar />
      <div className="relative z-10 min-h-screen bg-gradient-to-r from-[#fffbf5] to-[#fefefe] py-10 px-4 pb-32 font-sans">
        {/* --- Background Effects --- */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Gradient Blobs */}
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-200/20 to-rose-200/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-rose-100/30 to-orange-100/20 blur-[100px]" />

          {/* Popcorn Watermark */}
          <div className="absolute top-[20%] -right-[5%] w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] opacity-[0.1] z-0">
            <Image
              src="/corn.png"
              alt="bg-cinemago"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
          {/* Header Thông báo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4 shadow-sm animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-wide mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-500 text-lg">
              Vé của bạn đã được xuất. Chúc bạn xem phim vui vẻ!
            </p>
          </div>

          {/* Ticket Card Style */}
          <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative filter drop-shadow-xl">
            {/* Poster Section */}
            <div
              className="w-full md:w-[280px] bg-[#F25019] p-6 flex flex-col items-center justify-center relative shrink-0"
              style={{
                backgroundImage: `radial-gradient(circle at top right, transparent 16px, #F25019 16.5px), radial-gradient(circle at bottom right, transparent 16px, #F25019 16.5px)`,
                backgroundSize: "51% 51%",
                backgroundPosition: "top right, bottom right",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute -bottom-10 -left-20 w-85 h-85 opacity-15 z-0 pointer-events-none rotate-12">
                <Image
                  src="/filmroll.png"
                  alt="watermark-cinemago"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center w-full"></div>
              <div className="relative w-[185px] aspect-[2/3] shadow-2xl rounded-lg overflow-hidden border-4 border-white/20 mb-0 transform hover:scale-105 transition-transform duration-500">
                <Image
                  fill
                  src={movie.thumbnail || "/placeholder-poster.jpg"}
                  alt={movie.title}
                  className="object-cover"
                />
              </div>

              <div className="w-full mt-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-[11px] font-bold text-white opacity-70 uppercase tracking-[0.2em] mb-2">
                    Mã vé
                  </p>

                  <div className="relative overflow-hidden rounded-lg bg-white/10 py-2 border border-white/5">
                    <p className="font-mono text-[13px] md:text-x1 font-black text-white tracking-widest relative z-10">
                      {booking.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Info Section (Right/Bottom) */}
            <div
              className="flex-1 p-8 bg-white relative flex flex-col"
              style={{
                backgroundImage: `radial-gradient(circle at top left, transparent 16px, #ffffff 16.5px), radial-gradient(circle at bottom left, transparent 16px, #ffffff 16.5px)`,
                backgroundSize: "51% 51%",
                backgroundPosition: "top left, bottom left",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Dashed Line */}
              <div className="absolute left-0 top-6 bottom-6 w-[1px] border-l-2 border-dashed border-gray-300 hidden md:block"></div>

              <div className="pl-0 md:pl-6 flex flex-col h-full">
                {/* Movie Title */}
                <h2 className="text-3xl font-black text-gray-800 uppercase mb-6 leading-tight">
                  {movie.title}
                </h2>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-8 pb-8 border-b border-dashed border-gray-200">
                  <InfoItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="Ngày chiếu"
                    value={formattedDate}
                  />
                  <InfoItem
                    icon={<Clock className="w-4 h-4" />}
                    label="Giờ chiếu"
                    value={formattedTime}
                  />
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F25019]" /> Rạp chiếu
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F25019]/10 text-[#F25019] rounded-lg text-sm font-bold border border-[#F25019]/20 w-fit mb-1">
                      {cinema.name}
                    </div>
                    <p className="text-sm text-gray-500 pl-1">
                      {cinema.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
                      <Ticket className="w-3 h-3 text-[#F25019]" /> Phòng chiếu
                    </p>
                    <p className="font-bold text-gray-800 text-lg">
                      {room.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
                      <Armchair className="w-3 h-3 text-[#F25019]" /> Ghế đã
                      chọn
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeatsDetails.map((s, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-md font-bold text-sm"
                        >
                          {s.seatNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Food & Drink */}
                {foodDrinks.length > 0 && (
                  <div className="mb-8 pb-8 border-b border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-3 flex items-center gap-1">
                      <Popcorn className="w-3 h-3 text-[#F25019]" /> Combo đã
                      đặt
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {foodDrinks.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-orange-50/50 p-2 rounded-lg border border-orange-100"
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          )}
                          <div>
                            <p className="font-bold text-sm text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              x{item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer trong thẻ vé */}
                <div className="mt-auto flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 w-full md:w-auto">
                    <div className="bg-white p-1 rounded-lg border border-gray-200">
                      <Image src={qrUrl} width={64} height={64} alt="QR Code" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        Phương thức
                      </p>
                      <p className="font-bold text-gray-800 text-sm mb-1">
                        {method || "Online"}
                      </p>
                      <p className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full w-fit font-bold uppercase tracking-wider">
                        Đã thanh toán
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400 font-bold uppercase">
                      Tổng thanh toán
                    </p>
                    <p className="text-3xl font-black text-[#F25019]">
                      {new Intl.NumberFormat("vi-VN").format(
                        booking.totalPrice,
                      )}{" "}
                      ₫
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center mt-8 text-gray-500 text-sm font-medium">
            Vui lòng xuất trình mã vé hoặc QR code tại quầy khi vào rạp. <br />
            <strong className="text-gray-700">
              Chúc Quý khách xem phim vui vẻ!
            </strong>
          </p>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_30px_rgba(0,0,0,0.1)] p-4 z-50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto flex-1 flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-6 rounded-xl font-bold transition"
          >
            <Home className="w-5 h-5" /> Về trang chủ
          </button>

          <button
            onClick={downloadPDF}
            className="w-full sm:w-auto flex-[2] flex justify-center items-center gap-3 bg-gradient-to-r from-[#F25019] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 px-8 rounded-xl font-bold transition shadow-lg shadow-orange-200 transform active:scale-[0.98]"
          >
            <Download className="w-5 h-5" /> Tải vé PDF
          </button>
        </div>
      </div>

      {/* HIDDEN PRINTABLE AREA FOR PDF */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={printableRef}>
          <div className="w-[210mm] min-h-[297mm] p-[15mm] bg-white font-sans text-sm relative flex flex-col items-center">
            {/* Decorative Header */}
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-orange-500 to-amber-500"></div>

            <div className="text-center mb-8 mt-4 w-full">
              <h1 className="text-4xl font-bold text-orange-700 uppercase tracking-wider">
                VÉ XEM PHIM
              </h1>
              <p className="text-gray-500 mt-2">
                Cảm ơn quý khách đã sử dụng dịch vụ
              </p>
              <div className="mt-4 inline-block border-2 border-orange-200 px-6 py-2 rounded-lg bg-orange-50">
                <p className="text-lg text-orange-800">
                  Mã vé:{" "}
                  <strong className="font-mono text-xl">{booking.id}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-8 mb-8 border-b border-orange-100 pb-8 w-full">
              <div className="w-1/3 flex justify-center">
                <Image
                  src={movie.thumbnail || "/placeholder-poster.jpg"}
                  alt={movie.title || "N/A"}
                  width={280}
                  height={420}
                  className="rounded-lg object-cover shadow-lg border border-gray-200"
                />
              </div>
              <div className="w-2/3 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {movie.title || "N/A"}
                </h2>

                <div className="grid grid-cols-2 gap-4 text-base">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase font-bold">
                      Ngày chiếu
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formattedDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase font-bold">
                      Giờ chiếu
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formattedTime}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block text-xs uppercase font-bold">
                      Rạp chiếu
                    </span>
                    <span className="font-semibold text-orange-600">
                      {cinema.name}
                    </span>
                    <p className="text-gray-600 text-sm">{cinema.address}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase font-bold">
                      Phòng
                    </span>
                    <span className="font-semibold text-gray-800">
                      {room.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-orange-500 pl-3">
                Chi tiết ghế ngồi
              </h3>
              <table className="w-full mb-8 border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="text-left py-3 px-4 rounded-l-lg">Số ghế</th>
                    <th className="text-left py-3 px-4">Loại ghế</th>
                    <th className="text-right py-3 px-4 rounded-r-lg">
                      Giá vé
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSeatsDetails.map((s, index) => (
                    <tr
                      key={s.seatNumber}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-orange-50/30"
                      }
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

              {foodDrinks.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-orange-500 pl-3">
                    Combo & Bắp nước
                  </h3>
                  <table className="w-full mb-8 border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="text-left py-3 px-4 rounded-l-lg">
                          Tên món
                        </th>
                        <th className="text-center py-3 px-4">Số lượng</th>
                        <th className="text-right py-3 px-4 rounded-r-lg">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodDrinks.map((item, index) => (
                        <tr
                          key={item.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-orange-50/30"
                          }
                        >
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {new Intl.NumberFormat("vi-VN").format(
                              item.totalPrice,
                            )}{" "}
                            ₫
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
                    src={qrUrl}
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
                    {new Intl.NumberFormat("vi-VN").format(booking.totalPrice)}{" "}
                    ₫
                  </p>
                  <p className="text-gray-400 text-xs mt-2 italic">
                    Đã bao gồm VAT
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 w-full text-center text-gray-400 text-xs">
              <p>
                Vé chỉ có giá trị cho suất chiếu đã chọn. Vui lòng đến trước giờ
                chiếu 15 phút.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper Component (để render từng mục thông tin)
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
        <span className="text-[#F25019]">{icon}</span> {label}
      </p>
      <p className="font-bold text-gray-800 text-lg">{value}</p>
    </div>
  );
}
