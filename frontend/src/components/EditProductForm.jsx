import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { fetchCategories } from "../api/fetch";

const EditProductForm = ({ product, setRefresh }) => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(product?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editedProduct, setEditedProduct] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    quantity: product?.quantity || "",
    available: product?.available || false,
    category: product?.category?.id || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const editProduct = async (productId, formData) => {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/store/products/update/${productId}/`, {
      method: "PUT",
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Server error");
    }
    
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", editedProduct.name);
    formData.append("description", editedProduct.description);
    formData.append("price", editedProduct.price);
    formData.append("quantity", editedProduct.quantity);
    formData.append("available", editedProduct.available);
    formData.append("category", editedProduct.category);
    
    if (imageFile && imageFile instanceof File) {
      formData.append("image", imageFile);
    }

    try {
      const response = await editProduct(product.id, formData);
      
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(imageFile);
      }
      
      if (setRefresh) setRefresh(prev => !prev);
      
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors(error.response?.data || {});
    } finally {
      setIsSubmitting(false);
    }
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
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={editedProduct.description}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Product Type
            </label>
            <select
              id="category"
              name="category"
              value={editedProduct.category}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.category ? "border-red-500" : ""
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (UZS)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={editedProduct.price}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.price ? "border-red-500" : ""
              }`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={editedProduct.quantity}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.quantity ? "border-red-500" : ""
              }`}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="available"
              name="available"
              type="checkbox"
              checked={editedProduct.available}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
              Product is available for sale
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
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
      </div>

      {errors.server && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
          {errors.server}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default EditProductForm;