"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export function DeleteModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md"
        >
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[380px] p-6 gap-0 rounded-xl border shadow-xl">
        {/* Warning Icon + Title */}
        <DialogHeader className="pb-4">
          <div className="items-start gap-4 ">
            {/* Alert Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            {/* Text Content */}
            <div className="mt-5">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Are You Sure?
              </DialogTitle>

              <DialogDescription className="text-base text-gray-600 mt-2">
                Are you sure you want to delete this Message?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Buttons */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              // এখানে তোমার delete logic যোগ করবে
              console.log("Message deleted!");
              // API call / state update ইত্যাদি
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
