import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(0);
  const [newPassword, setNewPassword] = useState(0);
  const [mode, setMode] = useState("");
  const [error, setError] = useState(""); // NEW: For showing backend errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mode) {
      setError("Please select a mode.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:7000/api/v1/forgetPassword", {
        email,
        otp,
        newPassword,
        mode,
      });

      alert(response.data.message);
      setError(""); // Clear error on success
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Unknown error";
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>OTP (if verifying):</label><br />
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(Number(e.target.value))}
          />
        </div>

        <div>
          <label>New Password (if verifying):</label><br />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div style={{ margin: "10px 0" }}>
          <button type="button" onClick={() => setMode("send")}>Send OTP</button>
          <button type="button" onClick={() => setMode("verify")}>Verify OTP</button>
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      <p>Current mode: <strong>{mode || "None"}</strong></p>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
