import { PaginatedResponse } from "./pagination";

export interface Booking {
  id: string;
  userId: string;
  showtimeId: string;
  type: string;
  totalPrice: number;
  cinemaId: string;
  paymentMethod: string;
  status: string;
  bookingSeats: Array<{
    id: string;
    seatId: string;
  }>;
  bookingFoodDrinks: Array<{
    id: string;
    foodDrinkId: string;
    quantity: number;
    totalPrice: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedBookingResponse = PaginatedResponse<Booking>;