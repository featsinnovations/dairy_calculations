"use client";

import CustomerList from "@/components/customerlist";


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 flex justify-center items-center flex-col">
      <div className="w-full ">
        <CustomerList />
      </div>
    </main>
  );
}
