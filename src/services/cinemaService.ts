import { fetcher } from "@/lib/fetcher";

export const getCinemas = async (
  page?: number,
  limit?: number,
  search?: string,
  isActive?: boolean
) => {
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

export const getCinemaById = async (cinemaId: string) => {
  return fetcher(`v1/cinemas/public/${cinemaId}`);
};
