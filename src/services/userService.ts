import axiosInstance from "@/lib/axiosInstance";
import { UpdateProfilePayload } from "@/types";

export const getProfile = () => {
  return axiosInstance.get("/v1/users/profile");
};

export const updateProfile = (data: UpdateProfilePayload) => {
  return axiosInstance.put("/v1/users/profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
