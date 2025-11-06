import { fetcher } from "@/lib/fetcher";

export const getGenres = async (
  page?: number,
  limit?: number,
  search?: string,
  isActive?: boolean
) => {
  return fetcher(
    "v1/genres/public/?" +
      new URLSearchParams({
        page: page?.toString() || "",
        limit: limit?.toString() || "",
        search: search || "",
        isActive: isActive !== undefined ? isActive.toString() : "",
      })
  );
};

export const getGenreById = async (genreId: string) => {
  return fetcher(`v1/genres/public/${genreId}`);
};
