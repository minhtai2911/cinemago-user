import { fetcher } from "@/lib/fetcher";
import axiosInstance from "@/lib/axiosInstance";

interface GetFoodDrinksParams {
  page?: number;
  limit?: number;
  isAvailable?: boolean;
  cinemaId?: string;
}

export const getFoodDrinks = async (params?: GetFoodDrinksParams) => {
  const { page, limit, isAvailable, cinemaId } = params || {};
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());
  if (limit) searchParams.append("limit", limit.toString());
  if (cinemaId) searchParams.append("cinemaId", cinemaId);
  if (isAvailable !== undefined)
    searchParams.append("isAvailable", isAvailable.toString());

  return fetcher(`v1/food-drinks/public/?${searchParams.toString()}`);
};

export const getFoodDrinkByIds = async (foodDrinkIds: string[]) => {
  return axiosInstance.post("/v1/food-drinks/public/by-ids", {
    ids: foodDrinkIds,
  });
};

export const getFoodDrinkById = async (foodDrinkId: string) => {
  return fetcher(`v1/food-drinks/public/${foodDrinkId}`);
};
