"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Ticket,
  Popcorn,
  Clock,
  Calendar,
  MapPin,
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";

import {
  getBookingById,
  getShowtimeById,
  getMovieById,
  getCinemaById,
  getRoomById,
  getFoodDrinkById,
  checkStatusTransactionMoMo,
  checkStatusTransactionZaloPay,
  sendEmailNotification,
} from "@/services";

import type {
  Booking,
  Showtime,
  Movie,
  Cinema,
  Room,
  FoodDrink,
} from "@/types";

import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import useAuth from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

export default function BookingCompletedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useAuth();

  const printableRef = useRef<HTMLDivElement>(null);

  let bookingId: string | null =
    searchParams.get("orderId") || searchParams.get("vnp_TxnRef");

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
    if (verifying || verifyError || !bookingId || !profile?.email) return;

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
          bookingData.id
        )}&ecc=H`;
        setQrUrl(generatedQrUrl);

        const { data: showtimeData } = await getShowtimeById(
          bookingData.showtimeId
        );
        setShowtime(showtimeData);

        const date = new Date(showtimeData.startTime);
        setFormattedDate(
          date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        );
        setFormattedTime(
          date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );

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
          0
        );

        const ticketTotal = bookingData.totalPrice - foodTotal;

        const selectedSeats = roomRes.data.seats.filter((s: { id: string }) =>
          bookingData.bookingSeats.some(
            (bs: { seatId: string }) => bs.seatId === s.id
          )
        );

        const sumExtra = selectedSeats.reduce(
          (sum: number, seat: { extraPrice: number }) => sum + seat.extraPrice,
          0
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
          })
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
                        item.totalPrice
                      )} ₫
                    </td>
                  </tr>`
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
              </tr>`
              )
              .join("");

            const emailQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              bookingData.id
            )}&ecc=H`;

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vé phim - ${bookingData.id}</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f5f5f5; margin:0; padding:20px; }
    .container { max-width:600px; margin:auto; background:white; border:1px solid #ddd; border-radius:8px; overflow:hidden; }
    .header { background:#6b21a8; color:white; padding:30px; text-align:center; }
    .content { padding:30px; }
    table { width:100%; border-collapse:collapse; margin:20px 0; }
    td { padding:8px 0; }
    .qr { text-align:center; margin:40px 0; }
    .total { background:#4c1d95; color:white; padding:20px; text-align:center; border-radius:8px; }
    .footer { text-align:center; padding:20px; color:#888; font-size:12px; background:#f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size:28px;">ĐẶT VÉ THÀNH CÔNG!</h1>
      <p style="font-size:18px; margin-top:10px;">Mã vé: <strong>${
        bookingData.id
      }</strong></p>
    </div>
    <div class="content">
      <div style="text-align:center; margin-bottom:20px;">
        <img src="${movieRes.data.thumbnail || ""}" alt="${
              movieRes.data.title
            }" style="max-width:100%; height:auto; border-radius:8px;" />
      </div>
      <h2 style="text-align:center; color:#4c1d95; margin:20px 0;">${
        movieRes.data.title
      }</h2>

      <table>
        <tr><td><strong>Ngày chiếu:</strong></td><td>${formattedDate}</td></tr>
        <tr><td><strong>Giờ chiếu:</strong></td><td>${formattedTime}</td></tr>
        <tr><td><strong>Rạp:</strong></td><td>${
          cinemaRes.data.name
        }<br><small>${cinemaRes.data.address}</small></td></tr>
        <tr><td><strong>Phòng chiếu:</strong></td><td>${
          roomRes.data.name
        }</td></tr>
      </table>

      <h3 style="text-align:center; color:#4c1d95; margin:30px 0 15px;">Ghế đã chọn</h3>
      <table>${seatRows}</table>

      ${
        foodDrinks.length > 0
          ? `
      <h3 style="text-align:center; color:#4c1d95; margin:30px 0 15px;">Combo đồ ăn & nước uống</h3>
      <table>${foodRows}</table>
      `
          : ""
      }

      <div class="qr">
        <p style="color:#555; margin-bottom:15px;">Quét mã QR này tại quầy để check-in nhanh chóng</p>
        <img src="${emailQrUrl}" alt="QR Code vé ${
              bookingData.id
            }" style="width:250px; height:250px; border:1px solid #ddd; padding:10px; background:white;" />
      </div>

      <div class="total">
        <div style="font-size:20px;">Tổng thanh toán</div>
        <div style="font-size:32px; font-weight:bold;">
          ${new Intl.NumberFormat("vi-VN").format(bookingData.totalPrice)} ₫
        </div>
        ${
          method
            ? `<div style="margin-top:10px;">Phương thức thanh toán: ${method}</div>`
            : ""
        }
      </div>

      <p style="text-align:center; margin-top:30px; color:#555;">
        Vui lòng xuất trình mã vé hoặc QR code khi vào rạp.<br>
        <strong>Chúc Quý khách xem phim vui vẻ!</strong>
      </p>
    </div>
    <div class="footer">
      Email được gửi tự động từ hệ thống đặt vé phim.<br>
      Vui lòng không trả lời email này.
    </div>
  </div>
</body>
</html>`;

            await sendEmailNotification(
              profile.email,
              `Vé phim - Mã vé ${bookingData.id}`,
              htmlContent
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
        setLoadError("Không thể tải thông tin vé. Vui lòng thử lại sau.");
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
        maxHeight / canvas.height
      );
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;

      pdf.addImage(imgData, "PNG", margin, margin, width, height);
      pdf.save(`Ve-phim-${booking.id}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    }
  };

  if (verifying || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-6 text-white">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
        <p className="text-2xl">
          {verifying
            ? "Đang xác thực thanh toán..."
            : "Đang tải thông tin vé..."}
        </p>
        {method && (
          <p className="text-lg opacity-80">Phương thức thanh toán: {method}</p>
        )}
      </div>
    );
  }

  if (verifyError || loadError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/80 border border-red-700 rounded-2xl p-10 max-w-lg text-center text-white">
          <XCircle className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Thanh toán thất bại</h1>
          <p className="text-xl mb-8">{verifyError || loadError}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!booking || !showtime || !movie || !cinema || !room || !qrUrl)
    return null;

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-8 px-4 pb-32">
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-8 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">ĐẶT VÉ THÀNH CÔNG!</h1>
            <p className="text-xl flex items-center justify-center gap-2">
              <Ticket className="w-8 h-8" />
              Mã vé: <span className="font-mono text-2xl">{booking.id}</span>
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div>
                <Image
                  src={movie.thumbnail || "/placeholder-poster.jpg"}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="rounded-xl shadow-lg w-full object-cover"
                />
              </div>

              <div className="md:col-span-2 space-y-6">
                <h2 className="text-3xl font-bold">{movie.title}</h2>

                <div className="grid grid-cols-2 gap-6 text-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-gray-600">Ngày chiếu</p>
                      <p className="font-bold">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-gray-600">Giờ chiếu</p>
                      <p className="font-bold">{formattedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-gray-600">Rạp</p>
                      <p className="font-bold">{cinema.name}</p>
                      <p className="text-sm text-gray-500">{cinema.address}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Phòng chiếu</p>
                    <p className="font-bold">{room.name}</p>
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
                      {selectedSeatsDetails.map((s, i) => (
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
                      src={qrUrl}
                      alt="QR Code vé"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                    <p className="text-center mt-3 text-sm text-gray-600">
                      Quét mã này tại quầy
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {foodDrinks.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 justify-center">
                  <Popcorn className="w-8 h-8 text-yellow-500" />
                  Combo đồ ăn & nước uống
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {foodDrinks.map((item, i) => (
                    <div
                      key={i}
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
                {new Intl.NumberFormat("vi-VN").format(booking.totalPrice)} ₫
              </p>
              {method && (
                <p className="mt-4 text-xl">Phương thức thanh toán: {method}</p>
              )}
            </div>

            <div className="text-center mt-12 text-gray-600">
              <p className="mt-2">
                Xuất trình mã vé hoặc QR code tại quầy khi vào rạp.
              </p>
              <p className="mt-4 font-semibold">
                Chúc Quý khách xem phim vui vẻ!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          ref={printableRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "15mm",
            background: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "12pt",
            color: "#333",
            boxSizing: "border-box",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1 style={{ color: "#6b21a8", fontSize: "28pt", margin: 0 }}>
              ĐẶT VÉ THÀNH CÔNG!
            </h1>
            <p style={{ fontSize: "18pt", margin: "10px 0" }}>
              Mã vé: <strong>{booking.id}</strong>
            </p>
          </div>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Image
              src={movie.thumbnail || "/placeholder-poster.jpg"}
              alt={movie.title}
              width={280}
              height={420}
              style={{ maxWidth: "280px", height: "auto", borderRadius: "8px" }}
            />
          </div>

          <h2
            style={{
              textAlign: "center",
              color: "#4c1d95",
              fontSize: "20pt",
              margin: "20px 0",
            }}
          >
            {movie.title}
          </h2>

          <table style={{ width: "100%", margin: "20px 0" }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold", padding: "6px 0" }}>
                  Ngày chiếu:
                </td>
                <td style={{ padding: "6px 0" }}>{formattedDate}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "6px 0" }}>
                  Giờ chiếu:
                </td>
                <td style={{ padding: "6px 0" }}>{formattedTime}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "6px 0" }}>Rạp:</td>
                <td style={{ padding: "6px 0" }}>
                  {cinema.name}
                  <br />
                  <small style={{ color: "#666" }}>{cinema.address}</small>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "6px 0" }}>
                  Phòng chiếu:
                </td>
                <td style={{ padding: "6px 0" }}>{room.name}</td>
              </tr>
            </tbody>
          </table>

          <h3
            style={{
              textAlign: "center",
              color: "#4c1d95",
              margin: "30px 0 15px",
            }}
          >
            Ghế đã chọn
          </h3>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  Số ghế
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  Loại
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "6px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  Giá
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedSeatsDetails.map((s) => (
                <tr key={s.seatNumber}>
                  <td
                    style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}
                  >
                    {s.seatNumber}
                  </td>
                  <td
                    style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}
                  >
                    {s.type}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "6px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN").format(s.price)} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {foodDrinks.length > 0 && (
            <>
              <h3
                style={{
                  textAlign: "center",
                  color: "#4c1d95",
                  margin: "30px 0 15px",
                }}
              >
                Combo đồ ăn & nước uống
              </h3>
              <table style={{ width: "100%" }}>
                <tbody>
                  {foodDrinks.map((item) => (
                    <tr key={item.id}>
                      <td
                        style={{
                          padding: "6px 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <strong>{item.name}</strong>
                        <br />
                        <small style={{ color: "#666" }}>
                          SL: {item.quantity}
                        </small>
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: "6px 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {new Intl.NumberFormat("vi-VN").format(item.totalPrice)}{" "}
                        ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <div style={{ textAlign: "center", margin: "40px 0" }}>
            <Image
              src={qrUrl}
              alt="QR Code vé"
              width={200}
              height={200}
              style={{ margin: "0 auto" }}
            />
            <p style={{ marginTop: "10px", color: "#555" }}>
              Quét mã này tại quầy
            </p>
          </div>

          <div
            style={{
              background: "#4c1d95",
              color: "white",
              padding: "20px",
              textAlign: "center",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "18pt" }}>Tổng thanh toán</div>
            <div style={{ fontSize: "32pt", fontWeight: "bold" }}>
              {new Intl.NumberFormat("vi-VN").format(booking.totalPrice)} ₫
            </div>
            {method && (
              <div style={{ marginTop: "10px" }}>
                Phương thức thanh toán: {method}
              </div>
            )}
          </div>

          <p style={{ textAlign: "center", marginTop: "30px", color: "#555" }}>
            Vui lòng xuất trình mã vé hoặc QR code tại quầy khi vào rạp.
            <br />
            <strong>Chúc Quý khách xem phim vui vẻ!</strong>
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-10">
        <div className="max-w-4xl mx-auto flex gap-4 justify-center items-center">
          <button
            onClick={downloadPDF}
            className="flex-1 flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition"
          >
            <Download className="w-6 h-6" /> Tải vé PDF
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-4 rounded-xl font-bold transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </>
  );
}
