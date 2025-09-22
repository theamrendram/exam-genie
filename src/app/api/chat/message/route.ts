import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!message || !conversationId) {
      return NextResponse.json(
        { error: "Message and conversation ID are required" },
        { status: 400 },
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/message`,
      {
        message,
        conversationId: parseInt(conversationId),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
