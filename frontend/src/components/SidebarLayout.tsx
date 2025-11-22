import React from "react";
import Sidebar from "./Sidebar";
import SidebarLoggedIn from "./SidebarLoggedIn";
import Topbar from "./Topbar";
import { Routes, Route } from "react-router-dom";
import { useLogin } from "../context/LoginContext";

import RegistrationForm from "./RegistrationForm";
import OTPVerification from "./OTPVerification";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";

export default function SidebarLayout() {
  const { verified } = useLogin();

  return (
    <div className="app-wrapper">
      {/* left sidebar switches automatically when verified changes */}
      {verified ? <SidebarLoggedIn /> : <Sidebar />}

      <div className="main-area">
        <Topbar />

        <div className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<RegistrationForm />} />
              <Route path="/otp" element={<OTPVerification />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
