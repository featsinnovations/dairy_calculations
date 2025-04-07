"use client";
import OrderForm from "@/components/order-form"


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 flex justify-center items-center flex-col">
      <div className="mx-auto max-w-md ">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Milk Order Tracker</h1>
        <OrderForm/>
      </div>
    </main>
  );
}
