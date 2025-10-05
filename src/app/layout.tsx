import { cookies } from "next/headers";
import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CinemaGo - Đặt vé xem phim online nhanh chóng",
    template: "%s | CinemaGo",
  },
  description:
    "CinemaGo giúp bạn đặt vé xem phim trực tuyến, chọn chỗ ngồi, thanh toán nhanh, cập nhật lịch chiếu và phim hot nhất tại các rạp trên toàn quốc.",
  keywords: [
    "đặt vé xem phim",
    "cinemago",
    "xem phim online",
    "lịch chiếu phim",
    "mua vé rạp",
    "phim mới",
    "rạp chiếu phim",
  ],
  authors: [{ name: "CinemaGo Team", url: "https://cinemago.vn" }],
  metadataBase: new URL("https://cinemago.vn"),
  openGraph: {
    title: "CinemaGo - Đặt vé xem phim online nhanh chóng",
    description:
      "Đặt vé xem phim, chọn ghế, và xem lịch chiếu tại các rạp trên toàn quốc. CinemaGo mang đến trải nghiệm đặt vé tiện lợi và nhanh chóng.",
    url: "https://cinemago.vn",
    siteName: "CinemaGo",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CinemaGo - Đặt vé xem phim online nhanh chóng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CinemaGo - Đặt vé xem phim online nhanh chóng",
    description:
      "Đặt vé xem phim online, chọn ghế và lịch chiếu dễ dàng cùng CinemaGo.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://cinemago.vn",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  return (
    <html lang="vi">
      <body>
        <AuthProvider initialAccessToken={accessToken}>{children}</AuthProvider>
      </body>
    </html>
  );
}
