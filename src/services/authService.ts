import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import {
  SignUpPayload,
  LoginPayload,
  VerifyAccountPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
} from "@/types";

export const signUp = (data: SignUpPayload) => {
  return axiosInstance.post("/v1/auth/signup", data);
};

export const login = (data: LoginPayload) => {
  return axios.post("/api/auth/login", data);
};

export const logout = () => {
  return axios.post(
    "/api/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const verifyAccount = (data: VerifyAccountPayload) => {
  return axiosInstance.post("/v1/auth/verify-account", data);
};

export const forgotPassword = (data: ForgotPasswordPayload) => {
  return axiosInstance.post("/v1/auth/forgot-password", data);
};

export const resetPassword = (data: ResetPasswordPayload) => {
  return axiosInstance.post("/v1/auth/reset-password", data);
};

export const changePassword = (data: ChangePasswordPayload) => {
  return axiosInstance.post("/v1/auth/change-password", data);
};
