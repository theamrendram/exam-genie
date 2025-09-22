import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const { inputText } = await request.json();
  console.log("inputText: ", inputText);
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate/start`,
      {
        message: inputText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(response.data);
    return NextResponse.json({
      conversationId: response.data.conversationId,
      response: response.data.response,
      title: response.data.title,
    });
  } catch (error: any) {
    console.error(
      "Error starting conversation:",
      error?.response?.data ?? error,
    );
    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 },
    );
  }
}
