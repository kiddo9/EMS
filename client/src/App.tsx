import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Employees from "./pages/Employees";
import NavBar from "./components/NavBar";
import CreateEmployee from "./pages/CreateEmployee";
import Refresher from "./components/Refresher";
import Dashbored from "./pages/Dashbored";
import RolesPage from "./pages/Roles";
import Context from "./pages/Auth/Context";
import DepartmentPage from "./pages/Department";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/refresh" element={<Refresher />} />
          <Route
            path="/admin/*"
            element={
              <Context>
                <NavBar />
                <Routes>
                  <Route path="e" element={<Employees />} />
                  <Route path="dashbored" element={<Dashbored />} />
                  <Route path="create/employee" element={<CreateEmployee />} />
                  <Route path="roles" element={<RolesPage />} />
                  <Route path="department" element={<DepartmentPage />} />
                </Routes>
              </Context>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
