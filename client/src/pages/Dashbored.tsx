import { Users, Briefcase, TrendingUp, Building } from "lucide-react";
import UseEmployeeHook from "../hooks/UseEmployeeHook";
import useRoles from "../hooks/useRoles";
import useDepartment from "../hooks/useDepartment";

const Dashbored = () => {
  const { allEmployees } = UseEmployeeHook();
  const { allRoles } = useRoles();
  const { departments } = useDepartment();

  const totalEmployees = allEmployees.length;
  const totalRoles = allRoles.length;

  // Calculate department distribution
  // const departmentStats = employees.reduce((acc, employee) => {
  //   acc[employee.department] = (acc[employee.department] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);
  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100  p-4">
      <div className="min-h-screen  p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of employees and roles across the organization
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Employees Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Employees
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalEmployees}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Roles Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Roles
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {totalRoles}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Department
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {departments.length}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Growth Indicator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Growth Rate
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    +{totalEmployees / totalEmployees}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Department Distribution
              </h3>
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {dept.department}
                    </span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              totalEmployees > 0
                                ? (allEmployees.filter(
                                    (emp) => emp.dept === dept.id
                                  ).length /
                                    totalEmployees) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {
                          allEmployees.filter((emp) => emp.dept === dept.id)
                            .length
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Employees */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Employees
              </h3>
              <div className="space-y-3">
                {allEmployees.slice(-5).map((employee) => (
                  <div
                    key={employee.uuid}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      {allRoles.map(
                        (roles) =>
                          roles.id == employee.role && (
                            <p className="text-xs text-gray-500">
                              {roles.title}
                            </p>
                          )
                      )}
                    </div>
                    <div className="text-right">
                      {departments.map(
                        (depts) =>
                          depts.id == employee.dept && (
                            <p className="text-xs text-gray-500">
                              {depts.department}
                            </p>
                          )
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(employee.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {totalEmployees}
                </p>
                <p className="text-sm text-gray-600">Total Staff</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalRoles}</p>
                <p className="text-sm text-gray-600">Unique Roles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(totalEmployees / allRoles.length)}
                </p>
                <p className="text-sm text-gray-600">Avg per Dept</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbored;
