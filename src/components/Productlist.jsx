"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Pencil, Plus, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import api from "@/lib/basicapi"

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  nickname: z.string().min(2, { message: "Nickname must be at least 2 characters" }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Price must be a valid number" }),
  quentity: z.string().min(2, { message: "Quantity must be at least 2 characters" }),
})

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [productToDelete, setProductToDelete] = useState(null);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nickname: "",
      price: "",
      quentity: "",
    },
  })

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Reset form when selected product changes
  useEffect(() => {
    if (selectedProduct && isEditing) {
      form.reset({
        name: selectedProduct.name,
        nickname: selectedProduct.nickname,
        price: selectedProduct.price,
        quentity: selectedProduct.quentity,
      })
      setImagePreview(selectedProduct.image_path)
    } else if (!isEditing) {
      form.reset({
        name: "",
        nickname: "",
        price: "",
        quentity: "",
      })
      setImagePreview(null)
      setImageFile(null)
    }
  }, [selectedProduct, isEditing, form])

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await api.get("/api/products")
      
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    }
  }

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      console.log("file selected :",file)
    }
  }

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("nickname", values.nickname)
      formData.append("price", values.price)
      formData.append("quentity", values.quentity)

      if (imageFile) {
        formData.append("image_path", imageFile)
      }

      let url = "/api/products/create/"
      let method = "post"

      if (isEditing && selectedProduct) {
        url = `/api/products/${selectedProduct.id}/update/`
        method = "put"
      }

      const response = await api[method](url, formData)

      if (response.status === 201 || response.status === 200) {
        toast.success(isEditing ? "Product updated successfully" : "Product added successfully")
        fetchProducts()
        setIsEditing(false)
        setSelectedProduct(null)
        form.reset({
          name: "",
          nickname: "",
          price: "",
          quentity: "",
        })
        setImagePreview(null)
        setImageFile(null)
        setIsDialogOpen(false)
      } else {
        throw new Error("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Failed to save product")
    }
  }

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete product
//   const handleDeleteProduct = async (id) => {
//     if (confirm("Are you sure you want to delete this product?")) {
//       try {
//         const response = await api.delete(`/api/products/${id}/delete/`)

//         if (response.status === 204) {
//           toast.success("Product deleted successfully")
//           fetchProducts()
//         } else {
//           throw new Error("Failed to delete product")
//         }
//       } catch (error) {
//         console.error("Error deleting product:", error)
//         toast.error("Failed to delete product")
//       }
//     }
//   }
  const handleDeleteProduct = (product) => {
    setProductToDelete(product); // Store the product to be deleted
    setIsDeleteDialogOpen(true); // Open the confirmation dialog
  }

  // Handle add new product
  const handleAddProduct = () => {
    setIsEditing(false)
    setSelectedProduct(null)
    form.reset({
      name: "",
      nickname: "",
      price: "",
      quentity: "",
    })
    setImagePreview(null)
    setImageFile(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Product Management</h1>
        <Button onClick={handleAddProduct} className="flex items-center font-bold">
          <Plus className="mr-2 h-4 w-4 " /> Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.image_path || "/placeholder.svg?height=200&width=200"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{product.nickname}</h3>
              <p className="text-sm text-muted-foreground">{product.name}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="font-medium">₹{product.price}</p>
                <p className="text-sm">{product.quentity}</p>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                {/* <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="Product nickname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="22.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quentity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="500 ml" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Product Image</FormLabel>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <label
                      htmlFor="image-upload"
                      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Upload Image</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Update Product" : "Add Product"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent className="sm:max-w-[400px]">
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
    </DialogHeader>
    <p>Are you sure you want to delete this product?</p>
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={async () => {
          try {
            const response = await api.delete(`/api/products/${productToDelete}/delete/`);
            if (response.status === 204) {
              toast.success("Product deleted successfully");
              fetchProducts();
            } else {
              throw new Error("Failed to delete product");
            }
          } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
          }
          setIsDeleteDialogOpen(false); // Close the dialog after deletion
        }}
      >
        Delete
      </Button>
    </div>
  </DialogContent>
</Dialog> */}
    </div>
  )
}
