import React, { useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";
import ChatHeader from "./chat-header";
import axios from "axios";

type Message = {
  id: string | number;
  sender: string;
  message: string;
};

type ChatWindowProps = {
  messages?: Message[];
  onSend?: (text: string) => void;
};

const ChatWindow = ({ messages, onSend }: ChatWindowProps) => {
  const [inputText, setInputText] = useState("");

  const handleStartConversation = async () => {
    try {
      const response = await axios.post("/api/start-conversation", {
        inputText,
      });
      window.location.href = `/chat/${response.data.chatId}`;
    } catch (error: any) {
      console.log(error?.response?.data ?? error);
    }
    setInputText("");
  };

  const handleSend = async () => {
    if (onSend) {
      onSend(inputText);
      setInputText("");
      return;
    }
    await handleStartConversation();
  };

  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <ChatHeader />
      {messages && messages.length > 0 ? (
        <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 pt-[72px] pb-[96px]">
          {messages.map((item) => (
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
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center overflow-y-auto px-4 pt-[72px] pb-[96px]">
          <p className="text-3xl font-semibold text-white">
            Where should we start?
          </p>
          <p className="text-lg font-medium text-white">
            you can start by asking me about the topics you want to revise
          </p>
        </div>
      )}

      <div className="sticky inset-x-0 bottom-0 z-10 mx-auto w-full bg-gray-800">
        <div className="mx-auto flex w-[90%] items-center space-y-2 rounded-full border border-zinc-900 bg-gray-200 p-2 md:w-[50%]">
          <Input
            className="w-full border-none shadow-none outline-none focus-visible:ring-0"
            placeholder="Ask me anything"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button
            variant="ghost"
            className="cursor-pointer rounded-full bg-white p-2"
            onClick={handleSend}
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

export default ChatWindow;
