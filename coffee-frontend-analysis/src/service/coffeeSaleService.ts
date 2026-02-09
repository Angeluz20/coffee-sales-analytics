import { api } from "./api";

type ApiResponse<T> = {
  message: string;
  data: T;
};

export async function getTopSellingCoffees(
  topK: number,
  fileId: number,
) {
  const { data } = await api.get<ApiResponse<any[]>>(
    `coffee-sales/get-sellings-coffees/${topK}`,
    {
      params: { fileId },
    },
  );

  return data.data;
}

export async function getMostProfitableMonths(
  topK: number,
  fileId: number,
) {
  const { data } = await api.get<ApiResponse<any[]>>(
    `coffee-sales/get-most-profitable-months/${topK}`,
    {
      params: { fileId },
    },
  );

  return data.data;
}
