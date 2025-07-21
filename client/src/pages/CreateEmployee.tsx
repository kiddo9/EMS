import axios from "axios";
import { Users } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useRoles from "../hooks/useRoles";
import useDepartment from "../hooks/useDepartment";

const CreateEmployee = () => {
  const [firstName, setFirstName] = useState<string | undefined>("");
  const [lastName, setLastName] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [role, setRole] = useState<string | undefined>("");
  const [dept, setDept] = useState<number | undefined>();

  const body = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: role,
    dept: Number(dept),
  };

  function resetFields() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("");
    setDept(0);
  }

  const navigate = useNavigate();
  const { allRoles } = useRoles();
  const { departments } = useDepartment();

  const handleNewEmployeeCreation = async () => {
    try {
      const sendRequest = await axios.post(
        "http://localhost:8081/create/employee",
        body
      );
      const response = sendRequest.data;
      if (response.status !== "success") {
        toast.error(response.messages);
        return;
      }

      toast.success(response.messages);
      resetFields();
      setTimeout(() => {
        navigate("/admin/e");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100  p-4">
      {" "}
      <ToastContainer />
      <div className={`flex items-center justify-center mt-8`}>
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="text-indigo-600 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">New Employee</h1>
            <p className="text-gray-600 mt-2">enter information carefully</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                first Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your Last name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                name=""
                id=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={dept}
                onChange={(e) => setDept(Number(e.target.value))}
              >
                <option value="">select role</option>
                {departments.map((department) => (
                  <option value={department?.id}>
                    {department?.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name=""
                id=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">select role</option>
                {allRoles.map((roles) => (
                  <option value={roles?.id}>{roles?.title}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNewEmployeeCreation}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
