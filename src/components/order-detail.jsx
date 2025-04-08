export function OrderDetails({ order }) {
    return (
      <div className="space-y-6 p-4 bg-muted/20">
        <div>
          <h3 className="font-medium mb-2">Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-md border">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="font-medium">${(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    )
  }
  