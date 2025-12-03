export enum MovieStatus {
  COMING_SOON = "COMING_SOON",
  NOW_SHOWING = "NOW_SHOWING",
  ENDED = "ENDED",
}

export interface Genre {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  description?: string;
  poster?: string;
  trailer?: string;
  duration: number; // in minutes
  rating: number;
  releaseDate: string;
  status: MovieStatus;
  genres: Genre[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MoviesResponse {
  data: Movie[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
