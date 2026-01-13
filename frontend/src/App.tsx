import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./contexts/SocketContext";

// Customer pages
import QrLanding from "./pages/customer/QrLanding";
import CustomerMenu from "./pages/customer/CustomerMenu";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Menu from "./pages/admin/Menu";
import MenuItemsManagement from "./pages/admin/MenuItemsManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import ModifiersManagement from "./pages/admin/ModifiersManagement";
import TableManagement from "./pages/admin/TableManagement";
import UserManagement from "./pages/admin/UserManagement";
import SystemAdminPage from "./pages/admin/SystemAdminPage";
import { ReportsPage } from "./pages/admin/ReportsPage";

// Layout
import AdminLayout from "./components/AdminLayout";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <SocketProvider>
            <NotificationsProvider>
              <Toaster position="top-right" />
              <Routes>
                {/* Public customer routes */}
                <Route path="/qr/:token" element={<QrLanding />} />
                <Route path="/customer/menu" element={<CustomerMenu />} />
                <Route path="/customer/login" element={<CustomerLogin />} />
                <Route
                  path="/customer/register"
                  element={<CustomerRegister />}
                />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/menu"
                  element={
                    <AdminLayout>
                      <Menu />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/menu-items"
                  element={
                    <AdminLayout>
                      <MenuItemsManagement />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <AdminLayout>
                      <CategoriesManagement />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/modifiers"
                  element={
                    <AdminLayout>
                      <ModifiersManagement />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/tables"
                  element={
                    <AdminLayout>
                      <TableManagement />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminLayout>
                      <UserManagement />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/system"
                  element={
                    <AdminLayout>
                      <SystemAdminPage />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <AdminLayout>
                      <ReportsPage />
                    </AdminLayout>
                  }
                />

                {/* Default redirect - shows both options */}
                <Route
                  path="/"
                  element={
                    <div style={{ padding: "40px", textAlign: "center" }}>
                      <h1>Smart Restaurant</h1>
                      <div style={{ marginTop: "30px" }}>
                        <a
                          href="/customer/login"
                          style={{
                            margin: "10px",
                            padding: "10px 20px",
                            background: "#007bff",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "5px",
                            display: "inline-block",
                          }}
                        >
                          Customer Login
                        </a>
                        <a
                          href="/admin/login"
                          style={{
                            margin: "10px",
                            padding: "10px 20px",
                            background: "#28a745",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "5px",
                            display: "inline-block",
                          }}
                        >
                          Admin Login
                        </a>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </NotificationsProvider>
          </SocketProvider>
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
