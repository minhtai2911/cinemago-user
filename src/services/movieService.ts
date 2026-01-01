import { fetcher } from "@/lib/fetcher";
import { MovieStatus } from "@/types";

export const getMovies = async (
  page?: number,
  limit?: number,
  search?: string,
  rating?: number,
  genresQuery?: string,
  isActive?: boolean,
  status?: MovieStatus
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
        status: status ? status.toString() : "",
      })
  );
};

export const getMovieById = async (movieId: string) => {
  return fetcher(`v1/movies/public/${movieId}`);
};

export const getTopRatedMovies = async (limit: number) => {
  return fetcher(
    "v1/movies/public/top-rated?" +
      new URLSearchParams({ limit: limit.toString() })
  );
};
