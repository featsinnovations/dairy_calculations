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

function parseDateString(dateStr) {
  if (!dateStr) return null;

  try {
    // Parse format: "2025-04-08 04:59:11 PM"
    const [datePart, timePart] = dateStr.split(" ");
    const [year, month, day] = datePart.split("-");
    const [time, period] = timePart.split(" ");
    const [hours, minutes, seconds] = time.split(":");

    let hour24 = parseInt(hours, 10);
    if (period === "PM" && hour24 < 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    // Create date in local timezone
    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1, // months are 0-indexed
      parseInt(day, 10),
      hour24,
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );

    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    console.error("Date parsing error:", e);
    return null;
  }
}

export function Detaillist() {
  const params = useParams();
  const customerId = params.id;
  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // Months are 0-indexed
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  useEffect(() => {
    if (!customerId) {
      Swal.fire({
        title: "Error",
        text: "Customer ID not found",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const orderhistory = async () => {
      const response = await api.get(
        `/api/customer/${customerId}/orders/?month=${selectedMonth}&year=${selectedYear}`
      );
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
  }, [selectedYear, selectedMonth, customerId]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

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
      image: found?.image || "/amul-gold.png",
    };
  };

  return (
    <div className="space-y-6">
      {/* Orders list */}
      <div className="space-y-4">
        {orderData?.orders?.length === 0 ? (
          <>
            <div className="flex justify-center gap-4 mb-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-4 py-2 border rounded"
              >
                {months?.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border rounded"
              >
                {years?.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground font-bold text-2xl mb-2">
                  No orders found
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-4 mb-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-4 py-2 border rounded"
              >
                {months?.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border rounded"
              >
                {years?.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className=" flex justify-end px-3">
              {orderData?.total_amount && (
                <div className="text-center text-xl font-semibold text-green-700 my-2">
                  Total for {months[selectedMonth - 1]} {selectedYear}: ₹
                  {orderData.total_amount.toFixed(2)}
                </div>
              )}
            </div>
            {orderData?.orders?.map((order) => (
              <Card key={order.order_id}>
                <CardHeader className="p-4 md:p-6">
                  <div className="flex flex-row gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {format(
                          parseDateString(order?.date) || new Date(),
                          "MMMM d, yyyy"
                        )}
                      </CardTitle>
                      <CardDescription>
                        {format(
                          parseDateString(order?.date) || new Date(),
                          "h:mm a"
                        )}
                        <br />
                        ORD-{order?.order_id}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4 ml-5 sm:ml-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOrderClick(order?.order_id)}
                      >
                        {selectedOrder === order?.order_id
                          ? "Hide details"
                          : "View details"}
                      </Button>
                      <span className="font-medium">
                        &#8377;
                        {order?.total_amount
                          ? order.total_amount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {selectedOrder === order?.order_id && (
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
                                {order?.items?.map((item, index) => {
                                  const { label, image } = getProductDetails(
                                    item.product
                                  );
                                  return (
                                    <div
                                      key={`${item.product}-${index}`}
                                      className="flex items-center gap-4"
                                    >
                                      <div className="h-16 w-16 overflow-hidden rounded-md border">
                                        <img
                                          src={image}
                                          alt={label}
                                          className="h-full w-full object-cover"
                                          onError={(e) =>
                                            (e.currentTarget.src =
                                              "/amul-gold.png")
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
                                          ? (
                                              item.quantity * item.price
                                            ).toFixed(2)
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
            ))}
          </>
        )}
      </div>
    </div>
  );
}
