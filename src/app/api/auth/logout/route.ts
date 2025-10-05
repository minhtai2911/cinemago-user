import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LogoutPayload } from "@/types";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const body: LogoutPayload = await request.json();

    const response = await axios.post(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/v1/auth/logout`,
      body
    );

    const { message } = response.data;

    localStorage.removeItem("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({ message }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logout failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
