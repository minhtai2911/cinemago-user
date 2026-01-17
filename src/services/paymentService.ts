import axiosInstance from "@/lib/axiosInstance";

export const checkoutWithMoMo = async (amount: number, bookingId: string) => {
  return axiosInstance.post("/v1/payments/momo/checkout", {
    amount,
    bookingId,
    urlCompleted: `${process.env.NEXT_PUBLIC_URL_CHECKOUT_COMPLETED}`,
  });
};

export const checkoutWithVNPay = async (amount: number, bookingId: string) => {
  return axiosInstance.post("/v1/payments/vnpay/checkout", {
    amount,
    bookingId,
    urlCompleted: `${process.env.NEXT_PUBLIC_URL_CHECKOUT_COMPLETED}`,
  });
};

export const checkoutWithZaloPay = async (
  amount: number,
  bookingId: string
) => {
  return axiosInstance.post("/v1/payments/zalopay/checkout", {
    amount,
    bookingId,
    urlCompleted: `${process.env.NEXT_PUBLIC_URL_CHECKOUT_COMPLETED}`,
  });
};

export const checkStatusTransactionMoMo = async (bookingId: string) => {
  return axiosInstance.get(`/v1/payments/public/momo/status/${bookingId}`);
};

export const checkStatusTransactionZaloPay = async (bookingId: string) => {
  return axiosInstance.get(`/v1/payments/public/zalopay/status/${bookingId}`);
};
