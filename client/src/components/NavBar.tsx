/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Banknote,
  Building,
  Home,
  LogOut,
  Shield,
  User,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const nav = useNavigate();
  return (
    <nav className="bg-white w-72 hidden md:block shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col justify-between items-center h-16">
          <div className="flex flex-col items-center space-x-8">
            <div className="flex items-center space-x-2 mt-5">
              <Users className="text-indigo-600 w-8 h-8" />
              <span className="text-xl font-bold text-gray-800">HR Portal</span>
            </div>

            <div className="flex flex-col gap-4  mt-10 space-x-4">
              <NavLink
                to="/admin/dashbored"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-gray-300 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900"
                  } flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors`
                }
              >
                <Home className="w-4 h-4" />
                <span>Dashbored</span>
              </NavLink>
              <NavLink
                to="/admin/e"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-gray-300 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900"
                  } flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors`
                }
              >
                <User className="w-4 h-4" />
                <span>Employees</span>
              </NavLink>

              <NavLink
                to="/admin/roles"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-gray-300 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900"
                  } flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors`
                }
              >
                <Shield className="w-4 h-4" />
                <span>Roles</span>
              </NavLink>

              <NavLink
                to="/admin/department"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-gray-300 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900"
                  } flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors`
                }
              >
                <Building className="w-4 h-4" />
                <span>Department</span>
              </NavLink>

              <button className="flex mt-20 items-center space-x-2 text-red-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                <span
                  onClick={() => {
                    sessionStorage.removeItem("isLoggedIn");
                    nav("/");
                  }}
                >
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
