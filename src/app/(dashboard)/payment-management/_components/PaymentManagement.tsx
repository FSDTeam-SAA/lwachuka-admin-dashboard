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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Payment {
  _id: string;
  user: string;
  subscriber: string;
  amount: number;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  paymentType: string;
  currency: string;
  status: string;
  createdAt: string;
}

interface ApiResponse {
  data: Payment[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

const PAGE_SIZE = 5;

type FilterStatus = "All Status" | "completed" | "pending" | "failed";

const statusStyles: Record<string, string> = {
  completed: "bg-green-50 text-green-600 border border-green-200",
  pending:   "bg-yellow-50 text-yellow-600 border border-yellow-200",
  failed:    "bg-red-50 text-red-400 border border-red-200",
};

export default function PaymentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All Status");


const session = useSession()
  const TOKEN = session?.data?.user?.accessToken;

  const { data: apiData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["payment-list", currentPage, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(PAGE_SIZE));
      if (filterStatus !== "All Status") params.set("status", filterStatus);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment?${params.toString()}`,{method : "GET", headers : {
          Authorization: `Bearer ${TOKEN}`,
        }}
      );
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    },
  });

  const payments: Payment[] = apiData?.data || [];
  const totalItems = apiData?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const handleFilter = (status: FilterStatus) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, totalItems);

  const formatDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : "—";

  return (
    <div>
      <div className="">
        {/* Filter */}
        <div className="flex justify-end px-6 pt-4 pb-2">
          <Select
            value={filterStatus}
            onValueChange={(val: string) => handleFilter(val as FilterStatus)}
          >
            <SelectTrigger className="h-9 w-36 text-sm text-gray-600 border-gray-200 rounded-lg">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent align="end">
              {(["All Status", "completed", "pending", "failed"] as FilterStatus[]).map((s) => (
                <SelectItem key={s} value={s} className="text-sm cursor-pointer capitalize">
                  {s === "All Status" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500 py-3 px-6">
                    Payment ID
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">
                    Currency
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                    <TableRow key={idx} className="border-t border-gray-100">
                      <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell className="text-center"><div className="h-6 w-20 mx-auto bg-gray-200 rounded animate-pulse" /></TableCell>
                    </TableRow>
                  ))
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-sm text-gray-400">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow
                      key={payment._id}
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="py-4 px-6 text-sm font-medium text-[#1a2341] max-w-[200px] truncate">
                        {payment.stripePaymentIntentId || "—"}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">
                        ${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500 uppercase">
                        {payment.currency}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500 capitalize">
                        {payment.paymentType}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span
                          className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] capitalize ${
                            statusStyles[payment.status] ||
                            "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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