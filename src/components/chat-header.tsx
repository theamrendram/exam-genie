"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { EllipsisVertical, Share } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const ChatHeader = () => {
  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="sticky top-0 z-20 w-full border-b border-white/10 bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-gray-900/50">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-end px-4 py-2">
        <div className="hidden items-center gap-3 md:flex">
          <button
            className="group flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-white/10"
            aria-label="Share"
          >
            <Share className="h-4 w-4 text-white group-hover:text-blue-400" />
            <span className="text-sm text-white group-hover:text-blue-400">
              Share
            </span>
          </button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="cursor-pointer rounded-full bg-white/90 text-gray-900 hover:bg-white"
          >
            Logout
          </Button>
        </div>

        <div className="md:hidden">
          <MobileMenu onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

type MobileMenuProps = {
  onLogout: () => void;
};

const MobileMenu = ({ onLogout }: MobileMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full bg-white/90 p-2 text-gray-900 shadow hover:bg-white">
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuItem className="gap-2">
          <Share className="h-4 w-4" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={onLogout}>
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
