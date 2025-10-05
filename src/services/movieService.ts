import { fetcher } from "@/lib/fetcher";

export const getMovies = async (
  page?: number,
  limit?: number,
  search?: string,
  rating?: number,
  genresQuery?: string,
  isActive?: boolean
) => {
  return fetcher(
    "v1/movies/public/?" +
      new URLSearchParams({
        page: page?.toString() || "",
        limit: limit?.toString() || "",
        search: search || "",
        rating: rating?.toString() || "",
        genres: genresQuery || "",
        isActive: isActive !== undefined ? isActive.toString() : "",
      })
  );
};
