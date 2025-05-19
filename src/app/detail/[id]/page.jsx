"use client";

import { Detaillist } from "@/components/detail-list";


export default function Home() {
  return (
    <main className="min-h-full bg-gray-100 p-4 flex justify-center items-center flex-col">
      <div className="w-full ">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Milk Order Tracker</h1>
        <Detaillist />
      </div>
    </main>
  );
}
