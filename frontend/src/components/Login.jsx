import React, { useState } from "react";
import { User, ArrowRight } from "lucide-react";
import { LoginUser } from "../api/fetch";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
  
    if (!username.trim()) {
      setError("Please enter your name");
      return;
    }
  
    if (username.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await LoginUser({ username: username });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/admin");
    } catch (error) {
      console.error("Error while login:", error);
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              error ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            <div className="flex items-center">
              Sign in to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">Enter your name to access the admin dashboard</p>
      </div>
    </form>
  );
}
