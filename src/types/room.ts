export interface HoldSeatPayload {
  showtimeId: string;
  seatId: string;
}

export type SeatType = "NORMAL" | "VIP" | "COUPLE" | "EMPTY";

export type SeatCell = {
  row: string;
  col: number;
  type: SeatType;
};

export type SeatModal = {
  id: string;
  seatNumber: string;
  roomId: string;
  seatType: SeatType;
  createdAt: string;
  updatedAt: string;
  extraPrice: number;
};

export type Room = {
  id: string;
  name: string;
  cinemaId: string;
  totalSeats?: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  seatLayout?: SeatCell[];
  seats: SeatModal[];
  VIP?: number;
  COUPLE?: number;
};

export type HeldSeatResponse = {
  seatId: string;
  extraPrice: number;
  showtimeId?: string;
  userId: string;
};

export interface BookingSeat {
  id: string;
  seatId: string;
  showtimeId: string;
}
