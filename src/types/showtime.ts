import { PaginatedResponse } from "./pagination";

export interface Showtime {
  id: string;
  movieId: string;
  roomId: string;
  cinemaId: string;
  startTime: string;
  endTime: string;
  price: number;
  language: string;
  subtitle: boolean;
  format: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedShowtimeResponse = PaginatedResponse<Showtime>;
