"use client";

import { useState } from "react";
import Header from "@/components/share/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: Faq[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

const PAGE_SIZE = 10;

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const queryClient = useQueryClient();
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setEditingFaq(null);
    setFormOpen(false);
  };

  const { data: apiData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["faqs", currentPage],
    enabled: !!TOKEN,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(PAGE_SIZE));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/faq?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { question: string; answer: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/faq`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error("Failed to create FAQ");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setCurrentPage(1);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; question: string; answer: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/faq/${payload.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: payload.question,
            answer: payload.answer,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to update FAQ");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/faq/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${TOKEN}` },
        },
      );
      if (!res.ok) throw new Error("Failed to delete FAQ");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setDeleteId(null);
    },
  });

  const faqs: Faq[] = apiData?.data || [];
  const totalItems = apiData?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

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

  const truncate = (str: string, max = 80) =>
    str.length > max ? str.slice(0, max) + "..." : str;

  const openCreate = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setFormOpen(true);
  };

  const openEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question || "");
    setAnswer(faq.answer || "");
    setFormOpen(true);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const canSubmit = question.trim().length > 0 && answer.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (editingFaq) {
      updateMutation.mutate({
        id: editingFaq._id,
        question: question.trim(),
        answer: answer.trim(),
      });
      return;
    }
    createMutation.mutate({
      question: question.trim(),
      answer: answer.trim(),
    });
  };

  return (
    <>
      <Header
        title="FAQ Management"
        subtitle="Manage frequently asked questions"
      />

      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button
            className="h-10 px-5 bg-[#1a2341] hover:bg-[#2a3451] text-white text-sm rounded-xl flex items-center gap-2"
            onClick={openCreate}
          >
            <Plus size={16} />
            Add FAQ
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-500 py-3 px-6">
                  Question
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Answer
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 py-3">
                  Updated
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
                    <TableCell className="py-4 px-6">
                      <Skeleton className="h-4 w-44" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-64" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-8 w-20 mx-auto rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : faqs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-sm text-gray-400"
                  >
                    No FAQs found.
                  </TableCell>
                </TableRow>
              ) : (
                faqs.map((faq) => (
                  <TableRow
                    key={faq._id}
                    className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="py-4 px-6 text-sm font-medium text-[#1a2341] max-w-[320px]">
                      {truncate(faq.question, 70)}
                    </TableCell>

                    <TableCell className="py-4 text-sm text-gray-500 max-w-[380px]">
                      {truncate(faq.answer, 90)}
                    </TableCell>

                    <TableCell className="py-4 text-sm text-gray-500">
                      {faq.updatedAt
                        ? new Date(faq.updatedAt).toISOString().split("T")[0]
                        : "—"}
                    </TableCell>

                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEdit(faq)}
                          className="h-8 w-8 border-blue-200 text-blue-400 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                        >
                          <Pencil size={14} />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteId(faq._id)}
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

      {/* Add/Edit Modal */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-6 shadow-xl border border-gray-100 [&>button]:hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-[#1a2341]">
              {editingFaq ? "Edit FAQ" : "Add FAQ"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetForm}
              className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800"
            >
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1a2341]">
                Question
              </label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question"
                className="h-11 rounded-lg border-gray-200 text-sm placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1a2341]">
                Answer
              </label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter answer"
                className="min-h-[110px] rounded-lg border-gray-200 text-sm placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              className="h-10 px-6 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50"
              onClick={resetForm}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              className="h-10 px-6 rounded-lg bg-[#1a2341] hover:bg-[#2a3451] text-white"
              onClick={handleSubmit}
              disabled={!canSubmit || isSaving}
            >
              {isSaving
                ? "Saving..."
                : editingFaq
                  ? "Save Changes"
                  : "Create FAQ"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-8 shadow-xl border border-gray-100 [&>button]:hidden">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1a2341]">
                Delete FAQ
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete this FAQ? This action cannot be
                undone.
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
};

export default Page;
