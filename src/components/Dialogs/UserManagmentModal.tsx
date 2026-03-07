"use client";

import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface UserManagmentModalProps {
  id: string;
}

export function UserManagmentModal({ id }: UserManagmentModalProps) {
  const [open, setOpen] = useState(false);

  const { data: singleUserData, isLoading } = useQuery({
    queryKey: ["single-user", id],
    enabled: !!id && open,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      return res.json();
    },
  });

  const user = singleUserData?.data;

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toISOString().split("T")[0]
    : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-orange-300 text-orange-400 hover:bg-orange-50 rounded-md"
        >
          <Eye size={14} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl p-8 shadow-xl border border-gray-100 [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1a2341]">User Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800"
          >
            <X size={16} />
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-sm text-gray-500">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-10 gap-y-6 mt-2">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">Name</span>
              <span className="text-sm text-gray-500">{fullName || "—"}</span>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">Email</span>
              <span className="text-sm text-gray-500">{user?.email || "—"}</span>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">Role</span>
              <span className="text-sm text-gray-500">{user?.role || "—"}</span>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">Phone</span>
              <span className="text-sm text-gray-500">
                {user?.phoneNumber || "—"}
              </span>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">Gender</span>
              <span className="text-sm text-gray-500">{user?.gender || "—"}</span>
            </div>

            {/* Joined */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">Joined</span>
              <span className="text-sm text-gray-500">{joinedDate || "—"}</span>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">Address</span>
              <span className="text-sm text-gray-500">{user?.address || "—"}</span>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">
                Location
              </span>
              <span className="text-sm text-gray-500">
                {user?.location || "—"}
              </span>
            </div>

            {/* Post Code */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">
                Post Code
              </span>
              <span className="text-sm text-gray-500">
                {user?.postCode || "—"}
              </span>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-sm font-semibold text-[#1a2341]">Status</span>
              <span className="text-sm text-gray-500">{user?.status || "—"}</span>
            </div>

            {/* Close Button */}
            <div className="col-span-2 flex justify-end pt-2">
              <Button
                onClick={() => setOpen(false)}
                className="bg-orange-400 hover:bg-orange-500 text-white px-6 rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}