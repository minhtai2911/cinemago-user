import axiosInstance from "@/lib/axiosInstance";
import { fetcher } from "@/lib/fetcher";

export const getBookingsByUserId = async (page?: number, limit?: number) => {
  return axiosInstance.get(
    "/v1/bookings/?" +
      new URLSearchParams({
        page: page?.toString() || "",
        limit: limit?.toString() || "",
      })
  );
};

export const getBookingById = async (bookingId: string) => {
  return axiosInstance.get(`/v1/bookings/${bookingId}`);
};

export const getBookingSeatsByShowTimeId = async (showtimeId: string) => {
  return fetcher(`v1/bookings/public/${showtimeId}/booking-seat`);
};
