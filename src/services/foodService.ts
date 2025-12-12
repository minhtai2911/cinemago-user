import { fetcher } from "@/lib/fetcher";

interface GetFoodDrinksParams {
  page?: number;
  limit?: number;
  isAvailable?: boolean;
}

export const getFoodDrinks = async (params?: GetFoodDrinksParams) => {
  const { page, limit, isAvailable } = params || {};

  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());
  if (limit) searchParams.append("limit", limit.toString());
  if (isAvailable !== undefined)
    searchParams.append("isAvailable", isAvailable.toString());

  return fetcher(`v1/food-drinks/public/?${searchParams.toString()}`);
};
