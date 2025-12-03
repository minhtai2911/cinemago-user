import { fetcher } from "@/lib/fetcher";
import { PaginatedCinemaResponse, Cinema } from "@/types/cinema";

export const getCinemas = async (
  page?: number,
  limit?: number,
  search?: string,
  isActive?: boolean
): Promise<PaginatedCinemaResponse> => {
  return fetcher(
    "v1/cinemas/public/?" +
      new URLSearchParams({
        page: page?.toString() || "",
        limit: limit?.toString() || "",
        search: search || "",
        isActive: isActive !== undefined ? isActive.toString() : "",
      })
  );
};

export const getCinemaById = async (cinemaId: string): Promise<Cinema> => {
  return fetcher(`v1/cinemas/public/${cinemaId}`);
};
