"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl text-center font-semibold">
        Exam Prep Genie for IPU MCA Students
      </h1>
      <p className="text-lg py-4">
        📘 Smart revision, simplified learning, and exam predictions — all in
        one place.
      </p>
      <Button className="rounded-full cursor-pointer" onClick={() => router.push("/chat")}>Start Revising Now</Button>
    </section>
  );
};

export default Hero;
