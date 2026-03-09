"use client";

// import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Eye, Loader2, X } from "lucide-react";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactManagementModalProps {
  contactId: string;
}

export function ContactManagementModal({ contactId }: ContactManagementModalProps) {
  const { data: contact, isLoading } = useQuery({
    queryKey: ["singleContact", contactId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/contact/${contactId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch contact");
      const json = await res.json();
      return json.data as Contact;
    },
    enabled: !!contactId,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="h-8 w-8 flex items-center justify-center rounded-md border border-orange-300 text-orange-400 hover:bg-orange-50 transition-colors">
          <Eye size={14} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl p-0 shadow-xl border border-gray-100 [&>button]:hidden overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-[#1a2341]">
            Contact Details
          </h2>
          <DialogClose asChild>
            <button className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-orange-400" />
            </div>
          )}

          {/* Data */}
          {contact && (
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">
                  First Name
                </span>
                <span className="text-sm text-gray-500">{contact.firstName}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">
                  Last Name
                </span>
                <span className="text-sm text-gray-500">{contact.lastName}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">
                  Email
                </span>
                <span className="text-sm text-gray-500">{contact.email}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">
                  Phone
                </span>
                <span className="text-sm text-gray-500">{contact.phone}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">
                  Created At
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(contact.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Message — full width */}
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide">
                  Message
                </span>
                <span className="text-sm text-gray-500 leading-relaxed">
                  {contact.message}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}