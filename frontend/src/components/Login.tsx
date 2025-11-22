import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "../api";
import { useLogin } from "../context/LoginContext";
import { showToast } from "../components/ToastManager";

export default function Login() {
  const nav = useNavigate();
  const { setVerified } = useLogin();

  const [form, setForm] = useState({ name: "", mobile: "", otp: "" });
  const [stage, setStage] = useState<"request" | "verify">("request");

  const requestOtp = async () => {
    if (!form.name || !/^\d{10}$/.test(form.mobile)) {
      showToast("Enter name and valid 10-digit mobile", "error");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("mobile", form.mobile);

      await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/send-otp`, {
        method: "POST",
        body: fd,
      });

      sessionStorage.setItem("chmi_user", JSON.stringify({ name: form.name, mobile: form.mobile }));
      setStage("verify");
      showToast("OTP sent successfully!", "info");

    } catch (err: any) {
      showToast("Failed: " + (err.message || String(err)), "error");
    }
  };

  const verifyLogin = async () => {
    try {
      const res = await postJson("/login", {
        name: form.name,
        mobile: form.mobile,
        otp: form.otp,
      });

      if (res.success) {
        sessionStorage.setItem("chmi_verified", "1");
        sessionStorage.setItem("chmi_user", JSON.stringify({ name: form.name, mobile: form.mobile }));
        setVerified(true);

        showToast("Login successful!", "success");
        nav("/dashboard");
      } else {
        showToast("OTP incorrect!", "error");
      }
    } catch (err: any) {
      showToast("Error: " + (err.message || String(err)), "error");
    }
  };

  return (
    <div className="content-grid">
      <div className="card">
        <h2>Login</h2>

        <div className="form">
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>

          <label>
            Mobile
            <input
              value={form.mobile}
              maxLength={10}
              onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            />
          </label>

          {stage === "verify" && (
            <label>
              OTP
              <input
                value={form.otp}
                maxLength={6}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
              />
            </label>
          )}

          <div className="form-row">
            {stage === "request" ? (
              <button onClick={requestOtp}>Request OTP</button>
            ) : (
              <>
                <button onClick={verifyLogin}>Verify & Login</button>
                <button className="ghost" onClick={() => setStage("request")}>Back</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card small-card">
        <h3>Login</h3>
        <p className="muted">Enter name and phone to receive an OTP. After verification you'll be able to access the dashboard.</p>
      </div>
    </div>
  );
}
