import { useState } from "react";
import ProductList from "./ProductList";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import { addProduct } from "../api/fetch";
import { Trash2 } from "lucide-react"
import { deleteProduct } from "../api/fetch"

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = async (newProductData) => {
    try {
      const newProduct = await addProduct(newProductData);
      setProducts(prev => [...prev, newProduct]);
      setIsAddingProduct(false);
    } catch (error) {
      console.error("Mahsulot qo‘shishda xatolik:", error);
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(product =>
      product.id === updatedProduct.id
        ? { ...updatedProduct, lastUpdated: new Date().toISOString() }
        : product
    ));
    setEditingProduct(null);
  };

  const handleDeleteTodo = async (id) => {
    if (await deleteProduct(id)) {
      setTodos(product.filter(product => product.id !== id));
    }
  };

  const handleToggleAvailability = (id) => {
    setProducts(products.map(product =>
      product.id === id
        ? {
            ...product,
            available: !product.available,
            lastUpdated: new Date().toISOString()
          }
        : product
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Plastmassa Ombori - Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isAddingProduct ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
            <AddProductForm onSubmit={handleAddProduct} />
          </div>
        ) : editingProduct ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
            <EditProductForm product={editingProduct} onSubmit={handleUpdateProduct} />
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Product Inventory</h2>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-lg"
              >
                + Add New Product
              </button>
            </div>
            <ProductList
              products={products}
              onEdit={setEditingProduct}
              onToggleAvailability={handleToggleAvailability}
            />
          </>
        )}
      </main>
    </div>
  );
}
