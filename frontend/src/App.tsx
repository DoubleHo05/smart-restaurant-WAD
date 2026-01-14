import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";
import { CartProvider } from "./contexts/CartContext";

// Customer pages
import QrLanding from "./pages/customer/QrLanding";
import CustomerMenu from "./pages/customer/CustomerMenu";
import OrderingMenu from "./pages/customer/OrderingMenu";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import RestaurantList from "./pages/customer/RestaurantList";
import OrderHistory from "./pages/customer/OrderHistory";
import Profile from "./pages/customer/Profile";
import ProfileGuest from "./pages/customer/ProfileGuest";
import ItemDetail from "./pages/customer/ItemDetail";
import ItemDetailView from "./pages/customer/ItemDetailView";
import ShoppingCart from "./pages/customer/ShoppingCart";
import OrderStatus from "./pages/customer/OrderStatus";
import Payment from "./pages/customer/Payment";
import PaymentStatus from "./pages/customer/PaymentStatus";

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
import LandingPage from "./pages/LandingPage";

// Layout
import AdminLayout from "./components/AdminLayout";
import CustomerLayout from "./components/CustomerLayout";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <CartProvider>
            <Routes>
              {/* Public customer routes */}
              <Route path="/qr/:token" element={<QrLanding />} />
              <Route path="/customer/restaurants" element={<RestaurantList />} />

              {/* Browse menu (before QR scan) - view only */}
              <Route path="/customer/menu" element={<CustomerMenu />} />
              <Route path="/customer/menu/item/:id" element={<ItemDetailView />} />

              {/* Ordering menu (after QR scan) - with cart functionality */}
              <Route path="/customer/order" element={<CustomerLayout><OrderingMenu /></CustomerLayout>} />
              <Route path="/customer/order/item/:id" element={<CustomerLayout><ItemDetail /></CustomerLayout>} />
              <Route path="/customer/cart" element={<CustomerLayout><ShoppingCart /></CustomerLayout>} />
              <Route path="/customer/order-status/:id?" element={<CustomerLayout><OrderStatus /></CustomerLayout>} />
              <Route path="/customer/payment" element={<CustomerLayout><Payment /></CustomerLayout>} />
              <Route path="/customer/payment-status/:billRequestId" element={<CustomerLayout><PaymentStatus /></CustomerLayout>} />

              {/* Customer account routes */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/register" element={<CustomerRegister />} />
              <Route path="/customer/order-history" element={<OrderHistory />} />
              <Route path="/customer/profile" element={<CustomerLayout><ProfileGuest /></CustomerLayout>} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
              <Route path="/admin/menu" element={<AdminLayout><Menu /></AdminLayout>} />
              <Route path="/admin/menu-items" element={<AdminLayout><MenuItemsManagement /></AdminLayout>} />
              <Route path="/admin/categories" element={<AdminLayout><CategoriesManagement /></AdminLayout>} />
              <Route path="/admin/modifiers" element={<AdminLayout><ModifiersManagement /></AdminLayout>} />
              <Route path="/admin/tables" element={<AdminLayout><TableManagement /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
              <Route path="/admin/system" element={<AdminLayout><SystemAdminPage /></AdminLayout>} />

              {/* Landing Page with Smart Redirect */}
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </CartProvider>
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
