import { PaginatedResponse } from "./pagination";

export interface ReviewResponse {
  userId: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  content: string;
  rating: number;
  type: string;
  response?: ReviewResponse[];
  createdAt: string;
  updatedAt: string;
  status: string;
  isActive: boolean;
}

export type PaginatedReviewResponse = PaginatedResponse<Review>;
