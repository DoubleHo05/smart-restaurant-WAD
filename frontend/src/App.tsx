import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";
import { CartProvider } from "./contexts/CartContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { SocketProvider } from "./contexts/SocketContext";
import { Toaster } from "react-hot-toast";

// Customer pages
import QrLanding from "./pages/customer/QrLanding";
import CustomerMenu from "./pages/customer/CustomerMenu";
import OrderingMenu from "./pages/customer/OrderingMenu";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import RestaurantList from "./pages/customer/RestaurantList";
import OrderHistory from "./pages/customer/OrderHistory";
import ProfileGuest from "./pages/customer/ProfileGuest";
import ProfileWrapper from "./pages/customer/ProfileWrapper";
import DashboardProfile from "./pages/customer/DashboardProfile";
import ItemDetail from "./pages/customer/ItemDetail";
import ItemDetailView from "./pages/customer/ItemDetailView";
import ShoppingCart from "./pages/customer/ShoppingCart";
import OrderStatus from "./pages/customer/OrderStatus";
import Payment from "./pages/customer/Payment";
import PaymentStatus from "./pages/customer/PaymentStatus";
import PaymentResult from "./pages/customer/PaymentResult";

// Auth pages
import VerifyEmail from "./pages/auth/VerifyEmail";
import GoogleCallback from "./pages/auth/GoogleCallback";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import UnifiedDashboard from "./pages/admin/UnifiedDashboard";
import Menu from "./pages/admin/Menu";
import MenuItemsManagement from "./pages/admin/MenuItemsManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import ModifiersManagement from "./pages/admin/ModifiersManagement";
import TableManagement from "./pages/admin/TableManagement";
import UserManagement from "./pages/admin/UserManagement";
import SystemAdminPage from "./pages/admin/SystemAdminPage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import OrderManagement from "./pages/OrderManagement";

// Waiter pages
import WaiterOrders from "./pages/waiter/WaiterOrders";
import WaiterBillRequests from "./pages/waiter/WaiterBillRequests";
import WaiterTables from "./pages/waiter/WaiterTables";
import WaiterDashboard from "./pages/waiter/WaiterDashboard";

// Kitchen pages
import KitchenDisplay from "./pages/kitchen/KitchenDisplay";
import LandingPage from "./pages/LandingPage";

// Layout
import AdminLayout from "./components/AdminLayout";
import WaiterLayout from "./components/WaiterLayout";
import KitchenLayout from "./components/KitchenLayout";
import CustomerLayout from "./components/CustomerLayout";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <CartProvider>
            <SocketProvider>
              <NotificationsProvider>
                <Toaster position="top-right" />
                <Routes>
                  {/* Auth routes */}
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route
                    path="/auth/google/callback"
                    element={<GoogleCallback />}
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* VNPay payment result redirect */}
                  <Route path="/payment/result" element={<PaymentResult />} />

                  {/* Public customer routes */}
                  <Route path="/qr/:token" element={<QrLanding />} />
                  <Route
                    path="/customer/restaurants"
                    element={<RestaurantList />}
                  />
                  <Route path="/customer/menu" element={<CustomerMenu />} />
                  <Route path="/customer/order-history" element={<OrderHistory />} />
                  <Route path="/customer/login" element={<CustomerLogin />} />
                  <Route
                    path="/customer/register"
                    element={<CustomerRegister />}
                  />

                  {/* Browse menu (before QR scan) - view only */}
                  <Route
                    path="/customer/menu/item/:id"
                    element={<ItemDetailView />}
                  />

                  {/* Ordering menu (after QR scan) - with cart functionality */}
                  <Route
                    path="/customer/order"
                    element={
                      <CustomerLayout>
                        <OrderingMenu />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path="/customer/order/item/:id"
                    element={
                      <CustomerLayout>
                        <ItemDetail />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path="/customer/cart"
                    element={
                      <CustomerLayout>
                        <ShoppingCart />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path="/customer/order-status/:id?"
                    element={
                      <CustomerLayout>
                        <OrderStatus />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path="/customer/payment"
                    element={
                      <CustomerLayout>
                        <Payment />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path="/customer/payment-status/:billRequestId"
                    element={
                      <CustomerLayout>
                        <PaymentStatus />
                      </CustomerLayout>
                    }
                  />

                  {/* Customer account routes */}
                  <Route
                    path="/customer/order-history"
                    element={<OrderHistory />}
                  />
                  <Route
                    path="/customer/profile"
                    element={
                      <CustomerLayout>
                        <ProfileWrapper />
                      </CustomerLayout>
                    }
                  />
                  <Route
                    path="/customer/dashboard-profile"
                    element={
                      <CustomerLayout>
                        <DashboardProfile />
                      </CustomerLayout>
                    }
                  />

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminLayout>
                        <UnifiedDashboard />
                      </AdminLayout>
                    }
                  />
                  <Route
                    path="/admin/old-dashboard"
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
                  <Route
                    path="/admin/reports"
                    element={
                      <AdminLayout>
                        <ReportsPage />
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
                    path="/waiter/bill-requests"
                    element={
                      <WaiterLayout>
                        <WaiterBillRequests />
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
                  <Route
                    path="/waiter/dashboard"
                    element={
                      <WaiterLayout>
                        <WaiterDashboard />
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

                  {/* Default redirect - unified login page */}
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
                            width: "100%",
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
                              href="/admin/login"
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
                              🔐 Login
                            </a>
                            <a
                              href="/customer/register"
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
                              📝 Register
                            </a>
                            <a
                              href={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/google`}
                              style={{
                                padding: "15px 30px",
                                background: "white",
                                color: "#333",
                                textDecoration: "none",
                                borderRadius: "12px",
                                fontWeight: "600",
                                transition: "all 0.3s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                border: "2px solid #ddd",
                              }}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                              Login with Google
                            </a>
                            <a
                              href="/customer/restaurants"
                              style={{
                                padding: "15px 30px",
                                background: "#3498db",
                                color: "white",
                                textDecoration: "none",
                                borderRadius: "12px",
                                fontWeight: "600",
                                transition: "all 0.3s",
                                display: "block",
                              }}
                            >
                              👤 Continue as Guest
                            </a>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </NotificationsProvider>
            </SocketProvider>
          </CartProvider>
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
