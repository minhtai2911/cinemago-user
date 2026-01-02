"use client";

import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import MovieInfo from "@/components/movie/MovieInfo";
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
  Room,
  Cinema,
  FoodDrink,
  FoodSelection,
  HeldSeatResponse,
  BookingSeat,
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
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

const TICKET_TO_SEAT_MAP: Record<TicketType, string> = {
  STANDARD: "NORMAL",
  VIP: "VIP",
  COUPLE: "COUPLE",
};

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movie");
  const dateParam = searchParams.get("date");
  const cinemaParam = searchParams.get("cinema");
  const showtimeParam = searchParams.get("showtime");
  const { isLogged, profile } = useAuth();

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
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [heldSeats, setHeldSeats] = useState<string[]>([]);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  const [foods, setFoods] = useState<FoodDrink[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodSelection[]>([]);

  const ticketSectionRef = useRef<HTMLDivElement>(null);

  const socketRef = useRef<Socket | null>(null);

  const chosenSeatsRef = useRef<RenderSeat[]>([]);
  useEffect(() => {
    chosenSeatsRef.current = chosenSeats;
  }, [chosenSeats]);

  useEffect(() => {
    if (!selectedShowtime) {
      return;
    }

    const fetchInitialStatus = async () => {
      try {
        const showtimeId = selectedShowtime.id;

        const [holdRes, bookRes] = await Promise.all([
          getHeldSeats(showtimeId),
          getBookingSeatsByShowTimeId(showtimeId),
        ]);

        const bookedData = bookRes.data || [];
        const bookedIds = Array.isArray(bookedData)
          ? bookedData.map((i: BookingSeat) => i.seatId)
          : [];

        const heldData = holdRes.data.data || [];

        let earliestExpiresAt: Date | null = null;
        const myChosenSeatsToRestore: RenderSeat[] = [];

        for (const heldSeat of heldData) {
          if (heldSeat.userId === profile?.id) {
            const seatId = heldSeat.seatId;

            const seatInLayout = enrichedLayout.find(
              (s) => s.id === seatId || s.secondId === seatId
            );

            if (seatInLayout) {
              const mainSeat =
                seatInLayout.secondId === seatId ? seatInLayout : seatInLayout;

              if (!myChosenSeatsToRestore.some((s) => s.id === mainSeat.id)) {
                myChosenSeatsToRestore.push(mainSeat);
              }
            }

            const expiresAt = new Date(heldSeat.expiresAt);
            if (!earliestExpiresAt || expiresAt < earliestExpiresAt) {
              earliestExpiresAt = expiresAt;
            }
          }
        }

        if (myChosenSeatsToRestore.length > 0) {
          setChosenSeats(myChosenSeatsToRestore);
        } else {
          setChosenSeats([]);
        }

        if (myChosenSeatsToRestore.length > 0 && selectedRoom) {
          const ticketCount: Record<TicketType, number> = {
            STANDARD: 0,
            VIP: 0,
            COUPLE: 0,
          };

          myChosenSeatsToRestore.forEach((seat) => {
            if (seat.type === "COUPLE") {
              ticketCount.COUPLE += 1;
            } else if (seat.type === "VIP") {
              ticketCount.VIP += 1;
            } else {
              ticketCount.STANDARD += 1;
            }
          });

          const basePrice = selectedShowtime.price;
          const vipExtra = selectedRoom.VIP || 0;
          const coupleExtra = selectedRoom.COUPLE || 0;

          const restoredTickets: TicketSelection[] = [];

          if (ticketCount.STANDARD > 0) {
            restoredTickets.push({
              type: "STANDARD",
              quantity: ticketCount.STANDARD,
              price: basePrice,
              name: "Người lớn",
            });
          }
          if (ticketCount.VIP > 0) {
            restoredTickets.push({
              type: "VIP",
              quantity: ticketCount.VIP,
              price: basePrice + vipExtra,
              name: "Ghế VIP",
            });
          }
          if (ticketCount.COUPLE > 0) {
            restoredTickets.push({
              type: "COUPLE",
              quantity: ticketCount.COUPLE,
              price: (basePrice + coupleExtra) * 2,
              name: "Ghế Đôi",
            });
          }

          setSelectedTickets(restoredTickets);
        } else {
          setSelectedTickets([]);
        }

        const othersHeldIds = heldData
          .filter((i: HeldSeatResponse) => i.userId !== profile?.id)
          .map((i: HeldSeatResponse) => i.seatId);

        setHeldSeats(othersHeldIds);
        setBookedSeats(bookedIds);

        if (earliestExpiresAt && myChosenSeatsToRestore.length > 0) {
          const now = Date.now();
          const remainingSeconds = Math.max(
            0,
            Math.floor((earliestExpiresAt.getTime() - now) / 1000)
          );

          if (remainingSeconds === 0) {
            setChosenSeats([]);
            setHeldSeats(othersHeldIds);
          } else {
            setHoldTimer(remainingSeconds - 30);
          }
        } else {
          setHoldTimer(null);
        }
      } catch (e) {
        console.error("Failed to fetch initial seat status", e);
        toast.error("Không thể tải trạng thái ghế");
      }
    };

    fetchInitialStatus();

    socketRef.current = io(SOCKET_URL, {
      path: "/socket.io",
      withCredentials: true,
    });

    socketRef.current.emit("join-showtime", selectedShowtime.id);

    socketRef.current.on(
      "seat-update",
      (data: { showtimeId: string; seatId: string; status: string }) => {
        if (data.showtimeId !== selectedShowtime.id) return;

        if (data.status === "released") {
          const isMySeat = chosenSeatsRef.current.some(
            (s) => s.id === data.seatId || s.secondId === data.seatId
          );

          if (isMySeat) {
            setChosenSeats((prev) =>
              prev.filter(
                (s) => s.id !== data.seatId && s.secondId !== data.seatId
              )
            );
          }
        }

        setHeldSeats((prev) => {
          if (data.status === "held") {
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

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-showtime", selectedShowtime.id);
        socketRef.current.disconnect();
      }
    };
  }, [selectedShowtime, profile, enrichedLayout, selectedRoom]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        if (!movieId) return;

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
      if (!movieId) {
        return;
      }

      setLoading(true);

      const startTime = new Date();
      startTime.setHours(0, 0, 0, 0);

      try {
        const res = await getShowtimes(
          undefined,
          undefined,
          movieId,
          undefined,
          true,
          startTime
        );

        setShowtimes(res.data || []);
      } catch {
        toast.error("Lỗi tải suất chiếu phim");
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
    setSelectedShowtime(st);
    if (cinema) {
      setSelectedCinema(cinema);
    } else if (!selectedCinema && st.cinemaId) {
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

        const merged = mergeSeatData(
          res.data.seatLayout || [],
          res.data.seats || []
        );
        setEnrichedLayout(merged);
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

      if (delta < 0) {
        const seatType = TICKET_TO_SEAT_MAP[type];

        const seatsOfType = chosenSeats.filter((s) => s.type === seatType);

        if (seatsOfType.length > newQty) {
          toast.warning(
            `Vui lòng bỏ chọn ${
              seatsOfType.length - newQty
            } ghế trước khi giảm số lượng vé.`
          );
          return prev;
        }
      }

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
        await Promise.all(
          idsToToggle.map((id) =>
            releaseSeat({
              showtimeId: showtimeIdStr,
              seatId: id,
            })
          )
        );

        setChosenSeats((prev) => prev.filter((s) => s.id !== seat.id));

        setHeldSeats((prev) => prev.filter((id) => !idsToToggle.includes(id)));
      } else {
        await Promise.all(
          idsToToggle.map((id) =>
            holdSeat({
              showtimeId: showtimeIdStr,
              seatId: id,
            })
          )
        );

        setChosenSeats((prev) => [...prev, seat]);

        setHeldSeats((prev) => Array.from(new Set([...prev, ...idsToToggle])));
      }
    } catch (error) {
      console.error("Lỗi giữ ghế:", error);
      toast.error("Ghế này không thể chọn!");
    }
  };

  useEffect(() => {
    if (chosenSeats.length === 1 && holdTimer === null) {
      setHoldTimer(300);
    }
  }, [chosenSeats.length, holdTimer]);

  useEffect(() => {
    if (holdTimer === null || holdTimer <= 0 || !selectedShowtime) return;

    const interval = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev === null || prev <= 1) {
          if (chosenSeatsRef.current.length > 0) {
            const showtimeIdStr = String(selectedShowtime.id);

            chosenSeatsRef.current.forEach((seat) => {
              if (!seat.id) return;

              const ids =
                seat.type === "COUPLE" && seat.secondId
                  ? [seat.id, seat.secondId]
                  : [seat.id];

              ids.forEach(async (id) => {
                await releaseSeat({
                  showtimeId: showtimeIdStr,
                  seatId: id,
                }).catch(() => {});
              });
            });
          }
          return null;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [holdTimer, selectedShowtime]);

  useEffect(() => {
    if (chosenSeats.length === 0 && holdTimer !== null) {
      setHoldTimer(null);
    }
  }, [chosenSeats.length, holdTimer]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await getFoodDrinks({
          page: undefined,
          limit: undefined,
          isAvailable: true,
        });
        const data: FoodDrink[] = res.data || [];

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

  const handleFoodDrinkUpdate = (item: FoodDrink, delta: number) => {
    setSelectedFoods((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = Math.max(0, currentQty + delta);

      const others = prev.filter((c) => c.id !== item.id);

      if (newQty === 0) return others;

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
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#060714] text-white flex items-center justify-center relative overflow-hidden">
        <Image
          width={1000}
          height={1000}
          src="/popcorn.png"
          alt=""
          aria-hidden
          className="hidden lg:block pointer-events-none select-none absolute -left-40 -top-8 w-[180%] opacity-40 -z-20"
          style={{ transform: "scaleX(-1) rotate(-6deg)" }}
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold">Đang tải dữ liệu phim...</h2>
        </div>
      </div>
    );
  }

  if (isLogged === false) {
    return (
      <div className="min-h-screen bg-orange-30 text-black flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold mb-4">
            Vui lòng đăng nhập để đặt vé xem phim
          </h2>
          <p className="text-gray-400 mb-8">
            Bạn cần có tài khoản để tiếp tục quá trình đặt vé.
          </p>
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#060714] text-white relative overflow-hidden">
      <Image
        width={1000}
        height={1000}
        src="/popcorn.png"
        alt=""
        aria-hidden
        className="hidden lg:block pointer-events-none select-none absolute -left-40 -top-8 w-[180%] opacity-40 -z-20"
        style={{ transform: "scaleX(-1) rotate(-6deg)" }}
      />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 pt-[120px]">
        <div className="bg-white rounded-2xl shadow-xl border border-white/30 p-6 md:p-8">
          {/* <MovieDetailCard movie={movie} /> */}
        </div>
        <div className="mt-12">
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
          roomName={selectedRoom?.name}
          selectedSeats={chosenSeats}
          holdTimer={holdTimer}
          selectedFoods={selectedFoods}
          onBook={handleBookTickets}
        />
      )}
    </div>
  );
}
