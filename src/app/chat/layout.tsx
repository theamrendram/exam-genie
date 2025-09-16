"use client";
import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="relative flex min-h-screen flex-1 flex-col bg-gray-800">
        <SidebarTrigger className="absolute z-50 m-4 cursor-pointer text-white" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
