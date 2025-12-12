export type FoodType = "COMBO" | "SNACK" | "DRINK";

export interface FoodDrink {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: FoodType;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodSelection extends FoodDrink {
  quantity: number;
}
