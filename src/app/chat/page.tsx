"use client";
import React from "react";
import { Share, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import chatData from "@/chat-data";
import { signOut } from "next-auth/react";
const Page = () => {
  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-800">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between border-b border-zinc-900 bg-gray-500 px-8 py-2">
        <div>
          <h1 className="-mb-1 text-xl font-bold">Exam Genie</h1>
          <p className="text-md">by Amrendram</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="group flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-zinc-200">
            <Share className="h-4 w-4 group-hover:text-blue-500 dark:text-white" />
            <p className="text-md group-hover:text-blue-500 dark:text-white">
              Share
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="rounded-full cursor-pointer">
            Logout
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 pt-[72px] pb-[96px]">
        {chatData.map((item) => (
          <div
            key={item.id}
            className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"} p-4`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${item.sender === "user" ? "bg-white" : "text-white"}`}
            >
              <p>{item.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-3xl rounded-4xl bg-gray-800">
        <div className="flex w-full items-center space-y-2 rounded-full border border-zinc-900 bg-gray-200 p-2">
          <Input
            className="w-full border-none shadow-none outline-none focus-visible:ring-0"
            placeholder="Ask me anything"
          />
          <Button
            variant="ghost"
            className="cursor-pointer rounded-full bg-white p-2"
          >
            <Send className="h-4 w-4 text-black" />
          </Button>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="text-blue-500">OpenAI</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
