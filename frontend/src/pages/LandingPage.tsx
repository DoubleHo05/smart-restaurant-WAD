import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LandingPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Check for user role
      const roles = user.roles || (user.role ? [user.role] : []);

      if (roles.includes("kitchen")) {
        navigate("/kitchen/kds");
      } else if (roles.includes("waiter")) {
        navigate("/waiter/dashboard");
      } else if (roles.includes("admin") || roles.includes("super_admin")) {
        navigate("/admin/dashboard");
      } else {
        // Customer or guest
        navigate("/customer/restaurants");
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          className="loading-spinner"
          style={{ borderTopColor: "white" }}
        ></div>
      </div>
    );
  }

  // If already authenticated, return null while redirecting (to prevent flash of content)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          style={{ fontSize: "32px", marginBottom: "10px", color: "#2c3e50" }}
        >
          🍽️ Smart Restaurant
        </h1>
        <p style={{ color: "#7f8c8d", marginBottom: "30px" }}>
          Scan. Order. Enjoy.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
            📝 Register as Customer
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
  );
};

export default LandingPage;
