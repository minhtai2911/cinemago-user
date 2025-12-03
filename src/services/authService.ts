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

export const signUp = async (data: SignUpPayload) => {
  return axiosInstance.post("/v1/auth/signup", data);
};

export const login = async (data: LoginPayload) => {
  return axios.post("/api/auth/login", data);
};

export const logout = async () => {
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

export const verifyAccount = async (data: VerifyAccountPayload) => {
  return axiosInstance.post("/v1/auth/verify-account", data);
};

export const forgotPassword = async (data: ForgotPasswordPayload) => {
  return axiosInstance.post("/v1/auth/forgot-password", data);
};

export const resetPassword = async (data: ResetPasswordPayload) => {
  return axiosInstance.post("/v1/auth/reset-password", data);
};

export const changePassword = async (data: ChangePasswordPayload) => {
  return axiosInstance.post("/v1/auth/change-password", data);
};
