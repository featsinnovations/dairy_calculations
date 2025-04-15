import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
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
import api from "@/lib/basicapi";
  

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
  export default function CustomerList() {
const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [customers, setCustomers] = useState([]);



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


  return (
    <div className=" space-y-6 overflow-hidden">
          <h1 className="text-2xl font-semibold">Monthly Payment Status</h1>

          <div className="flex flex-row  gap-4">
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
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  
                  <TableHead>Due </TableHead>
                  <TableHead>Paid </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers?.map((customer) => (
                 
                  <TableRow key={customer.customer_id}>
                    <TableCell><Link href={`/detail/${customer.customer_id}`}>{customer.customer_id}</Link></TableCell>
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
  )
}