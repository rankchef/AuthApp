import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthProvider.jsx";
import usePostReq from "../hooks/usePostReq";
import useGetReq from "../hooks/useGetReq.jsx";

const Settings = () => {
  const { authState, logout } = useContext(AuthContext);
  const { user_data } = authState;
  const { postReq } = usePostReq();
  const { getReq } = useGetReq();
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [error, setError] = useState({});

  const handle2FAToggle = async () => {
    const { status, data } = await getReq(import.meta.env.VITE_TOGGLE_2FA_GET);
    if (status === 200) {
      user_data.twoFactor = !user_data.twoFactor;
    } else {
      setError(data.errorMessage || "Failed to update 2FA.");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (passwords.newPassword.length < 8) newErrors.errorMessage = "New password must be at least 8 characters";
    if (!passwords.oldPassword || !passwords.newPassword) newErrors.errorMessage = "Both fields required";
    setError(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChangePassword = async () => {
    if (!validate()) return;
    const { status, data } = await postReq(import.meta.env.VITE_CHANGE_PASSWORD_POST, passwords);
    if (status === 200) {
      setPasswords({ oldPassword: "", newPassword: "" });
      alert("Password updated successfully!");
    } else {
      setError({errorMessage: data.errorMessage});
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: "100vh", flexDirection: "column" }}>
      <div className="container card">
        <h1 className="mb-2">Settings</h1>

        <p><strong>Username:</strong> {user_data.username}</p>
        <p><strong>Email:</strong> {user_data.email}</p>
        <p><strong>Role:</strong> {user_data.role}</p>

        <div className="flex gap-2 mt-2">
          <button className="secondary" onClick={handle2FAToggle}>
            {user_data.twoFactor ? "Disable 2FA" : "Enable 2FA"}
          </button>
          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>

        <h2 className="mt-4 mb-2">Change Password</h2>
        <input
          type="password"
          placeholder="Current password"
          value={passwords.oldPassword}
          onChange={e => setPasswords(prev => ({ ...prev, oldPassword: e.target.value }))}
        />
        <input
          type="password"
          placeholder="New password"
          value={passwords.newPassword}
          onChange={e => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
        />
        <button className="primary" onClick={handleChangePassword}>
          Change Password
        </button>

        {error.errorMessage && <p className="mt-2" style={{ color: "red" }}>{error.errorMessage}</p>}
      </div>
    </div>
  );
};

export default Settings;
