"use client";

// import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
  joined: string;
  status: string;
}

const dummyUser: User = {
  name: "John Doe",
  email: "john@example.com",
  role: "Buyer",
  joined: "2026-02-05",
  status: "Active",
};

export function AdvertisementManagementmodal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-orange-300 text-orange-400 hover:bg-orange-50 hover:text-orange-500 rounded-md"
        >
          <Eye size={14} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl p-8 shadow-xl border border-gray-100 [&>button]:hidden">
        {/* Close button */}
        {/* <DialogClose asChild>
            <button className="absolute right-5 top-5 text-black hover:text-gray-600 transition-colors text-xl leading-none bg-black">
              ✕
            </button>
          </DialogClose> */}

        {/* Grid of fields */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-6 mt-2">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#1a2341]">Name</span>
            <span className="text-sm text-gray-500">{dummyUser.name}</span>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#1a2341]">Email</span>
            <span className="text-sm text-gray-500">{dummyUser.email}</span>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#1a2341]">Role</span>
            <span className="text-sm text-gray-500">{dummyUser.role}</span>
          </div>

          {/* Joined */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#1a2341]">Joined</span>
            <span className="text-sm text-gray-500">{dummyUser.joined}</span>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#1a2341]">Status</span>
            <span className="text-sm text-gray-500">{dummyUser.status}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
