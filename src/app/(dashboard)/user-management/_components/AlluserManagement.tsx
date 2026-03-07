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
import Header from "@/components/share/Header";
import { UserManagmentModal } from "@/components/Dialogs/UserManagmentModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton"; // <-- ShadCN skeleton

type Status = "active" | "pending" | "block";

interface ApiUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  createdAt: string;
  status: Status;
}

interface ApiResponse {
  data: ApiUser[];
}

const PAGE_SIZE = 5;

const statusStyles: Record<Status, string> = {
  active: "bg-green-50 text-green-600 border border-green-200",
  pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  block: "bg-red-50 text-red-400 border border-red-200",
};

export default function AlluserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;
  const queryClient = useQueryClient();

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ["all-user"],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/all-users?role=user`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const users: ApiUser[] = data?.data || [];
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated = users.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  // Block user mutation
  const blockMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "block" }),
        }
      );

      if (!res.ok) throw new Error("Failed to block user");
      return res.json();
    },
    onSuccess: (_, userId) => {
      queryClient.setQueryData(["all-user"], (oldData: ApiResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((u: ApiUser) =>
            u._id === userId ? { ...u, status: "block" } : u
          ),
        };
      });
    },
  });

  return (
    <div>
      <Header title="User Management" subtitle="Manage all platform users" />

      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-500 py-3 px-6">Name</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">Email</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">Role</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">Joined</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3 text-center pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading
                ? Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                    <TableRow key={idx} className="border-t border-gray-100">
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-8 w-20 mx-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                : paginated.map((user) => {
                    const fullName = `${user.firstName || ""} ${user.lastName || ""}`;
                    const joinedDate = new Date(user.createdAt).toISOString().split("T")[0];
                    const status: Status = user.status || "pending";

                    return (
                      <TableRow key={user._id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <TableCell className="py-4 px-6 text-sm font-medium text-[#1a2341]">{fullName}</TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">{user.email}</TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">{user.role}</TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">{joinedDate}</TableCell>
                        <TableCell className="py-4 text-center">
                          <span className={`inline-block px-4 rounded-md text-xs font-medium min-w-[80px] py-2 ${statusStyles[status]}`}>
                            {status}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 pr-6">
                          <div className="flex items-center justify-center gap-2">
                            <UserManagmentModal id={user._id} />
                            <Button
                              size="sm"
                              className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md"
                              onClick={() => blockMutation.mutate(user._id)}
                              disabled={status === "block" || blockMutation.isPending}
                            >
                              {status === "block" ? "Blocked" : "Block"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>

          {users.length > PAGE_SIZE && !isLoading && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-400">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, users.length)} of {users.length} results
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
                    <span key={`ellipsis-${idx}`} className="h-8 w-8 flex items-center justify-center text-sm text-gray-400">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(Number(page))}
                      className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors border
                        ${currentPage === page ? "bg-[#1a2341] text-white border-[#1a2341]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
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
          )}
        </div>
      </div>
    </div>
  );
}