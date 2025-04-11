"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/basicapi";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const years = [2023, 2024, 2025];

export default function CustomerIdForm() {
  const [customerId, setCustomerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    async function fetchData() {
      const res = await api.get(
        `/api/payment-summary/?month=${month}&year=${year}`
      );
      console.log(res);
      setCustomers(res.data);
    }
    fetchData();
  }, [month, year]);

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
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
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
        <div className=" space-y-6 overflow-hidden">
          <h1 className="text-2xl font-semibold">Monthly Payment Status</h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="">
              <Label htmlFor="month" className={'mb-1'}>Select Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-[150px]" id="month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <Label htmlFor="year" className={'mb-1'}>Select Year</Label>

              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]" id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className={"sticky top-0 bg-white z-10"}>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Due </TableHead>
                  <TableHead>Paid </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers?.map((customer) => (
                 
                  <TableRow key={customer.customer_id}>
                    
                    <TableCell><Link href={`/detail/${customer.customer_id}`}>{customer.customer_name}</Link></TableCell>
                    <TableCell className={"text-red-600"}>
                      <Link href={`/detail/${customer.customer_id}`}> ₹ {customer.due_amount}</Link>
                    </TableCell>
                    <TableCell className={"text-green-700"}>
                    <Link href={`/detail/${customer.customer_id}`}> ₹ {customer.paid_amount}</Link>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded 
                       ${
                         customer.due_amount === 0
                           ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                           : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                       }`}
                      >
                        <Link href={`/detail/${customer.customer_id}`}>{customer.due_amount === 0 ? "Paid" : "Due"}</Link>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

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
    </>
  );
}
