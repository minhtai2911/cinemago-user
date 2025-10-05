import axiosInstance from "@/lib/axiosInstance";
import {
  SignUpPayload,
  LoginPayload,
  VerifyAccountPayload,
  LogoutPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
} from "@/types";

export const signUp = (data: SignUpPayload) => {
  return axiosInstance.post("/v1/auth/signup", data);
};

export const login = (data: LoginPayload) => {
  return axiosInstance.post("/v1/auth/login", data);
};

export const logout = (data: LogoutPayload) => {
  return axiosInstance.post("/v1/auth/logout", data);
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
