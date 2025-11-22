import React from "react";

export default function Topbar() {
  const verified = sessionStorage.getItem("chmi_verified") === "1";
  const user = JSON.parse(sessionStorage.getItem("chmi_user") || "null");

  return (
    <div className="topbar">
      <div className="title">Cattle Health Monitor</div>

      {verified && user && (
        <div className="user-pill" style={{ position: "relative" }}>
          <div className="avatar" aria-hidden>
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
        </div>
      )}
    </div>
  );
}
