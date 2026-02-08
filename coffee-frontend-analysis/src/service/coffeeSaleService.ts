import { api } from "./api";

type ApiResponse<T> = {
  message: string;
  data: T;
};

export async function getTopSellingCoffees(topK: number) {
  const { data } = await api.get<ApiResponse<any[]>>(
    `coffee-sales/get-sellings-coffees/${topK}`
  );

  return data.data;
}

export async function getMostProfitableMonths(topK: number) {
  const { data } = await api.get<ApiResponse<any[]>>(
    `coffee-sales/get-most-profitable-months/${topK}`
  );

  return data.data;
}

