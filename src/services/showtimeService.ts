import { fetcher } from "@/lib/fetcher";

export const getShowtimes = async (
  page?: number,
  limit?: number,
  movieId?: string,
  cinemaId?: string,
  isActive?: boolean,
  startTime?: Date,
  endTime?: Date
) => {
  return fetcher(
    "v1/showtimes/public/?" +
      new URLSearchParams({
        page: page?.toString() || "",
        limit: limit?.toString() || "",
        movieId: movieId || "",
        cinemaId: cinemaId || "",
        isActive: isActive !== undefined ? isActive.toString() : "",
        startTime: startTime ? startTime.toISOString() : "",
        endTime: endTime ? endTime.toISOString() : "",
      })
  );
};

export const getShowtimeById = async (showtimeId: string) => {
  return fetcher(`v1/showtimes/public/${showtimeId}`);
};
