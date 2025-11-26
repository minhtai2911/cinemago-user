import { PaginatedResponse } from "./pagination";

interface UserDetail {
  fullname: string;
  avatarUrl: string;
}
export interface ReviewResponse {
  userDetail: UserDetail;
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
  userDetail: UserDetail;
}

export type PaginatedReviewResponse = PaginatedResponse<Review>;
