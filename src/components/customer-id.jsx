"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/basicapi";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomerIdForm() {
  const [customerId, setCustomerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch customers on component mount
  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await api.get("/api/customers/monthly-totals/");
  //       if (res.status === 200) {
  //         // Handle different possible response structures
  //         const customersData = Array.isArray(res.data)
  //           ? res.data
  //           : res.data?.customers || [];
  //         setCustomers(customersData);
  //       } else {
  //         console.error("Failed to fetch customers");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching customers:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchCustomers();
  // }, []);

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
      const res = await api.get(`/api/customers/verify/${customerId}/`);
      if (res.status === 200) {
        router.push(`/orderform/${customerId}`);
      } else {
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
  const handledetail = async (e) => {
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
      const res = await api.get(`/api/customers/verify/${customerId}/`);
      if (res.status === 200) {
        router.push(`/detail/${customerId}`);
      } else {
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

  const handleCustomerSelect = (id) => {
    router.push(`/orderform/${id}`);
  };

  // Filter customers based on search term
  const filteredCustomers = Array.isArray(customers)
    ? customers.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.id?.toString().includes(searchTerm)
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Original Customer ID Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <div className="space-y-2">
          <Label
            htmlFor="customerId"
            className="text-lg font-semibold text-gray-700"
          >
            Customer ID
          </Label>
          <Input
            id="customerId"
            type="tel"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter customer ID"
            className="w-full h-12 text-lg px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full h-12 text-lg rounded-xl bg-black transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Customer"}
        </Button>
        <Button
          type="button"
          className="w-full h-12 text-lg rounded-xl bg-black transition-colors duration-200"
          onClick={handledetail}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Customer Detail"}
        </Button>
      </form>

      {/* Customer List Section */}
      {/* <div className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Customer List
        </h2>

        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1  gap-6">
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border rounded-xl"
                onClick={() => handleCustomerSelect(customer.id)}
              >
                <CardContent className="p-5 space-y-2">
                  <div className="font-semibold text-xl text-gray-800">
                    {customer.name}
                  </div>
                  <div className="flex flex-row">
                  <div className="text-sm text-gray-500">
                    ID: {customer.id}
                  </div>
                  <div className="text-sm font-medium text-green-600">
                   &nbsp; &nbsp; Monthly Total: ₹{customer.total_amount.toFixed(2)}
                  </div></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {searchTerm
              ? "No customers found matching your search"
              : "No customers available"}
          </div>
        )}
      </div> */}
    </div>
  );
}
