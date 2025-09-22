import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  try {
    const { conversationId } = params;
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/conversation/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("response: ", response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching conversation:", error);
    console.dir(error.response.data, { depth: null });
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 },
    );
  }
}
