"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/share/Header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function AddSubscription() {
  const [planName, setPlanName] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [features, setFeatures] = useState("");
  const [status, setStatus] = useState("");

  const sessioin = useSession();
  const TOKEN = sessioin?.data?.user?.accessToken;

  const queryClient = useQueryClient();

  const handleCancel = () => {
    setPlanName("");
    setPrice("");
    setBillingCycle("");
    setFeatures("");
    setStatus("");
  };

  const addSubscription = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json",Authorization: `Bearer ${TOKEN}`, },
          body: JSON.stringify({
            name: planName,
            price: Number(price),
            days: Number(billingCycle),
            features: features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean),
            status,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to create subscription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subs"] });
      handleCancel();
    },
  });

  const handleSave = () => {
    addSubscription.mutate();
  };

  return (
    <div>
      <Header
        title="Create New Subscription"
        subtitle="Manage all users and their subscription details"
      />
      <div className="min-h-screen bg-[#f0f4f9] flex flex-col">
        {/* Form Card */}
        <div className="mx-6 mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {/* Row 1: Plan Name + Price */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1a2341]">
                Plan Name
              </label>
              <Select value={planName} onValueChange={setPlanName}>
                <SelectTrigger className="h-12 rounded-lg border-gray-200 text-black text-sm">
                  <SelectValue placeholder="Professional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1a2341]">
                Price
              </label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="KSH 499"
                className="h-12 rounded-lg border-gray-200 text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Row 2: Billing Cycle */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-medium text-[#1a2341]">
              Billing Cycle
            </label>
            <Input
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              placeholder="Yearly"
              className="h-12 rounded-lg border-gray-200 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Row 3: Features */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-medium text-[#1a2341]">
              Features
            </label>
            <Textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Top placement in search results, Featured on homepage, Social media promotion, Priority visibility for 14 days, Enhanced listing badge"
              className="min-h-[80px] rounded-lg border-gray-200 text-sm placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Row 4: Status */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#1a2341]">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-12 rounded-lg border-gray-200 text-black text-sm">
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 px-6 py-5"> 
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={addSubscription.isPending}
            className="h-12 px-10 rounded-[8px] border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={addSubscription.isPending}
            className="h-12 px-10 rounded-[8px] bg-[#1a2341] hover:bg-[#2a3451] text-white text-sm font-medium"
          >
            {addSubscription.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}