"use client";

import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import MovieDetail from "@/components/booking/MovieDetail";
import {
  getMovieById,
  getShowtimes,
  getRoomById,
  getFoodDrinks,
  getCinemaById,
  getBookingSeatsByShowTimeId,
  getHeldSeats,
  releaseSeat,
  holdSeat,
} from "@/services";
import type {
  Movie,
  Showtime,
  PaginatedShowtimeResponse,
  Room,
  Cinema,
  SeatCell,
  FoodDrink,
  FoodSelection,
  HeldSeatResponse,
  BookingSeat,
  SeatModal,
} from "@/types";
import ShowtimeList from "@/components/booking/ShowTimeList";
import TicketSelector, {
  TicketSelection,
  TicketType,
} from "@/components/booking/TicketSelector";
import BookingBottomBar from "@/components/booking/BookingBottomBar";
import SeatMap from "@/components/booking/SeatMap";
import FoodDrinkSelector from "@/components/booking/FoodSelector";
import { io, Socket } from "socket.io-client";
import { RenderSeat, mergeSeatData } from "@/utils/seat-helper";
import { toast } from "sonner";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

const TICKET_TO_SEAT_MAP: Record<TicketType, string> = {
  STANDARD: "NORMAL",
  VIP: "VIP",
  COUPLE: "COUPLE",
};

