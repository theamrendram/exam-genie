"use client";
import React from "react";
import chatData from "@/chat-data";
import ChatWindow from "@/components/chat-window";
const Page = () => {
  return (
    <div className="flex-1">
      <ChatWindow messages={chatData} />
    </div>
  );
};

export default Page;
