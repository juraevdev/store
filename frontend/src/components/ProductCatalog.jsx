import { useEffect, useState } from "react"
import { Phone, MessageCircle, LocationEditIcon } from "lucide-react"
import { fetchCategoriesWithProducts } from "../api/fetch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function ProductCatalog() {
  const [categories, setCategories] = useState([])
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchCategoriesWithProducts()
        setCategories(res.data || res)
      } catch (err) {
        console.error("Error fetching data:", err)
        setCategories([])
      }
    }
    fetchData()
  }, [])

  

  const allProducts = categories.flatMap(cat => cat.products)

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedType === "all" || product.category_slug === selectedType
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const isAvailable = product.available !== false
    return matchesCategory && matchesSearch && isAvailable
  })

  const formatCurrency = (price) =>
    new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      maximumFractionDigits: 0,
    }).format(price)

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Plastmassa Ombori</h1>
            <div className="flex gap-3">
              <a href="tel:+998902645002" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                <Phone className="h-4 w-4" /><span className="hidden sm:inline">Call</span>
              </a>
              <a href="https://t.me/juraevdevpy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md">
                <MessageCircle className="h-4 w-4" /><span className="hidden sm:inline">Telegram</span>
              </a>
              <a href="https://maps.app.goo.gl/VYnTyrLabpZqG8GXA" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md cursor-pointer">
                <LocationEditIcon className="h-4 w-4" /><span className="hidden sm:inline">Manzil</span>
              </a>
              <div className="relative">
                <FaUserCircle size={30} className="cursor-pointer" onClick={togglePopup} />
                {showPopup && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <div
                      onClick={() => {
                        const token = localStorage.getItem("access");
                        if (token) {
                          navigate("/admin");
                        } else {
                          navigate("/login");
                        }
                      }}
                      className="block px-4 py-2 cursor-pointer text-black hover:bg-gray-100"
                    >
                      Admin
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </header>

     
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Our Products</h2>
            <div className="w-full sm:w-64">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className='cursor-pointer'>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className='cursor-pointer'>All Products</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem className='cursor-pointer' key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img src={`https://store-uz-xvuu.onrender.com/${product.image}`} className="h-full max-h-44 object-contain p-4" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                  <span className={`text-sm ${product.quantity > 10 ? "text-green-600" : product.quantity > 0 ? "text-yellow-600" : "text-red-600"}`}>
                    Available: {product.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

       
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Try a different search or filter.</p>
          </div>
        )}
      </main>

    
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="container mx-auto px-4 py-8">

          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Plastmassa Ombori</h3>
              <p className="text-gray-600">Quality plastic products for your home</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Contact Us</h3>
              <p className="text-gray-600">27 Nasaf Street, Jizzax, Uzbekistan</p>
              <p className="text-gray-600">Phone: +998 90 264 50 02</p>
              <a href="https://t.me/juraevdevpy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Telegram: @plastmassa_ombori
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}