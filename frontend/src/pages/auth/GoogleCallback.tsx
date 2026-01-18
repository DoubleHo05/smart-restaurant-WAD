import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config/api";

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      // Show error modal
      setErrorMessage(decodeURIComponent(error));
      setShowErrorModal(true);
    } else if (token) {
      // Store token and redirect
      localStorage.setItem("access_token", token);

      // Fetch user info
      fetchUserInfo(token);
    } else {
      navigate("/");
    }
  }, [searchParams, navigate]);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        login(token, user);

        // Redirect based on user role
        if (user.roles.includes("super_admin")) {
          navigate("/super-admin/dashboard");
        } else if (user.roles.includes("restaurant_owner")) {
          navigate("/admin/dashboard");
        } else if (user.roles.includes("waiter")) {
          navigate("/waiter/dashboard");
        } else {
          navigate("/customer/restaurants");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      navigate("/");
    }
  };

  const handleErrorModalOk = () => {
    setShowErrorModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Error Modal */}
      {showErrorModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#f44336",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <span style={{ fontSize: "30px", color: "white" }}>✕</span>
              </div>
              <h2
                style={{
                  fontSize: "22px",
                  marginBottom: "15px",
                  color: "#2c3e50",
                }}
              >
                Login Failed
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#666",
                  marginBottom: "25px",
                  lineHeight: "1.5",
                }}
              >
                {errorMessage}
              </p>
              <button
                onClick={handleErrorModalOk}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Đang đăng nhập...
        </h2>
      </div>
    </div>
  );
};

export default GoogleCallback;
