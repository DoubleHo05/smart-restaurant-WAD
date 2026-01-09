import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import { AuthProvider } from "./contexts/AuthContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TableManagement from "./pages/TableManagement";
import Menu from "./pages/Menu";
import CategoriesManagement from "./pages/CategoriesManagement";
import ModifiersManagement from "./pages/ModifiersManagement";
import MenuItemsManagement from "./pages/MenuItemsManagement";
import UserManagement from "./pages/UserManagement";
import AdminLayout from "./components/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute roles={["admin", "super_admin"]}>
                  <AdminLayout>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />
                      {<Route path="/dashboard" element={<Dashboard />} />}
                      <Route path="/tables" element={<TableManagement />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route
                        path="/categories"
                        element={<CategoriesManagement />}
                      />
                      <Route
                        path="/modifiers"
                        element={<ModifiersManagement />}
                      />
                      <Route path="/items" element={<MenuItemsManagement />} />
                      <Route path="/users" element={<UserManagement />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </RestaurantProvider>
    </AuthProvider>
  );
}

export default App;
