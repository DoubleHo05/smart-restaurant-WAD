import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";

// Customer pages
import QrLanding from "./pages/customer/QrLanding";
import CustomerMenu from "./pages/customer/CustomerMenu";
import OrderingMenu from "./pages/customer/OrderingMenu";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import RestaurantList from "./pages/customer/RestaurantList";

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
import OrderManagement from "./pages/OrderManagement";

// Waiter pages
import WaiterOrders from "./pages/waiter/WaiterOrders";
import WaiterTables from "./pages/waiter/WaiterTables";

// Kitchen pages
import KitchenDisplay from "./pages/kitchen/KitchenDisplay";

// Layout
import AdminLayout from "./components/AdminLayout";
import WaiterLayout from "./components/WaiterLayout";
import KitchenLayout from "./components/KitchenLayout";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <Routes>
            {/* Public customer routes */}
            <Route path="/qr/:token" element={<QrLanding />} />
            <Route path="/customer/restaurants" element={<RestaurantList />} />
            <Route path="/customer/menu" element={<CustomerMenu />} />
            <Route path="/customer/order" element={<OrderingMenu />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />

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
              path="/admin/orders"
              element={
                <AdminLayout>
                  <OrderManagement />
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

            {/* Waiter routes */}
            <Route
              path="/waiter/orders"
              element={
                <WaiterLayout>
                  <WaiterOrders />
                </WaiterLayout>
              }
            />
            <Route
              path="/waiter/tables"
              element={
                <WaiterLayout>
                  <WaiterTables />
                </WaiterLayout>
              }
            />

            {/* Kitchen routes */}
            <Route
              path="/kitchen/kds"
              element={
                <KitchenLayout>
                  <KitchenDisplay />
                </KitchenLayout>
              }
            />

            {/* Default redirect - shows both options */}
            <Route
              path="/"
              element={
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      padding: "40px",
                      borderRadius: "20px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                      maxWidth: "400px",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "32px",
                        marginBottom: "10px",
                        color: "#2c3e50",
                      }}
                    >
                      🍽️ Smart Restaurant
                    </h1>
                    <p style={{ color: "#7f8c8d", marginBottom: "30px" }}>
                      Scan. Order. Enjoy.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                      }}
                    >
                      <a
                        href="/customer/login"
                        style={{
                          padding: "15px 30px",
                          background: "#e74c3c",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "12px",
                          fontWeight: "600",
                          transition: "all 0.3s",
                          display: "block",
                        }}
                      >
                        Customer Login
                      </a>
                      <a
                        href="/admin/login"
                        style={{
                          padding: "15px 30px",
                          background: "#27ae60",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "12px",
                          fontWeight: "600",
                          transition: "all 0.3s",
                          display: "block",
                        }}
                      >
                        Admin Login
                      </a>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
