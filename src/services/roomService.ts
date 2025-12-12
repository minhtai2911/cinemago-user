import { fetcher } from "@/lib/fetcher";
import axiosInstance from "@/lib/axiosInstance";
import { HoldSeatPayload } from "@/types";

export const getRooms = async (
  page?: number,
  limit?: number,
  search?: string,
  isActive?: boolean,
  startTime?: Date,
  endTime?: Date,
  cinemaId?: string
) => {
  return fetcher(
    "v1/rooms/public/?" +
      new URLSearchParams({
        page: page?.toString() || "",
        limit: limit?.toString() || "",
        search: search || "",
        isActive: isActive !== undefined ? isActive.toString() : "",
        startTime: startTime ? startTime.toISOString() : "",
        endTime: endTime ? endTime.toISOString() : "",
        cinemaId: cinemaId || "",
      })
  );
};

export const getRoomById = async (roomId: string) => {
  return fetcher(`v1/rooms/public/${roomId}`);
};

export const holdSeat = async (data: HoldSeatPayload) => {
  return axiosInstance.post(`v1/rooms/hold-seat`, data);
};

export const releaseSeat = async (data: HoldSeatPayload) => {
  return axiosInstance.post(`v1/rooms/release-seat`, data);
};

export const getHeldSeats = async (showtimeId: string) => {
  return axiosInstance.get(`v1/rooms/${showtimeId}/hold-seat`);
};
