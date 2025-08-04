import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { fetchCategories } from "../api/fetch";

export default function AddProductForm({ onSubmit }) {
  const [categories, setCategories] = useState([]);
  const [categorySlug, setCategorySlug] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      if (data.length > 0) {
        setCategorySlug(data[0].id);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!name.trim()) newErrors.name = "Product name is required";

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!quantity.trim()) {
      newErrors.quantity = "Quantity is required";
    } else if (
      isNaN(Number(quantity)) ||
      Number(quantity) < 0 ||
      !Number.isInteger(Number(quantity))
    ) {
      newErrors.quantity = "Quantity must be a non-negative integer";
    }

    if (!categorySlug) {
      newErrors.category = "Category is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", categorySlug);
    formData.append("available", true);
    formData.append("last_updated", new Date().toISOString());

    if (imageFile) {
      formData.append("image", imageFile); 
    }
    
    const token = localStorage.getItem("access");

    try {
      const response = await fetch("https://store-uz-xvuu.onrender.com/api/v1/store/products/create/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Product created:", data);

      
      setName("");
      setPrice("");
      setQuantity("");
      setImage("");
      setImageFile(null);
      setErrors({});
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  ;

  const handleImageSelect = () => {
    setImage("/placeholder.svg");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Product Type
            </label>
            <select
              id="category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.category ? "border-red-500" : ""}`}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}> 
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (UZS)
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.price ? "border-red-500" : ""}`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.quantity ? "border-red-500" : ""}`}
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-40 h-40 relative border border-gray-300 rounded-md overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt="Product preview"
                className="w-full h-full object-contain"
              />
            </div>

           
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onload = () => setImage(reader.result); 
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
              id="image-upload"
            />

            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </label>

            <p className="text-xs text-gray-500">
              Upload an image file (JPG, PNG, etc.)
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Product
          </button>
        </div>
      </div>  
    </form>
  );
}
