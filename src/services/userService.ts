import axiosInstance from "@/lib/axiosInstance";

export const getProfile = () => {
  return axiosInstance.get("/v1/users/profile");
};
