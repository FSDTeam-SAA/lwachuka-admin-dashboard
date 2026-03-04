"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { ViewSubscriptionsModal } from "@/components/Dialogs/ViewSubscriptionsModal";
import { DeleteModal } from "@/components/Dialogs/DeleteModal";

type Status = "Active" | "Paused" | "Expired";

interface Subscription {
  id: number;
  planName: string;
  price: string;
  billingCycle: string;
  subscribers: number;
  date: string;
  status: Status;
}

const allSubscriptions: Subscription[] = [
  {
    id: 1,
    planName: "Professional",
    price: "KSH 499",
    billingCycle: "Monthly",
    subscribers: 120,
    date: "2026-03-01",
    status: "Active",
  },
  {
    id: 2,
    planName: "Professional",
    price: "KSH 499",
    billingCycle: "Monthly",
    subscribers: 120,
    date: "2026-03-12",
    status: "Active",
  },
  {
    id: 3,
    planName: "Professional",
    price: "KSH 499",
    billingCycle: "Monthly",
    subscribers: 120,
    date: "2026-03-12",
    status: "Paused",
  },
  {
    id: 4,
    planName: "Professional",
    price: "KSH 499",
    billingCycle: "Monthly",
    subscribers: 120,
    date: "2026-03-12",
    status: "Active",
  },
  {
    id: 5,
    planName: "Professional",
    price: "KSH 499",
    billingCycle: "Monthly",
    subscribers: 120,
    date: "2026-03-12",
    status: "Active",
  },
  {
    id: 6,
    planName: "Professional",
    price: "KSH 499",
    billingCycle: "Monthly",
    subscribers: 120,
    date: "2026-03-12",
    status: "Expired",
  },
  {
    id: 7,
    planName: "Enterprise",
    price: "KSH 999",
    billingCycle: "Yearly",
    subscribers: 85,
    date: "2026-03-05",
    status: "Active",
  },
  {
    id: 8,
    planName: "Starter",
    price: "KSH 199",
    billingCycle: "Monthly",
    subscribers: 240,
    date: "2026-03-08",
    status: "Paused",
  },
  {
    id: 9,
    planName: "Enterprise",
    price: "KSH 999",
    billingCycle: "Yearly",
    subscribers: 60,
    date: "2026-02-20",
    status: "Active",
  },
  {
    id: 10,
    planName: "Starter",
    price: "KSH 199",
    billingCycle: "Monthly",
    subscribers: 310,
    date: "2026-02-15",
    status: "Expired",
  },
  {
    id: 11,
    planName: "Professional",
    price: "KSH 499",
    billingCycle: "Monthly",
    subscribers: 150,
    date: "2026-03-10",
    status: "Active",
  },
  {
    id: 12,
    planName: "Enterprise",
    price: "KSH 999",
    billingCycle: "Yearly",
    subscribers: 45,
    date: "2026-03-11",
    status: "Paused",
  },
];

const PAGE_SIZE = 5;

const statusStyles: Record<Status, string> = {
  Active: "bg-green-50  text-green-600  border border-green-200",
  Paused: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  Expired: "bg-gray-100  text-gray-500   border border-gray-200",
};

export default function SubscriptionManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allSubscriptions.length / PAGE_SIZE);

  const paginated = allSubscriptions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <div>
        <Header title="Subscription Management" subtitle="Manage subscription plans" />
      <div className="bg-[#f0f4f9] min-h-screen p-6">
        {/* Top bar */}
        <div className="flex justify-end mb-4">
          <Button className="h-10 px-5 bg-[#1a2341] hover:bg-[#2a3451] text-white text-sm rounded-xl flex items-center gap-2">
            <Plus size={16} />
            Create New Subscription
          </Button>
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
                  Billing Cycle
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Subscribers
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Date
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
              {paginated.map((sub) => (
                <TableRow
                  key={sub.id}
                  className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-4 px-6 text-sm font-semibold text-[#1a2341]">
                    {sub.planName}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-500">
                    {sub.price}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-500">
                    {sub.billingCycle}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-500">
                    {sub.subscribers}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-500">
                    {sub.date}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span
                      className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] ${statusStyles[sub.status]}`}
                    >
                      {sub.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6">
                    <div className="flex items-center justify-center gap-2">
                      {/* <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-orange-300 text-orange-400 hover:bg-orange-50 hover:text-orange-500 rounded-md"
                      >
                        <Eye size={14} />
                      </Button> */}
                      <ViewSubscriptionsModal />
                      <DeleteModal />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-400">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, allSubscriptions.length)} of{" "}
              {allSubscriptions.length} results
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
  );
}
