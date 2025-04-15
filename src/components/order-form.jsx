"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/basicapi";
import { Minus, Plus } from "lucide-react";

const productList = [
  {
    id: 8,
    key: "amul_gold",
    label: "Amul Gold (500 ml)",
    image: "/amul-gold.png",
  },
  {
    id: 9,
    key: "amul_taza",
    label: "Amul Taza (500 ml)",
    image: "/amul-tazza.png",
  },
  {
    id: 10,
    key: "amul_slim",
    label: "Amul Slim & Trim (500 ml)",
    image: "/amul-t-special.png",
  },
  {
    id: 11,
    key: "amul_buffalo",
    label: "Amul Buffalo Milk (500 ml)",
    image: "/amul-buffalo.png",
  },
  {
    id: 12,
    key: "amul_shakti",
    label: "Amul Shakti (500 ml)",
    image: "/amul-shakti.jpg",
  },
  {
    id: 13,
    key: "amul_masti",
    label: "Amul Masti Buttermilk (500 ml)",
    image: "/butter-milk.png",
  },
  {
    id: 14,
    key: "mother_dairy_buttermilk",
    label: "Mother Dairy Buttermilk (500 ml)",
    image: "/butter-milk.png",
  },
];

// This is an implementation with all products listed statically with images

export default function StaticOrderForm() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id;
  const [name, setName] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [availableProducts, setAvailableProducts] = useState([]);

  const [products, setProducts] = useState({
    amul_gold: 0,
    amul_taza: 0,
    amul_slim: 0,
    amul_buffalo: 0,
    amul_shakti: 0,
    amul_masti: 0,
    mother_dairy_buttermilk: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const featchinfo = async () => {
      try {
        const res = await api.get(`/api/customers/${customerId}/total-due/`);
        console.log(res);
        setName(res.data.customer_name);
        setTotalAmount(res.data.total_due);
        // setTotalAmount(res.data.total_amount);
        const productRes = await api.get("/api/products/");
        setAvailableProducts(productRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    featchinfo();
  }, []);

  const handleQuantityChange = (product, value) => {
    const quantity = Number.parseInt(value) || 0;
    setProducts({
      ...products,
      [product]: quantity, // ✅ correct
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!customerId.trim()) {
      Swal.fire({
        title: "Error",
        text: "Customer ID is missing",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      setIsSubmitting(false);
      return;
    }

    const orderItems = Object.entries(products)
      .filter(([_, qty]) => qty > 0)
      .map(([key, quantity]) => {
        const productData = availableProducts.find((p) => p.name === key);
        return {
          product_id: productData?.id,
          quantity,
        };
      });

    if (orderItems.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please add at least one product",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      id: customerId,
      items: orderItems,
    };

    try {
      const response = await api.post("/api/orders/", payload);
      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Order has been submitted",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          // Redirect to the order details page
          router.push(`/`);
        });
      }

      // Reset form

      setProducts({
        amul_gold: 0,
        amul_taza: 0,
        amul_slim: 0,
        amul_buffalo: 0,
        amul_shakti: 0,
        amul_masti: 0,
        mother_dairy_buttermilk: 0,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while submitting the order",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="">
        <h1 className="bg-gradient-to-b from-yellow-400 to-white text-xl p-7 w-full  font-bold text-gray-800">
          Milk Order Tracker
        </h1>

        <Card className="w-full rounded-t-none border-t-0">
          <CardContent className=" space-y-4">
            <Label htmlFor="customerId">Customer ID : {customerId}</Label>
            <p className="text-2xl font-bold">{name}</p>
            <p className="text-sm font-medium text-green-600">
              Overall due: ₹{totalAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 px-4 mt-3  flex flex-col h-[100dvh]"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Milk Products</h2>

          <div className="grid grid-cols-2 gap-4">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center gap-3"
              >
                <Card className={"w-full"}>
                  <CardContent className="p-4 space-y-4">
                    <div className="w-30 h-30 shrink-0">
                      <Image
                        src={product.image_path}
                        alt={product.nickname}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={product.name} className="block">
                        {product.nickname}
                      </Label>
                      <div className="flex flex-row justify-between">
                        <Label
                          htmlFor={product.name}
                          className="block text-gray-500 mt-1"
                        >
                          ₹{product.price}
                        </Label>
                        <span className="bg-gray-200 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">
                          {product?.quentity}
                        </span>
                      </div>
                      <div className="mt-7">
                        <p className="text-sm text-gray-700">
                          Quantity: {products[product.name] || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row justify-center">
                      <div className="flex items-center mr-3 ">
                        <Button
                          // style={{ backgroundColor: '#155e63'}}
                          // className={"bg-red-500"}
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              product.name,
                              (products[product.name] || 0) + 1
                            )
                          }
                        >
                          <Plus strokeWidth={4} />
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <Button
                          // style={{ backgroundColor: '#155e63'}}
                          // className={"bg-red-500"}
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              product.name,
                              Math.max((products[product.name] || 0) - 1, 0)
                            )
                          }
                        >
                          <Minus strokeWidth={4} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="sticky bottom-13 bg-transparent  z-20  p-4">
            <Button
              type="submit"
              className="w-full font-bold text-xl "
              // style={{ backgroundColor: '#155e63'}}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Record Order"}
            </Button>
          </div>
          <div className="-mx-4 px-4 w-screen sm:w-full bg-gray-200 text-center min-h-[200px] flex justify-center items-center-safe z-30">
            <p className="text-3xl font-black text-gray-400">
              From Farm to Family , Fresh Milk Daily{" "}
              <span className="text-red-500 text-3xl">&hearts;</span>
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
