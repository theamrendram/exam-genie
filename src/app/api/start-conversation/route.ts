import { NextResponse, NextRequest } from "next/server";

import axios from "axios";

export async function POST(request: NextRequest) {
  const { inputText } = await request.json();
  // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/start`, {
  //   inputText,
  // });

  // console.log(response.data);
  return NextResponse.json({chatId: "123"});
}