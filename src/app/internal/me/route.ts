import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ACCESS_TOKEN")?.value;

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const backendBaseURL = process.env.BACKEND_BASE_URL;

    if (!backendBaseURL) {
      throw new Error("no BACKEND_BASE_URL env");
    }

    const response = await axios.get(`${backendBaseURL}/user/my-page/user-data`, {
      headers: {
        Cookie: `ACCESS_TOKEN=${token}`,
      },
    });

    if (!response) {
      return NextResponse.json(
        { message: "User data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Server error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
