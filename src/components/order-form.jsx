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
  { id: 8, key: "amul_gold", label: "Amul Gold (500 ml)", image: "/amul-gold.png" },
  { id: 9, key: "amul_taza", label: "Amul Taza (500 ml)", image: "/amul-tazza.png" },
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
        const res = await api.get(`/api/customers/verify/${customerId}/`);
        setName(res.data.name);
        setTotalAmount(res.data.total_amount);
        // setTotalAmount(res.data.total_amount);
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
        const productData = productList.find((p) => p.key === key);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customerId">Customer ID : {customerId}</Label>
        <p className="text-2xl font-medium">{name}</p>
        <p className="text-sm font-medium text-green-600">
                   Monthly Total: ₹{totalAmount.toFixed(2)}
                  </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Milk Products</h2>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {productList.map((product) => (
                <div key={product.key} className="flex items-center gap-3">
                  <div className="w-16 h-16 shrink-0">
                    <Image
                      src={product.image}
                      alt={product.label}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={product.key} className="mb-1 block">
                      {product.label}
                    </Label>
                    <Input
                      id={product.key}
                      type="number"
                      min="0"
                      value={products[product.key] || ""}
                      onChange={(e) =>
                        handleQuantityChange(product.key, e.target.value)
                      }
                      className="w-full"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-5">
                    <Button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          product.key,
                          (products[product.key] || 0) + 1
                        )
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 mt-5">
                    <Button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          product.key,
                          Math.max((products[product.key] || 0) - 1, 0)
                        )
                      }
                    >
                      <Minus />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Record Order"}
      </Button>
    </form>
  );
}
