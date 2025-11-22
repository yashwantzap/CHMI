import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "../api";
import { showToast } from "../components/ToastManager";

export default function RegistrationForm() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    village: "",
    mandal: "",
    district: "",
  });

  const submit = async () => {
    if (!form.name || !/^\d{10}$/.test(form.mobile)) {
      showToast("Enter name and valid 10-digit mobile", "error");
      return;
    }

    if (!form.village || !form.mandal || !form.district) {
      showToast("Please fill all address fields", "error");
      return;
    }

    try {
      const res = await postJson("/register", form);

      if (res.success) {
        showToast("Registered. OTP sent!", "success");
        sessionStorage.setItem("chmi_user", JSON.stringify(form));
        nav("/otp");
      } else {
        showToast("Registration failed", "error");
      }
    } catch (err: any) {
      showToast("Error: " + err.message, "error");
    }
  };

  return (
    <div className="content-grid">
      <div className="card">
        <h2>Register</h2>

        <div className="form">
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>

          <label>
            Mobile Number
            <input
              value={form.mobile}
              maxLength={10}
              onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            />
          </label>

          <label>
            Village
            <input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} />
          </label>

          <label>
            Mandal
            <input value={form.mandal} onChange={(e) => setForm({ ...form, mandal: e.target.value })} />
          </label>

          <label>
            District
            <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </label>

          <button onClick={submit}>Register</button>
        </div>
      </div>

      <div className="card small-card">
        <h3>Registration</h3>
        <p className="muted">Fill in your details to receive an OTP.</p>
      </div>
    </div>
  );
}
