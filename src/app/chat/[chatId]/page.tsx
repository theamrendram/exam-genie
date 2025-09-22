"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/chat-window";
import axios from "axios";

type Message = {
  id: number;
  content: string;
  sender: "USER" | "ASSISTANT" | "SYSTEM";
  createdAt: string;
};

type Conversation = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

const Page = () => {
  const params = useParams();
  const chatId = params.chatId as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/chat/conversation/${chatId}`);
        setConversation(response.data.conversation);
      } catch (err: any) {
        console.error("Error fetching conversation:", err);
        setError("Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchConversation();
    }
  }, [chatId]);

  const handleSendMessage = async (message: string) => {
    try {
      const response = await axios.post("/api/chat/message", {
        message,
        conversationId: parseInt(chatId),
      });

      // Update conversation with new messages
      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            response.data.userMessage,
            response.data.assistantMessage,
          ],
        };
      });
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-white">Loading conversation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-white">Conversation not found</div>
      </div>
    );
  }

  // Transform messages to match ChatWindow expected format
  const messages = conversation.messages.map((msg) => ({
    id: msg.id,
    sender: msg.sender.toLowerCase() === "user" ? "user" : "assistant",
    message: msg.content,
  }));

  return (
    <div className="flex-1">
      <ChatWindow
        messages={messages}
        onSend={handleSendMessage}
        conversationId={conversation.id}
      />
    </div>
  );
};

export default Page;
