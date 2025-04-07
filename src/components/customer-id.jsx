"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/basicapi";
import { useRouter } from "next/navigation";

export default function CustomerIdForm() {
  const [customerId, setCustomerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!customerId.trim()) {
      Swal.fire({
        title: "Error",
        text: "Please enter a customer ID",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.get(`/api/customers/${customerId}/`);
        if(res.status === 200  ){
            router.push(`/orderform/${customerId}`);
        } 
        else {
            Swal.fire({
                title: "Error",
                text: "Customer ID not found",
                icon: "error",
                confirmButtonColor: "#3085d6",
              });
        }

      setCustomerId("");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customerId">Customer ID</Label>
        <Input
          id="customerId"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Enter customer ID"
          className="w-full"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify Customer"}
      </Button>
    </form>
  );
}
