import CustomerIdForm from "@/components/customer-id";
import OrderForm from "@/components/order-form"


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 flex item-center mt-20 flex-col">
      <div className="mx-auto max-w-md ">
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">Milk Order Tracker</h1>
        <CustomerIdForm/>
      </div>
    </main>
  );
}
