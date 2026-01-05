import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import TableManagement from "./pages/TableManagement";
import Menu from "./pages/Menu";
import CategoriesManagement from "./pages/CategoriesManagement";
import ModifiersManagement from "./pages/ModifiersManagement";
import MenuItemsManagement from "./pages/MenuItemsManagement";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<TableManagement />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/categories" element={<CategoriesManagement />} />
        <Route path="/modifiers" element={<ModifiersManagement />} />
        <Route path="/items" element={<MenuItemsManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
