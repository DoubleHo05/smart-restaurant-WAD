import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token xác thực không hợp lệ");
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/verify-email?token=${token}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Xác thực thất bại");
      }

      setStatus("success");
      setMessage(
        "Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.",
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Đang xác thực email...
              </h2>
            </>
          )}

          {status === "success" && (
            <>
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-6 text-2xl font-bold text-green-600">
                Xác thực thành công!
              </h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <p className="mt-4 text-sm text-gray-500">
                Đang chuyển hướng đến trang đăng nhập...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-6 text-2xl font-bold text-red-600">
                Xác thực thất bại
              </h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <button
                onClick={() => navigate("/")}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Quay về trang chủ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
