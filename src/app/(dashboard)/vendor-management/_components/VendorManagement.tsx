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
import { VendorManagementModal } from "@/components/Dialogs/VendorManagementModal";

type Status = "Active" | "Pending" | "Blocked";

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  services: string;
  status: Status;
}

const allProviders: Provider[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    services: "Plumbing, Electrical",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567890",
    services: "Plumbing, Electrical",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+1234567890",
    services: "Plumbing, Electrical",
    status: "Pending",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "+1234567890",
    services: "Plumbing, Electrical",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Lee",
    email: "charlie@example.com",
    phone: "+1234567890",
    services: "Plumbing, Electrical",
    status: "Active",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana@example.com",
    phone: "+1234567890",
    services: "Plumbing, Electrical",
    status: "Blocked",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    email: "ethan@example.com",
    phone: "+1234567890",
    services: "Roofing, Painting",
    status: "Active",
  },
  {
    id: 8,
    name: "Fiona Green",
    email: "fiona@example.com",
    phone: "+1234567890",
    services: "HVAC, Electrical",
    status: "Pending",
  },
  {
    id: 9,
    name: "George King",
    email: "george@example.com",
    phone: "+1234567890",
    services: "Plumbing, Roofing",
    status: "Active",
  },
  {
    id: 10,
    name: "Helen Troy",
    email: "helen@example.com",
    phone: "+1234567890",
    services: "Painting, HVAC",
    status: "Blocked",
  },
  {
    id: 11,
    name: "Ivan Drago",
    email: "ivan@example.com",
    phone: "+1234567890",
    services: "Electrical, Roofing",
    status: "Active",
  },
  {
    id: 12,
    name: "Julia Roberts",
    email: "julia@example.com",
    phone: "+1234567890",
    services: "Plumbing, Painting",
    status: "Active",
  },
];

const PAGE_SIZE = 5;

const statusStyles: Record<Status, string> = {
  Active: "bg-green-50  text-green-600  border border-green-200",
  Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  Blocked: "bg-red-50    text-red-400    border border-red-200",
};

export default function VendorManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allProviders.length / PAGE_SIZE);

  const paginated = allProviders.slice(
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
      <Header title="Vendor Management" subtitle="Manage all service vendors" />
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
                  Phone
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Services
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
              {paginated.map((provider) => (
                <TableRow
                  key={provider.id}
                  className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-4 px-6 text-sm font-medium text-[#1a2341]">
                    {provider.name}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-500">
                    {provider.email}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-500">
                    {provider.phone}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-500">
                    {provider.services}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span
                      className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] ${statusStyles[provider.status]}`}
                    >
                      {provider.status}
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
                      <VendorManagementModal />
                      <Button
                        size="sm"
                        className="h-8 px-3 bg-[#1a2341] hover:bg-[#2a3451] text-white text-xs rounded-md"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md"
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-400">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, allProviders.length)} of{" "}
              {allProviders.length} results
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
