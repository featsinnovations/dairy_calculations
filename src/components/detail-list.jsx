"use client";

import { useEffect, useState } from "react";
import { parse, format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/basicapi";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";


export function Detaillist() {
  const params = useParams();
  const customerId = params.id;
  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const orderhistory = async () => {
      const response = await api.get(`/api/orders/${customerId}/`);
      if (response.status === 200) {
        setOrderData(response.data);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch order history",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    };
    orderhistory();
  }, []);

  console.log(orderData);

  const handleOrderClick = (orderId) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };
  const productMeta = [
    { key: "amul_gold", label: "Amul Gold (500 ml)", image: "/amul-gold.png" },
    { key: "amul_taza", label: "Amul Taza (500 ml)", image: "/amul-tazza.png" },
    {
      key: "amul_slim",
      label: "Amul Slim & Trim (500 ml)",
      image: "/amul-t-special.png",
    },
    {
      key: "amul_buffalo",
      label: "Amul Buffalo Milk (500 ml)",
      image: "/amul-buffalo.png",
    },
    {
      key: "amul_shakti",
      label: "Amul Shakti (500 ml)",
      image: "/amul-shakti.jpg",
    },
    {
      key: "amul_masti",
      label: "Amul Masti Buttermilk (500 ml)",
      image: "/butter-milk.png",
    },
    {
      key: "mother_dairy_buttermilk",
      label: "Mother Dairy Buttermilk (500 ml)",
      image: "/butter-milk.png",
    },
  ];
  const getProductDetails = (key) => {
    const found = productMeta.find((item) => item.key === key);
    return {
      label:
        found?.label ||
        key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      image: found?.image || "/placeholder.svg",
    };
  };

  return (
    <div className="space-y-6">
      {/* Orders list */}
      <div className="space-y-4">
        {orderData?.orders?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-2">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          orderData?.orders?.map((order) => (
            <Card key={order.order_id}>
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-row gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      ORD-{order.order_id}
                    </CardTitle>
                    <CardDescription>
                      {order.date
                        ? format(new Date(order.date), "MMMM d, yyyy h:mm a")
                        : "Invalid date"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4 ml-5 sm:ml-0">
                    <span className="font-medium">
                      &#8377;
                      {order?.total_amount
                        ? order.total_amount.toFixed(2)
                        : "0.00"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOrderClick(order.order_id)}
                    >
                      {selectedOrder === order.order_id
                        ? "Hide details"
                        : "View details"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <AnimatePresence initial={false}>

              {selectedOrder === order.order_id && (
                <>
                <motion.div
      key="details"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
                  <Separator />
                  <CardContent className="p-4 md:p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Items</h3>
                        <div className="space-y-3">
                          {order.items.map((item) => {
                            const { label, image } = getProductDetails(
                              item.product
                            );
                            return (
                              <div
                                key={item.product}
                                className="flex items-center gap-4"
                              >
                                <div className="h-16 w-16 overflow-hidden rounded-md border">
                                  <img
                                    src={image}
                                    alt={label}
                                    className="h-full w-full object-cover"
                                    onError={(e) =>
                                      (e.currentTarget.src = "/placeholder.svg")
                                    }
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {item.quantity} × &#8377;
                                    {item?.price
                                      ? item.price.toFixed(2)
                                      : "0.00"}
                                  </p>
                                </div>
                                <div className="font-medium">
                                  &#8377;
                                  {item?.quantity && item?.price
                                    ? (item.quantity * item.price).toFixed(2)
                                    : "0.00"}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 md:p-6 bg-muted/50">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Total
                      </p>
                      <p className="text-lg font-bold">
                        &#8377;
                        {order?.total_amount
                          ? order.total_amount.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </CardFooter>
                  </motion.div>
                </>
              )}
              </AnimatePresence>

            </Card>
          ))
        )}
      </div>
    </div>
  );
}
