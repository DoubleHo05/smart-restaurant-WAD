import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.forgotPassword(email);
      setSuccess(true);
      console.log("✅ Password reset successful:", response);
    } catch (err: any) {
      console.error("❌ Forgot password error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send password reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card success-card">
          <div className="success-icon">✓</div>
          <h2>Email Sent Successfully!</h2>
          <p>
            A new password has been sent to <strong>{email}</strong>
          </p>
          <p className="note">
            Please check your inbox and use the new password to log in. Don't
            forget to change your password after logging in.
          </p>
          <button className="back-to-login-btn" onClick={() => navigate("/")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>

        <h2>Forgot Password</h2>
        <p className="subtitle">
          Enter your email address and we'll send you a new password
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Send New Password"}
          </button>
        </form>

        <div className="info-box">
          <strong>Note:</strong> The new password will be sent to your email.
          Please check your spam folder if you don't see it in your inbox.
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
