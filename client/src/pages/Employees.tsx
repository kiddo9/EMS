/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, Mail, Plus, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import UseEmployeeHook from "../hooks/UseEmployeeHook";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useRoles from "../hooks/useRoles";
import useDepartment from "../hooks/useDepartment";

interface EmployeeProps {
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  dept: number;
}

export default function EmployeePage() {
  const [switchee, setSwitchee] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);

  const [employeeInfo, setemployeeInfo] = useState<EmployeeProps>({
    firstName: "",
    lastName: "",
    email: "",
    role: 0,
    dept: 0,
  });

  async function getEmployeeById(id: string) {
    try {
      const sendRequest = await axios.get(
        `http://localhost:8081/employees/id?uuid=${id}`
      );
      const response = sendRequest.data;
      setemployeeInfo(response);

      if (response.status !== "success") {
        console.log(response.messages);
      }
      return;
    } catch (error) {
      console.log(error);
    }
  }

  function editFunction(id: string) {
    setEdit(!edit);
    getEmployeeById(id);
  }
  const navigate = useNavigate();

  const { allEmployees } = UseEmployeeHook();
  const { allRoles } = useRoles();
  const { departments } = useDepartment();

  const handleEmployeeDataUpdate = async () => {
    try {
      const sendRequest = await axios.put(
        `http://localhost:8081/employees/id?uuid=${employeeInfo?.uuid}`,
        employeeInfo
      );
      const response = sendRequest.data;
      if (response.status !== "success") {
        toast.error(response.messages);
        return;
      }
      toast.success(response.messages);
      setTimeout(() => {
        setSwitchee("");
        navigate(`/refresh?path=${"/admin/e"}`);
        setEdit(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmployeeDataDelete = async (uuid: string) => {
    try {
      const sendRequest = await axios.delete(
        `http://localhost:8081/employees/id?uuid=${uuid}`
      );
      const response = sendRequest.data;
      if (response.status !== "success") {
        toast.error(response.messages);
        return;
      }
      toast.success(response.messages);
      setTimeout(() => {
        setSwitchee("");
        navigate(`/refresh?path=${"/admin/e"}`);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100  p-4">
      <ToastContainer />

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Employee Management
            </h1>
            <p className="text-gray-600">
              Manage employees and their information
            </p>
          </div>
          <a
            href="/admin/create/employee"
            className=" bg-indigo-600 flex items-center justify-center gap-5 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus /> Add New Employee
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            All Employees ({allEmployees.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {employee.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {allRoles.map(
                      (roles) =>
                        employee.role == roles.id && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {roles.title}
                          </span>
                        )
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {departments.map(
                      (dept) =>
                        employee?.dept == dept.id && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {dept.department}
                          </span>
                        )
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {allEmployees.map(
                      (employee) =>
                        employee.created_by == employee.id && (
                          <p>
                            {employee.firstName} {employee.lastName}
                          </p>
                        )
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {/* <button
                        //onClick={() => handleViewEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Employee"
                      >
                        <Eye className="w-4 h-4" />
                      </button> */}
                      <button
                        onClick={() => editFunction(employee.uuid)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                        title="Edit Employee"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEmployeeDataDelete(employee?.uuid)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* edit */}
      {edit && (
        <div className="bg-[#000000b3] fixed inset-0 flex items-center justify-center">
          <div
            className={`${
              edit === true ? "opacity-100" : "opacity-0"
            } bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl relative transition-opacity duration-700 ease-in-out`}
          >
            <X
              onClick={() => {
                setEdit(false);
              }}
              className="absolute right-7 text-red-500"
            />
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mt-5">
              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First name
                </label>
                <input
                  type="text"
                  value={employeeInfo?.firstName}
                  onChange={(e) =>
                    setemployeeInfo({
                      ...employeeInfo,
                      firstName: e.target.value,
                    })
                  }
                  placeholder=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last name
                </label>
                <input
                  type="text"
                  value={employeeInfo?.lastName}
                  onChange={(e) =>
                    setemployeeInfo({
                      ...employeeInfo,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={employeeInfo?.email}
                  onChange={(e) =>
                    setemployeeInfo({ ...employeeInfo, email: e.target.value })
                  }
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name=""
                  value={employeeInfo?.role}
                  onChange={(e) =>
                    setemployeeInfo({ ...employeeInfo, role: e.target.value })
                  }
                  id=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allRoles.map(
                    (roles) =>
                      roles.id == employeeInfo?.role && (
                        <option value={roles.id}>{roles.title}</option>
                      )
                  )}
                  {allRoles.map((roles) => (
                    <option value={roles.id}>{roles.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name=""
                  value={employeeInfo?.dept}
                  onChange={(e) =>
                    setemployeeInfo({
                      ...employeeInfo,
                      dept: Number(e.target.value),
                    })
                  }
                  id=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(
                    (department) =>
                      department.id == employeeInfo?.dept && (
                        <option value={department.id}>
                          {department.department}
                        </option>
                      )
                  )}
                  {departments.map((department) => (
                    <option value={department.id}>
                      {department.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleEmployeeDataUpdate}
                className=" mt-5 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => setEdit(false)}
                className=" mt-5 bg-gray-500 text-white px-4  rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {allEmployees.length}
            </p>
            <p className="text-sm text-gray-600">Total Employees</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {allRoles.length}
            </p>
            <p className="text-sm text-gray-600">Unique Roles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-600">Created By</p>
          </div>
        </div>
      </div>
    </div>
  );
}
