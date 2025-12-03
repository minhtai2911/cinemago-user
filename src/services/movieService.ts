import { fetcher } from "@/lib/fetcher";
import { Movie, MovieStatus, MoviesResponse } from "@/types";

export const getMovies = async (
  page?: number,
  limit?: number,
  search?: string,
  rating?: number,
  genresQuery?: string,
  isActive?: boolean,
  status?: MovieStatus
): Promise<MoviesResponse> => {
  return fetcher<MoviesResponse>(
    "v1/movies/public/?" +
      new URLSearchParams({
        page: page?.toString() || "1",
        limit: limit?.toString() || "10",
        search: search || "",
        rating: rating?.toString() || "",
        genres: genresQuery || "",
        isActive: isActive !== undefined ? isActive.toString() : "",
        status: status ? status.toString() : "",
      })
  );
};

export const getMovieById = async (movieId: string): Promise<Movie> => {
  return fetcher<Movie>(`v1/movies/public/${movieId}`);
};
