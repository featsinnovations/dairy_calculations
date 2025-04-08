"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function OrderItem({ order, onClick, isSelected }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b">
      <div>
        <h3 className="font-medium">{order.id}</h3>
        <p className="text-sm text-muted-foreground">{format(order.date, "MMMM d, yyyy")}</p>
      </div>
      <div className="flex items-center gap-4 mt-2 md:mt-0">
        <Badge variant="outline">{order.status}</Badge>
        <span className="font-medium">${order.total.toFixed(2)}</span>
        <Button variant="ghost" size="sm" onClick={onClick}>
          {isSelected ? "Hide details" : "View details"}
        </Button>
      </div>
    </div>
  )
}