export default function BookingPage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movie");
  const dateParam = searchParams.get("date");
  const cinemaParam = searchParams.get("cinema");
  const showtimeParam = searchParams.get("time");

  const [enrichedLayout, setEnrichedLayout] = useState<RenderSeat[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  );
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection[]>([]);
  const [isRoomLoading, setIsRoomLoading] = useState(false);

  const [chosenSeats, setChosenSeats] = useState<RenderSeat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]); // Ví dụ ghế đã bán
  const [heldSeats, setHeldSeats] = useState<string[]>([]);

  const [foods, setFoods] = useState<FoodDrink[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodSelection[]>([]);

  const ticketSectionRef = useRef<HTMLDivElement>(null);

  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ref lưu chosenSeats để dùng trong cleanup (tránh closure cũ)
  const chosenSeatsRef = useRef<RenderSeat[]>([]);
  useEffect(() => {
    chosenSeatsRef.current = chosenSeats;
  }, [chosenSeats]);

  useEffect(() => {
    if (!selectedShowtime) return;

    // A. Lấy trạng thái ghế ban đầu từ API
    const fetchInitialStatus = async () => {
      try {
        const showtimeId = String(selectedShowtime.id);
        const [holdRes, bookRes] = await Promise.all([
          getHeldSeats(showtimeId),
          getBookingSeatsByShowTimeId(showtimeId),
        ]);

        const bookedData = bookRes.data || [];
        const bookedIds = Array.isArray(bookedData)
          ? bookedData.map((i: BookingSeat) => i.seatId) // Map lấy seatId
          : [];

        const heldData = holdRes.data.data || [];

        const heldIds = Array.isArray(heldData)
          ? heldData.map((i: HeldSeatResponse) => i.seatId)
          : [];
        setBookedSeats(bookedIds);
        setHeldSeats(heldIds);
      } catch (e) {
        console.error("Failed to fetch initial seat status", e);
      }
    };
    fetchInitialStatus();

    // B. Kết nối Socket
    socketRef.current = io(SOCKET_URL, {
      path: "/socket.io",
      withCredentials: true,
    });

    // C. Join Room
    socketRef.current.emit("join-showtime", selectedShowtime.id);

    // D. Lắng nghe sự kiện update
    socketRef.current.on(
      "seat-update",
      (data: { showtimeId: string; seatId: string; status: string }) => {
        if (data.showtimeId !== selectedShowtime.id) return;

        // Nếu ghế này là do MÌNH đang chọn -> Bỏ qua (không cập nhật heldSeats để tránh đổi màu)
        // Logic này quan trọng để UI không bị giật
        if (chosenSeatsRef.current.some((s) => s.id === data.seatId)) {
          return;
        }

        setHeldSeats((prev) => {
          if (data.status === "held") {
            // tránh duplicate
            if (prev.includes(data.seatId)) return prev;
            return [...prev, data.seatId];
          }
          if (data.status === "released") {
            return prev.filter((id) => id !== data.seatId);
          }
          return prev;
        });

        if (data.status === "booked") {
          setBookedSeats((prev) =>
            prev.includes(data.seatId) ? prev : [...prev, data.seatId]
          );
          setHeldSeats((prev) => prev.filter((id) => id !== data.seatId));
        }
      }
    );

    // E. Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-showtime", selectedShowtime.id);
        socketRef.current.disconnect();
      }

      // Release ghế khi rời trang (Optional nhưng nên làm)
      if (chosenSeatsRef.current.length > 0) {
        const showtimeIdStr = String(selectedShowtime.id);

        chosenSeatsRef.current.forEach((seat) => {
          if (!seat.id) return;

          const ids =
            seat.type === "COUPLE" && seat.secondId
              ? [seat.id, seat.secondId]
              : [seat.id];

          ids.forEach((id) => {
            releaseSeat({
              showtimeId: showtimeIdStr,
              seatId: id,
            }).catch(() => {});
          });
        });
      }
    };
  }, [selectedShowtime]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        if (!movieId) return;
        await new Promise((resolve) => setTimeout(resolve, 500));
        const movieRes = await getMovieById(movieId);
        const movieData: Movie | null = movieRes.data || null;

        if (!movieData) {
          return notFound();
        }
        setMovie(movieData);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  useEffect(() => {
    const fetchAllShowtimes = async () => {
      if (!movieId) return;

      setLoading(true);

      // Mảng chứa tổng dữ liệu tích lũy
      let allShowtimes: Showtime[] = [];
      let currentPage = 1;
      let hasNextPage = true;
      const pageSize = 20;
      const startTime = new Date();
      startTime.setHours(0, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setDate(endTime.getDate() + 3);
      endTime.setHours(23, 59, 59, 999);

      try {
        while (hasNextPage) {
          // getShowtimes(page, limit, movieId, cinemaId, isActive, startTime, endTime)
          const res = await getShowtimes(
            currentPage,
            pageSize,
            movieId,
            undefined,
            true,
            startTime,
            endTime
          );

          const payload = res as unknown as PaginatedShowtimeResponse;

          if (payload && payload.data) {
            allShowtimes = [...allShowtimes, ...payload.data];

            if (payload.pagination.hasNextPage) {
              currentPage++;
            } else {
              hasNextPage = false;
            }
          } else {
            hasNextPage = false;
          }
        }

        setShowtimes(allShowtimes);

        console.log("Tổng số suất chiếu lấy được:", allShowtimes.length);
      } catch (error) {
        console.error("Lỗi khi lấy lịch chiếu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllShowtimes();
  }, [movieId]);

  useEffect(() => {
    const fetchCinemaFromUrl = async () => {
      if (cinemaParam) {
        try {
          const res = await getCinemaById(cinemaParam);
          if (res.data) {
            setSelectedCinema(res.data as Cinema);
          }
        } catch (error) {
          console.error("Lỗi tải thông tin rạp ban đầu:", error);
        }
      }
    };
    fetchCinemaFromUrl();
  }, [cinemaParam]);

  const handleSelectShowtime = async (st: Showtime, cinema: Cinema | null) => {
    console.log("User đã chọn suất chiếu:", st);

    setSelectedShowtime(st);
    if (cinema) {
      setSelectedCinema(cinema);
    } else if (!selectedCinema && st.cinemaId) {
      // Fallback: Nếu chưa có cinema nào và con cũng ko truyền, tự fetch lại
      try {
        const res = await getCinemaById(st.cinemaId);
        if (res.data) setSelectedCinema(res.data as Cinema);
      } catch {}
    }
    setSelectedTickets([]);
    setIsRoomLoading(true);
    try {
      const res = await getRoomById(st.roomId);
      if (res.data) {
        setSelectedRoom(res.data);
        console.log(res.data);
        const merged = mergeSeatData(
          res.data.seatLayout || [],
          res.data.seats || []
        );
        setEnrichedLayout(merged);
        // Scroll xuống phần chọn vé sau khi có dữ liệu
        setTimeout(() => {
          ticketSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin phòng:", error);
    } finally {
      setIsRoomLoading(false);
    }
  };

  const handleTicketQuantityChange = (type: TicketType, delta: number) => {
    if (!selectedShowtime || !selectedRoom) return;

    const basePrice = selectedShowtime.price;
    // Map giá (Giả sử bạn đã có logic này)
    const priceMap = {
      STANDARD: basePrice,
      VIP: basePrice + (selectedRoom.VIP || 0),
      COUPLE: (basePrice + (selectedRoom.COUPLE || 0)) * 2,
    };
    const nameMap = {
      STANDARD: "Người lớn",
      VIP: "Ghế VIP",
      COUPLE: "Ghế Đôi",
    };

    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.type === type);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = Math.max(0, currentQty + delta);

      // NẾU GIẢM VÉ: Phải bỏ bớt ghế đã chọn (nếu thừa)
      if (delta < 0) {
        // Map loại vé sang loại ghế để lọc
        const seatType = TICKET_TO_SEAT_MAP[type]; // "NORMAL", "VIP", "COUPLE"

        const seatsOfType = chosenSeats.filter((s) => s.type === seatType);

        if (seatsOfType.length > newQty) {
          // Xóa bớt ghế thừa (lấy những ghế chọn sau cùng xóa trước)
          const seatsToRemoveCount = seatsOfType.length - newQty;
          const seatsToRemove = seatsOfType.slice(-seatsToRemoveCount);

          // Cập nhật lại chosenSeats
          setChosenSeats((current) =>
            current.filter((s) => !seatsToRemove.includes(s))
          );
        }
      }

      // ... cập nhật state tickets như cũ ...
      const otherTickets = prev.filter((t) => t.type !== type);
      if (newQty === 0) return otherTickets;

      return [
        ...otherTickets,
        {
          type,
          quantity: newQty,
          price: priceMap[type],
          name: nameMap[type],
        },
      ];
    });
  };

  // --- LOGIC 2: Khi click ghế (Chỉ toggle chọn/bỏ chọn) ---
  const handleSeatToggle = async (seat: RenderSeat) => {
    if (!selectedShowtime || !seat.id) return;

    const showtimeIdStr = String(selectedShowtime.id);
    const idsToToggle =
      seat.type === "COUPLE" && seat.secondId
        ? [seat.id, seat.secondId]
        : [seat.id];
    const isSelected = chosenSeats.some((s) => s.id === seat.id);

    try {
      if (isSelected) {
        // --- BỎ CHỌN: release TẤT CẢ ghế trong cặp ---
        await Promise.all(
          idsToToggle.map((id) =>
            releaseSeat({
              showtimeId: showtimeIdStr,
              seatId: id,
            })
          )
        );

        // UI: xoá 1 RenderSeat (vì ghế đôi đã merge thành 1 item)
        setChosenSeats((prev) => prev.filter((s) => s.id !== seat.id));

        // Xoá cả 2 id khỏi danh sách held
        setHeldSeats((prev) => prev.filter((id) => !idsToToggle.includes(id)));

        console.log("Đã bỏ chọn ghế:", seat.displayLabel || seat.seatNumber);
      } else {
        // --- CHỌN: hold TẤT CẢ ghế trong cặp ---
        await Promise.all(
          idsToToggle.map((id) =>
            holdSeat({
              showtimeId: showtimeIdStr,
              seatId: id,
            })
          )
        );

        // UI: thêm 1 RenderSeat (đại diện cho cặp)
        setChosenSeats((prev) => [...prev, seat]);

        // Thêm đủ 2 id vào heldSeats, tránh trùng
        setHeldSeats((prev) => Array.from(new Set([...prev, ...idsToToggle])));

        console.log("Đã chọn ghế:", seat.displayLabel || seat.seatNumber);
      }
    } catch (error) {
      console.error("Lỗi giữ ghế:", error);
      toast.error("Ghế này không thể chọn!");
    }
  };

  // --- USE EFFECT FETCH food ---
  useEffect(() => {
    // Chỉ cần gọi 1 lần khi mount hoặc có thể gọi lại nếu cần thiết
    const fetchFoods = async () => {
      try {
        // Param: page, limit, isAvailable=true
        // Giả sử API getConcessions nhận params object
        const res = await getFoodDrinks({
          page: 1,
          limit: 100,
          isAvailable: true,
        });
        const data: FoodDrink[] = res.data || [];

        // SORT: COMBO -> SNACK -> DRINK
        const sortOrder: Record<string, number> = {
          COMBO: 1,
          SNACK: 2,
          DRINK: 3,
        };

        const sortedData = data.sort((a, b) => {
          const orderA = sortOrder[a.type] || 99;
          const orderB = sortOrder[b.type] || 99;
          return orderA - orderB;
        });

        setFoods(sortedData);
      } catch (error) {
        console.error("Lỗi lấy danh sách bắp nước:", error);
      }
    };

    fetchFoods();
  }, []);

  // --- HÀM XỬ LÝ CHỌN BẮP NƯỚC ---
  const handleFoodDrinkUpdate = (item: FoodDrink, delta: number) => {
    setSelectedFoods((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = Math.max(0, currentQty + delta);

      const others = prev.filter((c) => c.id !== item.id);

      if (newQty === 0) return others;

      // Giữ nguyên thứ tự hiển thị hoặc đẩy cái mới chọn xuống cuối (ở đây dùng spread đơn giản)
      return [...others, { ...item, quantity: newQty }];
    });
  };

  const handleBookTickets = () => {
    console.log("Tiến hành đặt vé:", {
      movie: movie?.title,
      showtime: selectedShowtime?.id,
      tickets: selectedTickets,
      seats: chosenSeats,
      foods: selectedFoods,
    });

    // Chuyển hướng sang trang chọn ghế hoặc thanh toán
    // Ví dụ: router.push(`/booking/seat?showtimeId=${selectedShowtime?.id}&tickets=${JSON.stringify(selectedTickets)}`)
    alert("Chuyển sang trang chọn ghế...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="animate-pulse">Đang tải dữ liệu phim...</div>
      </div>
    );
  }

  if (!movieId || !movie) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Đang tải dữ liệu phim...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 pt-[120px]">
        <MovieDetail movie={movie} />

        <div className="mt-12">
          {/* Truyền showtimes đã fetch được xuống component hiển thị */}
          <ShowtimeList
            showtimes={showtimes}
            preSelectedDate={dateParam || undefined}
            preSelectedCinemaId={cinemaParam || undefined}
            preSelectedShowtimeId={showtimeParam || undefined}
            onSelectShowtime={handleSelectShowtime}
          />
        </div>

        <div ref={ticketSectionRef} className="mt-12 scroll-mt-24">
          {isRoomLoading && (
            <div className="text-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-400">Đang tải thông tin vé...</p>
            </div>
          )}

          {!isRoomLoading && selectedShowtime && selectedRoom && (
            <>
              <TicketSelector
                showtime={selectedShowtime}
                room={selectedRoom}
                selectedTickets={selectedTickets}
                onUpdate={handleTicketQuantityChange}
              />

              {/* Luôn hiển thị SeatMap */}
              <SeatMap
                seatLayout={enrichedLayout || []}
                bookedSeats={bookedSeats}
                heldSeats={heldSeats}
                selectedTickets={selectedTickets}
                chosenSeats={chosenSeats}
                onToggleSeat={handleSeatToggle}
              />

              <div className="mt-12">
                <FoodDrinkSelector
                  items={foods}
                  selectedItems={selectedFoods}
                  onUpdate={handleFoodDrinkUpdate}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {selectedShowtime && movie && (
        <BookingBottomBar
          movie={movie}
          showtime={selectedShowtime}
          cinema={selectedCinema}
          selectedTickets={selectedTickets}
          roomName={selectedRoom?.name} // Tên phòng chiếu
          selectedSeats={chosenSeats}
          selectedFoods={selectedFoods}
          onBook={handleBookTickets}
        />
      )}
    </div>
  );
}
