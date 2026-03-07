"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Header from "@/components/share/Header";
import { AdvertisementManagementmodal } from "@/components/Dialogs/AdvertisementManagementmodal";
import { useQuery } from "@tanstack/react-query";

type Status = "Active" | "Paused" | "Expired";

interface Campaign {
  _id: string;
  companyName: string;
  advertisementType: string;
  uploadMedia: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  compaingBudget:number
}

const PAGE_SIZE = 5;

const statusStyles: Record<Status, string> = {
  Active: "bg-green-50 text-green-600 border border-green-200",
  Paused: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  Expired: "bg-gray-100 text-gray-500 border border-gray-200",
};

export default function AdvertisementManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["all-adv", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/advertisement?page=${currentPage}&limit=${PAGE_SIZE}`
      );
      if (!res.ok) throw new Error("Failed to fetch advertisements");
      const json = await res.json();
      return json.data as Campaign[];
    },
  });

  const totalPages = Math.ceil((data?.length || 0) / PAGE_SIZE);
 
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  const mapStatus = (paymentStatus: string): Status => {
    switch (paymentStatus.toLowerCase()) {
      case "paid":
        return "Active";
      case "pending":
        return "Paused";
      default:
        return "Expired";
    }
  };

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div>
      <Header title="Advertisements" subtitle="Review the advertising plans" />
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-500 py-3 px-6">
                  Campaign Img &amp; Name
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Type
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Impressions
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Start Date
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  End Date
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3 text-center pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((campaign) => (
                <TableRow
                  key={campaign._id}
                  className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-100">
                        <Image
                          src={campaign.uploadMedia}
                          alt={campaign.companyName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-[#1a2341]">
                        {campaign.companyName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-500">
                    {campaign.advertisementType}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-500">
                  
                    {String(campaign?.compaingBudget)}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-500">
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-500">
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <span
                      className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] ${
                        statusStyles[mapStatus(campaign.paymentStatus)]
                      }`}
                    >
                      {mapStatus(campaign.paymentStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-6">
                    <div className="flex items-center justify-center">
                      <AdvertisementManagementmodal  id = {campaign?._id}  />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {(data?.length || 0) > PAGE_SIZE &&(
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-400">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, data?.length || 0)} of{" "}
              {data?.length || 0} results
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ‹
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="h-8 w-8 flex items-center justify-center text-sm text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border
                  ${
                    currentPage === page
                      ? "bg-[#1a2341] text-white border-[#1a2341]"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ›
              </button>
            </div>
          </div>
          )}
          
        </div>
      </div>
    </div>
  );
}