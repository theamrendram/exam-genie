import { NextResponse, NextRequest } from "next/server";

import axios from "axios";

export async function POST(request: NextRequest) {
  const { inputText } = await request.json();
  console.log("inputText: ", inputText);
  
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate`,
      {
        message: inputText,
      },
    );

    console.log(response.data);
    return NextResponse.json({ chatId: response.data.response });
  } catch (error: any) {
    console.dir(error.response, { depth: null });
    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 },
    );
  }
}
