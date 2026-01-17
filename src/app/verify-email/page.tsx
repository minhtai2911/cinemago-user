"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { verifyAccount } from "@/services";
import useAuth from "@/hooks/useAuth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const { isLogged } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");

      if (!token || !userId) {
        setStatus("error");
        toast.error("Liên kết xác thực không hợp lệ");
        return;
      }

      try {
        const response = await verifyAccount({ token, userId });

        if (response.status === 200) {
          setStatus("success");
          toast.success("Xác thực email thành công!");
          setTimeout(() => router.push("/login"), 2500);
        } else {
          setStatus("error");
          toast.error("Liên kết xác thực không hợp lệ hoặc đã hết hạn");
        }
      } catch {
        setStatus("error");
        toast.error("Xác thực thất bại. Vui lòng thử lại sau.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (isLogged) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-30 flex items-center justify-center text-black px-4">
      <div className="bg-white-700 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Đang xác thực tài khoản...
            </h2>
            <p>Vui lòng chờ trong giây lát...</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-500 mb-4">
              Xác thực thành công!
            </h2>
            <p>Bạn sẽ được chuyển hướng đến trang đăng nhập sau vài giây...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Xác thực thất bại!
            </h2>
            <p>Liên kết không hợp lệ hoặc đã hết hạn.</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Quay lại đăng nhập
            </button>
          </>
        )}
      </div>
    </div>
  );
}
