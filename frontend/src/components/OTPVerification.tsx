import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "../api";
import { SkeletonCard } from "./Skeleton";
import { useLogin } from "../context/LoginContext";
import { showToast } from "../components/ToastManager";

export default function OTPVerification() {
  const nav = useNavigate();
  const { setVerified } = useLogin();

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState(60);

  const mobile = JSON.parse(sessionStorage.getItem("chmi_user") || "null")?.mobile || "";

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTimer((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const onChangeDigit = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const copy = [...otp];
    copy[i] = v.slice(-1);
    setOtp(copy);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const verify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      showToast("Enter all 6 digits", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await postJson("/verify-otp", { mobile, otp: code });

      if (res.success) {
        showToast("OTP verified!", "success");
        sessionStorage.setItem("chmi_verified", "1");
        setVerified(true);
        nav("/dashboard");
      } else {
        showToast("OTP incorrect!", "error");
      }

    } catch (err: any) {
      showToast("Verify failed: " + err.message, "error");

    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      const fd = new FormData();
      fd.append("mobile", mobile);

      await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/send-otp`, {
        method: "POST",
        body: fd,
      });

      setTimer(60);
      showToast("OTP resent!", "info");

    } catch (err: any) {
      showToast("Resend failed: " + err.message, "error");
    }
  };

  if (loading) return <SkeletonCard />;

  return (
    <div className="content-grid">
      <div className="card">
        <h2>OTP Verification</h2>
        <p>
          Enter the 6-digit code sent to <strong>+91 {mobile}</strong>
        </p>

        <div className="otp-row" aria-label="OTP inputs">
          {otp.map((d, i) => (
            <input
              key={i}
              maxLength={1}
              ref={(el) => { 
  refs.current[i] = el; 
}}

              value={d}
              onChange={(e) => onChangeDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
              }}
            />
          ))}
        </div>

        <div className="form-row">
          <button onClick={verify}>Verify</button>
          {timer > 0 ? (
            <div className="muted">Resend in {timer}s</div>
          ) : (
            <button onClick={resend} className="ghost">Resend</button>
          )}
        </div>
      </div>

      <div className="card small-card">
        <h3>Need help?</h3>
        <p className="muted">
          If you didn't receive OTP, click Resend.  
          For demo OTP is printed in backend logs.
        </p>
      </div>
    </div>
  );
}
