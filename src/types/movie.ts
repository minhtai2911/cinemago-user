import { Genre } from "./genres";
import { PaginatedResponse } from "./pagination";

export enum MovieStatus {
  COMING_SOON = "COMING_SOON",
  NOW_SHOWING = "NOW_SHOWING",
  ENDED = "ENDED",
}
export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  rating: number;
  status: MovieStatus;
  thumbnail: string;
  thumbnailPublicId: string;
  trailerUrl: string;
  trailerPublicId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  genres: Genre[];
}

export type PaginatedMovieResponse = PaginatedResponse<Movie>;
