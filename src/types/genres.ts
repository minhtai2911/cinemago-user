import { PaginatedResponse } from "./pagination";

export interface Genre {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedGenreResponse = PaginatedResponse<Genre>;
