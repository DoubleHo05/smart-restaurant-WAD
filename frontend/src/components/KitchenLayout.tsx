import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import "./KitchenLayout.css";

interface KitchenLayoutProps {
  children: ReactNode;
}

export default function KitchenLayout({ children }: KitchenLayoutProps) {
  const navigate = useNavigate();

  const handleExit = () => {
    // TODO: Implement logout logic
    navigate("/admin/login");
  };

  return <div className="kitchen-layout">{children}</div>;
}
