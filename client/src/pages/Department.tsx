import { useState } from "react";
import { Plus, Edit, Trash2, Building, Users } from "lucide-react";
import UseEmployeeHook from "../hooks/UseEmployeeHook";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useDepartment from "../hooks/useDepartment";

interface Department {
  id: number;
  department: string;
  description: string;
  manager: number;
  total_members: number;
  created_by: number;
  created_at: string;
  is_active: number;
}

const DepartmentPage = () => {
  const { allEmployees } = UseEmployeeHook();
  const [department, setDepartment] = useState<string | undefined>();
  const [description, setDescription] = useState<string>();
  const [manager, setManager] = useState<string>();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editInfo, setEditInfo] = useState<Department>();
  const navigate = useNavigate();

  const body = {
    department: department,
    description: description,
    manager: Number(manager),
    total_members: 0,
    created_by: 1,
    created_at: "",
    is_active: 1,
  };

  const { departments } = useDepartment();

  async function getDepartmentById(id: number) {
    try {
      const sendRequest = await axios.get(
        `http://localhost:8081/departments/id?uuid=${id}`
      );
      const response = sendRequest.data;
      setEditInfo(response);

      console.log(response);

      if (response.status !== "success") {
        console.log(response.messages);
      }

      return;
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateDepartment = async () => {
    try {
      const sendRequest = await axios.post(
        "http://localhost:8081/create/department",
        body
      );
      const response = sendRequest.data;
      if (response.status !== "success") {
        toast.error(response.messages);
        return;
      }

      toast.success(response.messages);
      setTimeout(() => {
        navigate(`/refresh?path=${"/admin/department"}`);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const sendRequest = await axios.delete(
          `http://localhost:8081/departments/id?uuid=${id}`
        );
        const response = sendRequest.data;
        if (response.status !== "success") {
          toast.error(response.messages);
          return;
        }
        toast.success(response.messages);
        setTimeout(() => {
          navigate(`/refresh?path=${"/admin/department"}`);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const handleViewDepartment = (department: Department) => {
  //   console.log(department);
  // };

  const handleEditDepartment = (id: number) => {
    setShowEditForm(true);
    getDepartmentById(id);
  };

  const updateDepartment = async (id: number) => {
    try {
      const sendRequest = await axios.put(
        `http://localhost:8081/departments/id?uuid=${id}`,
        editInfo
      );
      const response = sendRequest.data;
      if (response.status !== "success") {
        toast.error(response.messages);
        return;
      }
      toast.success(response.messages);
      setTimeout(() => {
        navigate(`/refresh?path=${"/admin/department"}`);
        setShowEditForm(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100  p-4">
      <ToastContainer />
      <div className="min-h-screen  p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Department Management
                </h1>
                <p className="text-gray-600">
                  Manage departments and organizational structure
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Department
              </button>
            </div>
          </div>

          {/* Create Department Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Department
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Customer Support"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Manager
                  </label>
                  <select
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    name=""
                    id=""
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">select a manager</option>
                    {allEmployees.map((employee) => (
                      <option value={employee?.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the department's purpose and responsibilities..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCreateDepartment}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Department
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* edit form */}
          {showEditForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Department
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={editInfo?.department}
                    onChange={(e) =>
                      setEditInfo({ ...editInfo, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Customer Support"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Manager
                  </label>
                  <select
                    value={editInfo?.manager}
                    onChange={(e) =>
                      setEditInfo({
                        ...editInfo,
                        manager: Number(e.target.value),
                      })
                    }
                    name=""
                    id=""
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {allEmployees.map((employee) => (
                      <option value={employee?.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editInfo?.description}
                    onChange={(e) =>
                      setEditInfo({ ...editInfo, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the department's purpose and responsibilities..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateDepartment(editInfo?.id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Department Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Departments
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {departments.length}
                  </p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Departments
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {departments.filter((dept) => dept.is_active === 1).length}
                  </p>
                </div>
                <Building className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Employees
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {allEmployees.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg per Department
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {Math.round(allEmployees.length / departments.length)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Departments Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                All Departments ({departments.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {departments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Building className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {department.department}
                            </div>
                            <div className="text-sm text-gray-500">
                              {department.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      {allEmployees.map(
                        (manager) =>
                          manager.id == department.manager && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {manager.firstName} {manager.lastName}
                            </td>
                          )
                      )}

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {
                              allEmployees.filter(
                                (emp) => emp.dept === department.id
                              ).length
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            department.is_active === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {department.is_active === 1 ? "Active" : "in active"}
                        </span>
                      </td>

                      {allEmployees.map(
                        (manager) =>
                          manager.id == department.Created_by && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {manager.firstName} {manager.lastName}
                            </td>
                          )
                      )}

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(department.Created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {/* <button
                            onClick={() => handleViewDepartment(department)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View Department"
                          >
                            <Eye className="w-4 h-4" />
                          </button> */}
                          <button
                            onClick={() => handleEditDepartment(department.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                            title="Edit Department"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDepartment(department.id)
                            }
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete Department"
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
        </div>
      </div>
    </div>
  );
};
export default DepartmentPage;
