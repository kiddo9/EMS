import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import useRoles from "../hooks/useRoles";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UseEmployeeHook from "../hooks/UseEmployeeHook";

interface Role {
  id: number;
  title: string;
  createdBy: string;
  createdDate: string;
}

const RolesPage: React.FC = () => {
  const { allRoles } = useRoles();
  const { allEmployees } = UseEmployeeHook();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newRole, setNewRole] = useState({
    title: "",
    createdBy: "Current User",
  });
  const [editRole, setEditole] = useState<Role | undefined>();

  const navigate = useNavigate();

  async function getRoleById(id: number) {
    setShowEditForm(true);
    try {
      const sendRequest = await axios.get(
        `http://localhost:8081/roles/id?uuid=${id}`
      );
      const response = sendRequest.data;
      setEditole(response);
      console.log(response);

      if (response.status !== "success") {
        console.log(response.messages);
      }
      return;
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateRole = async () => {
    if (newRole.title) {
      const role: Role = {
        id: 0,
        title: newRole.title,
        createdBy: newRole.createdBy,
        createdDate: "",
      };

      setNewRole({
        title: "",
        createdBy: "Current User",
      });
      setShowCreateForm(false);
      try {
        const request = await axios.post(
          "http://localhost:8081/create/roles",
          role
        );
        const response = request.data;
        if (response.status !== "success") {
          toast.error(response.messages);
          return;
        }

        toast.success(response.messages);
        setTimeout(() => {
          navigate(`/refresh?path=${"/admin/roles"}`);
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const sendRequest = await axios.delete(
          `http://localhost:8081/roles/id?uuid=${id}`
        );
        const response = sendRequest.data;
        if (response.status !== "success") {
          toast.error(response.messages);
          return;
        }
        toast.success(response.messages);
        setTimeout(() => {
          navigate(`/refresh?path=${"/admin/roles"}`);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditRole = async (id: number) => {
    try {
      const sendRequest = await axios.put(
        `http://localhost:8081/roles/id?uuid=${id}`,
        editRole
      );
      const response = sendRequest.data;
      if (response.status !== "success") {
        toast.error(response.messages);
        return;
      }
      toast.success(response.messages);

      setTimeout(() => {
        setShowEditForm(false);
        navigate(`/refresh?path=${"/admin/roles"}`);
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
                  Roles Management
                </h1>
                <p className="text-gray-600">
                  Manage roles and permissions across the organization
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Role
              </button>
            </div>
          </div>

          {/* Create Role Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Role
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={newRole.title}
                    onChange={(e) =>
                      setNewRole({ ...newRole, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Developer"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCreateRole}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Role
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

          {showEditForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Role
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={editRole?.title}
                    onChange={(e) =>
                      setEditole({ ...editRole, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Developer"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditRole(editRole?.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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

          {/* Roles Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                All Roles ({allRoles.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role Title
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
                  {allRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {role.title}
                          </div>
                        </div>
                      </td>
                      {allEmployees.map(
                        (employee) =>
                          employee.id == role.created_by && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </td>
                          )
                      )}

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(role.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => getRoleById(role?.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                            title="Edit Role"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete Role"
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

          {/* Summary Stats */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Role Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {allRoles.length}
                </p>
                <p className="text-sm text-gray-600">Total Roles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(allRoles.map((r) => r.created_by)).size}
                </p>
                <p className="text-sm text-gray-600">Created By</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
