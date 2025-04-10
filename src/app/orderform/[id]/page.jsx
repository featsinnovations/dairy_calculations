"use client";
import OrderForm from "@/components/order-form"


export default function Home() {
  return (
    <main className="min-h-screen h-full flex justify-center items-center flex-col">
      
      <div className=" max-w-md h-full  ">
        
        <OrderForm/>
      </div>
    </main>
  );
}
