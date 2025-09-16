import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-gray-500 p-4">
      <div className="">Exam Genie</div>
      <div className="flex items-center gap-2">
        <Link href="/chat" className="rounded-md bg-white px-2 py-1 text-black">
          Chat Now
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
