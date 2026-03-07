"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

interface Subscription {
  _id: string;
  name: string;
  days: number;
  price: number;
  features: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ViewSubscriptionsModalProps {
  id: string;
}

export function ViewSubscriptionsModal({ id }: ViewSubscriptionsModalProps) {
  const [open, setOpen] = useState(false);

  const { data: subsData, isLoading } = useQuery({
    queryKey: ["subscrip", id],
    enabled: !!id && open,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber/${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch subscription");
      return res.json();
    },
  });

  const sub: Subscription = subsData?.data;

  const formatDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : "—";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1a2341]">
            Subscription Details
          </h2>
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
            {/* Plan Name */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">
                Plan Name
              </span>
              <span className="text-sm text-gray-500">{sub?.name || "—"}</span>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">
                Status
              </span>
              <span className="text-sm text-gray-500 capitalize">
                {sub?.status || "—"}
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">
                Price
              </span>
              <span className="text-sm text-gray-500">
                {sub?.price ? `KSH ${sub.price.toLocaleString()}` : "—"}
              </span>
            </div>

            {/* Days */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">
                Duration
              </span>
              <span className="text-sm text-gray-500">
                {sub?.days ? `${sub.days} days` : "—"}
              </span>
            </div>

            {/* Created At */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">
                Created At
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(sub?.createdAt)}
              </span>
            </div>

            {/* Updated At */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1a2341]">
                Updated At
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(sub?.updatedAt)}
              </span>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-sm font-semibold text-[#1a2341]">
                Features
              </span>
              {sub?.features?.length > 0 ? (
                <ul className="flex flex-col gap-1 mt-1">
                  {sub.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-gray-500">—</span>
              )}
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