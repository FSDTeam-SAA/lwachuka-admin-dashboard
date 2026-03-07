"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/share/Header";
import { ViewSubscriptionsModal } from "@/components/Dialogs/ViewSubscriptionsModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Subscription {
  _id: string;
  name: string;
  days: number;
  price: number;
  features: string[];
  status: string;
  createdAt: string;
}

interface ApiResponse {
  data: Subscription[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

const PAGE_SIZE = 5;

export default function SubscriptionManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch subscriptions from API
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["subs", currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(PAGE_SIZE));
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      return res.json();
    },
  });

  const subscriptions: Subscription[] = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber/${id}`,
        { method: "DELETE" , headers : {
          Authorization: `Bearer ${TOKEN}`,
        }},
      );
      if (!res.ok) throw new Error("Failed to delete subscription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subs"] });
      setDeleteId(null);
    },
  });

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

  return (
    <div>
      <Header
        title="Subscription Management"
        subtitle="Manage subscription plans"
      />

      <div className="bg-[#f0f4f9] min-h-screen p-6">
        {/* Top bar */}
        <div className="flex justify-end mb-4">
          <Link href="/subscription-management/add-subscription">
            <Button className="h-10 px-5 bg-[#1a2341] hover:bg-[#2a3451] text-white text-sm rounded-xl flex items-center gap-2">
              <Plus size={16} />
              Create New Subscription
            </Button>
          </Link>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-500 py-3 px-6">
                  Plan Name
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Price
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Days
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Features
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Created At
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
              {isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                  <TableRow key={idx} className="border-t border-gray-100">
                    <TableCell>
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-4 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-8 w-20 mx-auto bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-sm text-gray-400"
                  >
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub) => (
                  <TableRow
                    key={sub._id}
                    className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="py-4 px-6 text-sm font-semibold text-[#1a2341]">
                      {sub.name}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500">
                      KSH {sub.price?.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500">
                      {sub.days} days
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500 max-w-[200px]">
                      {sub.features?.slice(0, 2).join(", ")}
                      {sub.features?.length > 2 && "..."}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toISOString().split("T")[0]
                        : "—"}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span
                        className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] capitalize
                          ${
                            sub.status === "active"
                              ? "bg-green-50 text-green-600 border border-green-200"
                              : sub.status === "paused"
                                ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                      >
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-center gap-2">
                        <ViewSubscriptionsModal id={sub._id} />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteId(sub._id)}
                          className="h-8 w-8 border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-md"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
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
                      className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border ${
                        currentPage === page
                          ? "bg-[#1a2341] text-white border-[#1a2341]"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-8 shadow-xl border border-gray-100 [&>button]:hidden">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1a2341]">
                Delete Subscription
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete this subscription plan? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <Button
                variant="outline"
                className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setDeleteId(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
