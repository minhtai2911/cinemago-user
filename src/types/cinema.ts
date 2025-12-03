import { PaginatedResponse } from "./pagination";

export interface Cinema {
  id: string;
  name: string;
  address: string;
  city: string;
  isActive: boolean;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedCinemaResponse = PaginatedResponse<Cinema>;
