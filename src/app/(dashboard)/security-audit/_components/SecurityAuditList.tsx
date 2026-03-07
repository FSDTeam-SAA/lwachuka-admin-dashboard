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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface LoginHistory {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
  };
  role: string;
  loginTime: string;
  ipaddress: string;
  createdAt: string;
}

interface ApiResponse {
  data: LoginHistory[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

const PAGE_SIZE = 5;

type FilterRole = "All" | "admin" | "user" | "vendor";

export default function SecurityAuditList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState<FilterRole>("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;

  const { data: apiData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["login-history", currentPage, filterRole],
    enabled: !!TOKEN,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(PAGE_SIZE));
      if (filterRole !== "All") params.set("role", filterRole);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/loginhistory?${params.toString()}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch login history");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/loginhistory/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete login history");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login-history"] });
      setDeleteId(null);
    },
  });

  const histories: LoginHistory[] = apiData?.data || [];
  const totalItems = apiData?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const handleFilter = (role: FilterRole) => {
    setFilterRole(role);
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
    <>
      <div>
        <div className="">
          {/* Filter */}
          <div className="flex justify-end px-6 pt-4 pb-2">
            <Select
              value={filterRole}
              onValueChange={(val: string) => handleFilter(val as FilterRole)}
            >
              <SelectTrigger className="h-9 w-36 text-sm text-gray-600 border-gray-200 rounded-lg">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent align="end">
                {(["All", "admin", "user", "vendor"] as FilterRole[]).map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {r === "All" ? "All Roles" : r}
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
                      Name
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 py-3">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 py-3">
                      Role
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 py-3">
                      IP Address
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 py-3">
                      Login Time
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
                          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="h-4 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="h-8 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : histories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-sm text-gray-400"
                      >
                        No login history found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    histories.map((item) => (
                      <TableRow
                        key={item._id}
                        className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="py-4 px-6 text-sm font-medium text-[#1a2341]">
                          {`${item.userId?.firstName || ""} ${item.userId?.lastName || ""}`.trim() || "—"}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">
                          {item.userId?.email || "—"}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-gray-500 capitalize">
                          {item.role || "—"}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">
                          {item.ipaddress || "—"}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">
                          {formatDate(item.loginTime)}
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <span
                            className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[70px] capitalize ${
                              item.userId?.status === "active"
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : "bg-red-50 text-red-400 border border-red-200"
                            }`}
                          >
                            {item.userId?.status || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 pr-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setDeleteId(item._id)}
                              className="h-8 w-8 flex items-center justify-center rounded-md border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
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
                Delete Record
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete this login history record? This
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
    </>
  );
}