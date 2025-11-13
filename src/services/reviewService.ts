import { fetcher } from "@/lib/fetcher";
import axiosInstance from "@/lib/axiosInstance";

export const getReviews = async (
  page = 1,
  limit = 5,
  movieId?: string,
  rating?: number,
  userId?: string,
  type?: string,
  status?: string,
  isActive?: boolean
) => {
  const query = `
    query GetReviews(
      $page: Int
      $limit: Int
      $movieId: String
      $rating: Float
      $userId: String
      $type: String
      $status: String
      $isActive: Boolean
    ) {
      getReviews(
        page: $page
        limit: $limit
        movieId: $movieId
        rating: $rating
        userId: $userId
        type: $type
        status: $status
        isActive: $isActive
      ) {
        pagination {
          totalItems
          totalPages
          currentPage
          pageSize
          hasNextPage
          hasPrevPage
        }
        data {
          id
          userId
          movieId
          content
          rating
          type
          status
          isActive
          createdAt
          updatedAt
          response {
            content
            createdAt
          }
        }
      }
    }
  `;

  const variant = {
    page,
    limit,
    movieId,
    rating,
    userId,
    type,
    status,
    isActive,
  };

  return fetcher("v1/reviews", {
    method: "POST",
    body: JSON.stringify({ query, variables: { ...variant } }),
  });
};

export const getReviewById = async (reviewId: string) => {
  const query = `
    query GetReviewById($reviewId: String!) {
      getReviewById(reviewId: $reviewId) {
        id
        userId
        movieId
        content
        rating
        type
        status
        isActive
        response {
          content
          createdAt
        }
      }
    }
  `;

  return fetcher("v1/reviews", {
    method: "POST",
    body: JSON.stringify({ query, variables: { reviewId } }),
  });
};

export const replyToReview = async (reviewId: string, content: string) => {
  const mutation = `
    mutation ReplyToReview($reviewId: String!, $content: String!) {
      replyToReview(reviewId: $reviewId, content: $content) {
        id
        response {
          content
          createdAt
        }
      }
    }
  `;

  return axiosInstance.post("/v1/reviews", {
    query: mutation,
    variables: { reviewId, content },
  });
};
