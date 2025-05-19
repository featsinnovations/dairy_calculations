"use client";

import CustomerList from "@/components/customerlist";
import ProductsPage from "@/components/Productlist";


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 flex justify-center items-center flex-col">
      <div className="w-full ">
        <ProductsPage    />
      </div>
    </main>
  );
}
