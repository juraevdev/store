import axios from "axios"


export const API_BASE_URL = "http://127.0.0.1:8000/";

const   apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });


export const fetchAllProducts = async () => {
  const token = localStorage.getItem("access");
  if (!token) return null;
    try {
        const response = await apiClient.get("/api/v1/store/products/all/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};


export const fetchCategoriesWithProducts = async () => {
  try {
    const response = await apiClient.get("/api/v1/store/category-products/", );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};


export const addProduct = async (data) => {
  const token = localStorage.getItem("access");
  if (!token) {
    console.warn("No token found");
    return;
  }

  try {
    const response = await apiClient.post("api/v1/store/products/create/", data, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error.response || error);
  }
};



export const editProduct = async (id, updatedData) => {
  const token = localStorage.getItem("access");
  if (!token) return null;
  try {
    const response = await apiClient.put(`api/v1/store/products/update/${id}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error editing product:", error);
    return null;
  }
}


export const deleteProduct = async (id) => {
  const token = localStorage.getItem("access");
  if (!token) return null;
  try {
    await apiClient.delete(`api/v1/store/products/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}


export const LoginUser = (data) => apiClient.post("api/v1/accounts/login/", data); 


export const fetchCategories = async () => {
  const token = localStorage.getItem("access");
  if (!token) return null;
    try {
        const response = await apiClient.get("/api/v1/store/category/all/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};