import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import TableManagement from "./pages/TableManagement";
import Menu from "./pages/Menu";
import CategoriesManagement from "./pages/CategoriesManagement";
import ModifiersManagement from "./pages/ModifiersManagement";
import MenuItemsManagement from "./pages/MenuItemsManagement";
import OrderManagement from "./pages/OrderManagement";
import Dashboard from "./pages/Dashboard";
import CustomerLogin from "./pages/customer/Login";
import CustomerRegister from "./pages/customer/Register";
import QrLanding from "./pages/customer/QrLanding";
import CustomerMenu from "./pages/customer/CustomerMenu";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/"
            element={
              <>
                <Navigation />
                <TableManagement />
              </>
            }
          />
          <Route
            path="/menu"
            element={
              <>
                <Navigation />
                <Menu />
              </>
            }
          />
          <Route
            path="/categories"
            element={
              <>
                <Navigation />
                <CategoriesManagement />
              </>
            }
          />
          <Route
            path="/modifiers"
            element={
              <>
                <Navigation />
                <ModifiersManagement />
              </>
            }
          />
          <Route
            path="/items"
            element={
              <>
                <Navigation />
                <MenuItemsManagement />
              </>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <>
                <Navigation />
                <OrderManagement />
              </>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <>
                <Navigation />
                <Dashboard />
              </>
            }
          />

          {/* Customer Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/qr/:token" element={<QrLanding />} />
          <Route path="/customer/menu" element={<CustomerMenu />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
