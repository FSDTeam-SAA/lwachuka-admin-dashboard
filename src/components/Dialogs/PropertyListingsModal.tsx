"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
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

interface PropertyListingsModalProps {
  id: string;
}

export function PropertyListingsModal({ id }: PropertyListingsModalProps) {
  const [open, setOpen] = useState(false);

  const { data: singlePropertyData, isLoading } = useQuery({
    queryKey: ["single-property", id],
    enabled: !!id && open,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property/${id}`,
      );
      if (!res.ok) throw new Error("Failed to fetch property");
      return res.json();
    },
  });

  const property: Property = singlePropertyData?.data;

  const joinedDate = property?.createdAt
    ? new Date(property.createdAt).toISOString().split("T")[0]
    : "—";

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
            Property Details
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
            {/* Images */}
            {property?.images?.length > 0 && (
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <Image
                    width={500}
                    height={500}
                    key={idx}
                    src={img}
                    alt={`property-${idx}`}
                    className="h-28 w-40 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                  />
                ))}
              </div>
            )}

            {/* Grid of fields */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 mt-2">
              {/* Title */}
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Title
                </span>
                <span className="text-sm text-gray-500">
                  {property?.title || "—"}
                </span>
              </div>

              {/* Listing Type */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Listing Type
                </span>
                <span className="text-sm text-gray-500">
                  {property?.listingType || "—"}
                </span>
              </div>

              {/* Property Type */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Property Type
                </span>
                <span className="text-sm text-gray-500">
                  {property?.propertyType || "—"}
                </span>
              </div>

              {/* Bedrooms */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Bedrooms
                </span>
                <span className="text-sm text-gray-500">
                  {property?.bedrooms ?? "—"}
                </span>
              </div>

              {/* Bathrooms */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Bathrooms
                </span>
                <span className="text-sm text-gray-500">
                  {property?.bathrooms ?? "—"}
                </span>
              </div>

              {/* Area */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Area (sqft)
                </span>
                <span className="text-sm text-gray-500">
                  {property?.area ? `${property.area} sqft` : "—"}
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Price
                </span>
                <span className="text-sm text-gray-500">
                  {property?.price
                    ? `$${property.price.toLocaleString()}`
                    : "—"}
                </span>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Location
                </span>
                <span className="text-sm text-gray-500">
                  {property?.location || "—"}
                </span>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Status
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {property?.status || "—"}
                </span>
              </div>

              {/* Created At */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Created At
                </span>
                <span className="text-sm text-gray-500">{joinedDate}</span>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-sm font-semibold text-[#1a2341]">
                  Description
                </span>
                <span className="text-sm text-gray-500">
                  {property?.description || "—"}
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
