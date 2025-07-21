import axios from "axios";
import { Users } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const nav = useNavigate();

  const handleLogin = async () => {
    if (loginData.username == "" || loginData.password == "") {
      toast.error("enter your admin details");
      return;
    }

    const request = await axios.post(
      "http://localhost:8081/login",
      loginData.username
    );

    const response = request.data;
    if (response.status !== "success") {
      toast.error(response.messages);
      return;
    }

    if (loginData.password == "123456") {
      toast.success("credentials verified");
      sessionStorage.setItem("isLoggedIn", "loggedIn");
      setTimeout(() => {
        nav("/admin/dashbored");
      }, 2000);
    } else {
      toast.error("invalid admin credentials");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users className="text-indigo-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Employee Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your workforce</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your admin email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
