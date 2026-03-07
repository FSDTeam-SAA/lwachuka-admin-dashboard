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
// import { PropertyListingsModal } from "@/components/Dialogs/PropertyListingsModal";
import { DeleteModal } from "@/components/Dialogs/DeleteModal";

type Status = "Approved" | "Pending" | "Rejected";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  type: string;
  agent: string;
  status: Status;
}

const allProperties: Property[] = [
  {
    id: 1,
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 85.0M",
    type: "Sale",
    agent: "John Doe",
    status: "Approved",
  },
  {
    id: 2,
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 85.0M",
    type: "Sale",
    agent: "John Doe",
    status: "Approved",
  },
  {
    id: 3,
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 85.0M",
    type: "Sale",
    agent: "John Doe",
    status: "Pending",
  },
  {
    id: 4,
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 85.0M",
    type: "Sale",
    agent: "John Doe",
    status: "Approved",
  },
  {
    id: 5,
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 85.0M",
    type: "Sale",
    agent: "John Doe",
    status: "Approved",
  },
  {
    id: 6,
    title: "Modern 3-Bedroom Apartment in Westland's",
    location: "Nairobi, Karen",
    price: "KES 85.0M",
    type: "Sale",
    agent: "John Doe",
    status: "Rejected",
  },
  {
    id: 7,
    title: "Luxury Villa with Pool in Runda",
    location: "Nairobi, Runda",
    price: "KES 120.0M",
    type: "Sale",
    agent: "Jane Smith",
    status: "Approved",
  },
  {
    id: 8,
    title: "2-Bedroom Condo in Kilimani",
    location: "Nairobi, Kilimani",
    price: "KES 45.0M",
    type: "Rent",
    agent: "Alice Brown",
    status: "Pending",
  },
  {
    id: 9,
    title: "Commercial Space in Westlands",
    location: "Nairobi, Westlands",
    price: "KES 200.0M",
    type: "Commercial",
    agent: "Bob Johnson",
    status: "Approved",
  },
  {
    id: 10,
    title: "Studio Apartment in Upperhill",
    location: "Nairobi, Upperhill",
    price: "KES 22.0M",
    type: "Rent",
    agent: "Charlie Lee",
    status: "Rejected",
  },
  {
    id: 11,
    title: "4-Bedroom Townhouse in Lavington",
    location: "Nairobi, Lavington",
    price: "KES 95.0M",
    type: "Sale",
    agent: "Diana Prince",
    status: "Approved",
  },
  {
    id: 12,
    title: "Penthouse Suite in Parklands",
    location: "Nairobi, Parklands",
    price: "KES 150.0M",
    type: "Sale",
    agent: "Ethan Hunt",
    status: "Pending",
  },
];

const PAGE_SIZE = 5;

const statusStyles: Record<Status, string> = {
  Approved: "bg-green-50  text-green-600  border border-green-200",
  Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  Rejected: "bg-red-50    text-red-400    border border-red-200",
};

type FilterStatus = "All Status" | Status;

export default function PaymentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All Status");

  const filtered =
    filterStatus === "All Status"
      ? allProperties
      : allProperties.filter((p) => p.status === filterStatus);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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

  return (
    <div>
      {/* Filter */}

      <div className="">
        <div className="flex justify-end px-6 pt-4 pb-2">
          <Select
            value={filterStatus}
            onValueChange={(val: string) => handleFilter(val as FilterStatus)}
          >
            <SelectTrigger className="h-9 w-36 text-sm text-gray-600 border-gray-200 rounded-lg">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent align="end">
              {(
                [
                  "All Status",
                  "Approved",
                  "Pending",
                  "Rejected",
                ] as FilterStatus[]
              ).map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  className="text-sm cursor-pointer"
                >
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500 py-3 px-6">
                    Title
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">
                    Location
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">
                    Price
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 py-3">
                    Agent
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
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-sm text-gray-400"
                    >
                      No properties found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((property) => (
                    <TableRow
                      key={property.id}
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="py-4 px-6 text-sm font-medium text-[#1a2341] max-w-[240px]">
                        {property.title}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">
                        {property.location}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">
                        {property.price}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">
                        {property.type}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-500">
                        {property.agent}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span
                          className={`inline-block px-4 py-1 rounded-md text-xs font-medium min-w-[80px] ${statusStyles[property.status]}`}
                        >
                          {property.status}
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
                          {/* <PropertyListingsModal /> */}
                          {/* <Button
                            size="sm"
                            className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md"
                          >
                            Block
                          </Button> */}
                          <DeleteModal />
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
                Showing{" "}
                {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}{" "}
                to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} results
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
                  disabled={currentPage === totalPages || totalPages === 0}
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
