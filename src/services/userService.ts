import axiosInstance from "@/lib/axiosInstance";

export const getProfile = async () => {
  return axiosInstance.get("/v1/users/profile");
};

export const updateProfile = async (data: FormData) => {
  return axiosInstance.put("/v1/users/profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
