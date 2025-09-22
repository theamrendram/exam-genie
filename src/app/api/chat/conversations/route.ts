import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/conversations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}
