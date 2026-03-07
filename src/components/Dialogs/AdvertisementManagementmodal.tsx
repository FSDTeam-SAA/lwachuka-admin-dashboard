"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface Advertisement {
  _id: string;
  companyName: string;
  advertisementType: string;
  callToActionURL: string;
  uploadMedia: string;
  targetRegions: string[];
  targetAudience: string[];
  compaingBudget: number;
  compaingDuration: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface AdvertisementManagementmodalProps {
  id: string;
}

export function AdvertisementManagementmodal({
  id,
}: AdvertisementManagementmodalProps) {
  const [open, setOpen] = useState(false);

  const { data: singleAdvertisementData, isLoading } = useQuery({
    queryKey: ["single-advertisement", id],
    enabled: !!id && open,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/advertisement/${id}`,
      );
      if (!res.ok) throw new Error("Failed to fetch advertisement");
      return res.json();
    },
  });

  const ad: Advertisement = singleAdvertisementData?.data;

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

      <DialogContent className="sm:max-w-2xl rounded-2xl p-8 shadow-xl border border-gray-100 [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1a2341]">
            Advertisement Details
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
          <>
            {/* Media Preview */}
            {ad?.uploadMedia && (
              <div className="mb-6">
                <Image
                  width={500}
                  height={500}
                  src={ad.uploadMedia}
                  alt="advertisement media"
                  className="w-full h-48 object-cover rounded-lg border border-gray-100"
                />
              </div>
            )}

            {/* Grid of fields */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 mt-2">
              {/* Company Name */}
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Company Name
                </span>
                <span className="text-sm text-gray-500">
                  {ad?.companyName || "—"}
                </span>
              </div>

              {/* Advertisement Type */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Advertisement Type
                </span>
                <span className="text-sm text-gray-500">
                  {ad?.advertisementType || "—"}
                </span>
              </div>

              {/* Payment Status */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Payment Status
                </span>
                <span className="text-sm text-gray-500">
                  {ad?.paymentStatus || "—"}
                </span>
              </div>

              {/* Campaign Budget */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Campaign Budget
                </span>
                <span className="text-sm text-gray-500">
                  {ad?.compaingBudget
                    ? `$${ad.compaingBudget.toLocaleString()}`
                    : "—"}
                </span>
              </div>

              {/* Campaign Duration */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Campaign Duration
                </span>
                <span className="text-sm text-gray-500">
                  {ad?.compaingDuration || "—"}
                </span>
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Start Date
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(ad?.startDate)}
                </span>
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  End Date
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(ad?.endDate)}
                </span>
              </div>

              {/* Target Regions */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Target Regions
                </span>
                <span className="text-sm text-gray-500">
                  {ad?.targetRegions?.length > 0
                    ? ad.targetRegions.join(", ")
                    : "—"}
                </span>
              </div>

              {/* Target Audience */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Target Audience
                </span>
                <span className="text-sm text-gray-500">
                  {ad?.targetAudience?.length > 0
                    ? ad.targetAudience.join(", ")
                    : "—"}
                </span>
              </div>

              {/* Call To Action URL */}
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Call To Action URL
                </span>
                <a
                  href={ad?.callToActionURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-400 hover:underline break-all"
                >
                  {ad?.callToActionURL || "—"}
                </a>
              </div>

              {/* Created At */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Created At
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(ad?.createdAt)}
                </span>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
