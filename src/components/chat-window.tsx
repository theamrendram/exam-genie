import React, { useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";
import ChatHeader from "./chat-header";
import axios from "axios";
import { formatText } from "@/lib/text-formatter";

type Message = {
  id: string | number;
  sender: string;
  message: string;
};

type ChatWindowProps = {
  messages?: Message[];
  onSend?: (text: string) => void;
  conversationId?: number;
};

const ChatWindow = ({ messages, onSend, conversationId }: ChatWindowProps) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartConversation = async () => {
    if (!inputText.trim()) return;
    console.log("inputText: ", inputText);
    setIsLoading(true);
    try {
      const response = await axios.post("/api/start-conversation", {
        inputText,
      });
      console.log("response: ", response);
      window.location.href = `/chat/${response.data.conversationId}`;
    } catch (error: any) {
      console.error(
        "Error starting conversation:",
        error?.response?.data ?? error,
      );
    } finally {
      setIsLoading(false);
    }
    setInputText("");
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    if (onSend) {
      setIsLoading(true);
      try {
        await onSend(inputText);
        setInputText("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    await handleStartConversation();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                  item.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {formatText(item.message)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start p-4">
              <div className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
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
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            className="cursor-pointer rounded-full bg-white p-2 disabled:opacity-50"
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
          >
            <Send className="h-4 w-4 text-black" />
          </Button>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="text-blue-500">Gemini AI</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
