import axiosInstance from "@/lib/axiosInstance";

export const sendEmailNotification = async (
  to: string,
  subject: string,
  html: string
) => {
  return axiosInstance.post("/v1/notifications/public/send-email", {
    to,
    subject,
    html,
  });
};
