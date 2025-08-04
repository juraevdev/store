import { useEffect, useState } from "react"
import { Edit, AlertCircle } from "lucide-react"
import { fetchAllProducts } from "../api/fetch"
import { useMemo } from "react"
import { formatDate } from "../api/utils"
import { Trash2 } from "lucide-react"
import { deleteProduct } from "../api/fetch"

export default function ProductList({ onEdit}) {
  const [ sortField, setSortField ] = useState("name")
  const [ sortDirection, setSortDirection ] = useState("asc")
  const [ product, setProducts ] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetchAllProducts();
        setProducts(response.product)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProduct();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }
  const handleDeleteProduct = async (id) => {
    if (await deleteProduct(id)) {
      setProducts(product.filter(product => product.id !== id));
    }
  };
  


  const sortedProducts = useMemo(() => {
    return [...product].sort((a, b) => {
      if (["price", "quantity", "id"].includes(sortField)) {
        return sortDirection === "asc"
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField]
      } else {
        const aValue = String(a[sortField]).toLowerCase()
        const bValue = String(b[sortField]).toLowerCase()
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
    });
  }, [product, sortField, sortDirection]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Product Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("quantity")}
              >
                Quantity {sortField === "quantity" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("lastUpdated")}
              >
                Last Updated {sortField === "lastUpdated" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <tr key={product.id} className={!product.available ? "bg-gray-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <img
                        src={`http://127.0.0.1:8000${product.image}` || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.price.toLocaleString()} UZS</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(product.lastUpdated)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      product.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full"
                      title="Edit product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        console.log("Deleting product with ID:", product.id);
                        handleDeleteProduct(product.id);
                      }}
                      className="text-gray-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden">
        <div className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-500">
          Showing {product.length} products
        </div>
        <ul className="divide-y divide-gray-200">
          {sortedProducts.map((product) => (
            <li key={product.id} className={`px-4 py-4 ${!product.available ? "bg-gray-50" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 relative">
                    <img
                      src={`http://127.0.0.1:8000${product.image}` || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.category}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                      onClick={() => {
                        console.log("Deleting todo with ID:", todo.id);
                        handleDeleteTodo(todo.id);
                      }}
                      className="text-gray-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 text-sm">
                <div>
                  <span className="text-gray-500">Price:</span>{" "}
                  <span className="font-medium">{product.price.toLocaleString()} UZS</span>
                </div>
                <div>
                  <span className="text-gray-500">Quantity:</span>{" "}
                  <span className="font-medium">{product.quantity}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Last Updated:</span>{" "}
                  <span className="font-medium">{formatDate(product.lastUpdated)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
