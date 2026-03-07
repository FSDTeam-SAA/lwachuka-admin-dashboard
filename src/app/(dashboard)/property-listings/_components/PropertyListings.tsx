"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/share/Header";
import { PropertyListingsModal } from "@/components/Dialogs/PropertyListingsModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type Status = "approved" | "pending" | "rejected";

interface Property {
  _id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  agent: string;
  status: Status;
}

interface ApiResponse {
  data: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const PAGE_SIZE = 5;

const statusStyles: Record<Status, string> = {
  approved: "bg-green-50 text-green-600 border border-green-200",
  pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  rejected: "bg-red-50 text-red-400 border border-red-200",
};

type FilterStatus = "All Status" | Status;

export default function PropertyListings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All Status");
  const queryClient = useQueryClient();

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;


  // Fetch property listings
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["property-listing", currentPage, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(PAGE_SIZE));
      if (filterStatus !== "All Status") params.set("status", filterStatus);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch property listings");
      return res.json();
    },
  });

  const allProperties: Property[] = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || Math.ceil(totalItems / PAGE_SIZE);

  const handleFilter = (status: FilterStatus) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, totalItems);

  // Approve property mutation
  const approveMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property/${propertyId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" ,  Authorization: `Bearer ${TOKEN}`,},
          body: JSON.stringify({ status: "approved" }),
        }
      );
      if (!res.ok) throw new Error("Failed to approve property");
      return res.json();
    },
    onSuccess: (_, propertyId) => {
      queryClient.setQueryData<ApiResponse>(
        ["property-listing", currentPage, filterStatus],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((p) =>
              p._id === propertyId ? { ...p, status: "approved" } : p
            ),
          };
        }
      );
    },
  });

  // Block property mutation
  const blockMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/property/${propertyId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" ,  Authorization: `Bearer ${TOKEN}`,},
          body: JSON.stringify({ status: "rejected" }),
        }
      );
      if (!res.ok) throw new Error("Failed to reject property");
      return res.json();
    },
    onSuccess: (_, propertyId) => {
      queryClient.setQueryData<ApiResponse>(
        ["property-listing", currentPage, filterStatus],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((p) =>
              p._id === propertyId ? { ...p, status: "rejected" } : p
            ),
          };
        }
      );
    },
  });

  return (
    <div>
      <Header title="Property Listings Management" subtitle="Review and moderate property listings" />

      {/* Filter */}
      <div className="">
        <div className="flex justify-end px-6 pt-4 pb-2">
          <Select value={filterStatus} onValueChange={(val) => handleFilter(val as FilterStatus)}>
            <SelectTrigger className="h-9 w-36 text-sm text-gray-600 border-gray-200 rounded-lg">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent align="end">
              {(["All Status", "Approved", "Pending", "Rejected"] as FilterStatus[]).map(
                (s) => (
                  <SelectItem key={s} value={s} className="text-sm cursor-pointer">
                    {s}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table */}
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
                {isLoading
                  ? Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                      <TableRow key={idx} className="border-t border-gray-100">
                        {Array.from({ length: 7 }).map((__, cellIdx) => (
                          <TableCell key={cellIdx}>
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : allProperties.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">
                        No properties found.
                      </TableCell>
                    </TableRow>
                  )
                  : allProperties.map((property) => (
                      <TableRow
                        key={property._id}
                        className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="py-4 px-6 text-sm font-medium text-[#1a2341] max-w-[240px]">
                          {property.title}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">{property.location}</TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">{property.price}</TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">{property.type}</TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">{property.agent}</TableCell>
                        <TableCell className="py-4 text-center">
                          <span className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] ${statusStyles[property.status]}`}>
                            {property.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 pr-6">
                          <div className="flex items-center justify-center gap-2">
                            <PropertyListingsModal id={property._id} />
                            <Button
                              size="sm"
                              className="h-8 px-3 bg-[#1a2341] hover:bg-[#2a3451] text-white text-xs rounded-md"
                              onClick={() => approveMutation.mutate(property._id)}
                              disabled={approveMutation.isPending || property.status === "approved"}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md"
                              onClick={() => blockMutation.mutate(property._id)}
                              disabled={blockMutation.isPending || property.status === "rejected"}
                            >
                              Block
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalItems > PAGE_SIZE && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <span className="text-sm text-gray-400">
                  Showing {showingFrom} to {showingTo} of {totalItems} results
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || totalPages === 0}
                    className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    ‹
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span key={`ellipsis-${idx}`} className="h-8 w-8 flex items-center justify-center text-sm text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(Number(page))}
                        className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border
                          ${currentPage === page
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
                    disabled={currentPage === totalPages || totalPages === 0}
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
    </div>
  );
}