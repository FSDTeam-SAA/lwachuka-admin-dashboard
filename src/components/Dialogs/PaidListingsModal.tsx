"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Eye, Loader2, X } from "lucide-react";
import Image from "next/image";

interface Property {
  _id: string;
  title: string;
  listingType: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PaidListingsModalProps {
  propertyId: string;
}

export function PaidListingsModal({ propertyId }: PaidListingsModalProps) {
  const { data: singlePaid, isLoading } = useQuery({
    queryKey: ["singlePaid", propertyId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property/${propertyId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch property");
      const json = await res.json();
      return json.data as Property;
    },
    enabled: !!propertyId,
  });

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

      <DialogContent className="sm:max-w-2xl rounded-2xl p-0 shadow-xl border border-gray-100 [&>button]:hidden overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-[#1a2341]">
            Property Details
          </h2>
          <DialogClose asChild>
            <button className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-orange-400" />
            </div>
          )}

          {/* Data */}
          {singlePaid && (
            <div className="space-y-6">
              {/* Images */}
              {singlePaid.images?.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {singlePaid.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border bg-gray-50"
                    >
                      <Image
                        src={img}
                        alt={`Property image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Fields Grid */}
              <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Title</span>
                  <span className="text-sm text-gray-500">{singlePaid.title}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Listing Type</span>
                  <span className="text-sm text-gray-500">{singlePaid.listingType}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Property Type</span>
                  <span className="text-sm text-gray-500">{singlePaid.propertyType}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Location</span>
                  <span className="text-sm text-gray-500">{singlePaid.location}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Bedrooms</span>
                  <span className="text-sm text-gray-500">{singlePaid.bedrooms}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Bathrooms</span>
                  <span className="text-sm text-gray-500">{singlePaid.bathrooms}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Area</span>
                  <span className="text-sm text-gray-500">{singlePaid.area} sqft</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Price</span>
                  <span className="text-sm text-gray-500">${singlePaid.price?.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Status</span>
                  <span
                    className={`text-sm font-medium capitalize ${
                      singlePaid.status === "pending"
                        ? "text-orange-500"
                        : singlePaid.status === "active"
                          ? "text-green-500"
                          : "text-gray-500"
                    }`}
                  >
                    {singlePaid.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Created At</span>
                  <span className="text-sm text-gray-500">
                    {new Date(singlePaid.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Description — full width */}
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">Description</span>
                  <span className="text-sm text-gray-500 leading-relaxed">{singlePaid.description}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}