"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/share/Header";
import { PaidListingsModal } from "@/components/Dialogs/PaidListingsModal";
import { useQuery } from "@tanstack/react-query";

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  listingType: string;
  propertyType: string;
  status: string;
  createBy: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}

const PAGE_SIZE = 5;

const statusStyles: Record<string, string> = {
  approved: "bg-green-50  text-green-600  border border-green-200",
  pending:  "bg-yellow-50 text-yellow-600 border border-yellow-200",
  rejected: "bg-red-50    text-red-400    border border-red-200",
};

export default function PaidListings() {
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Fetch data from API ──────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["paid-listing", currentPage],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property/get-all-pad-property-listing?page=${currentPage}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });

  const properties: Property[] = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <div>
      <Header
        title="Property Listings Management"
        subtitle="Review and moderate property listings"
      />

      <div className="">
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500 py-3 px-6">Title</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">Location</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">Price</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">Type</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">Agent</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">Status</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3 text-center pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">
                      Loading properties...
                    </TableCell>
                  </TableRow>
                ) : properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">
                      No properties found.
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map((property) => (
                    <TableRow
                      key={property._id}
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="py-4 px-6 text-sm font-medium text-[#1a2341] max-w-[240px]">
                        {property.title}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">{property.location}</TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">{property.price.toLocaleString("en-US", { style: "currency", currency: "KES" })}</TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">{property.listingType}</TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">{property.createBy.firstName} {property.createBy.lastName}</TableCell>
                      <TableCell className="py-4 text-center">
                        <span className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] ${statusStyles[property.status] || ""}`}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-center gap-2">
                          <PaidListingsModal propertyId={property._id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-400">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, total)} of {total} results
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
                    <span key={`ellipsis-${idx}`} className="h-8 w-8 flex items-center justify-center text-sm text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(Number(page))}
                      className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border ${
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}