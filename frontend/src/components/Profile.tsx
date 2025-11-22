import React from "react";

export default function Profile() {
  const user = JSON.parse(sessionStorage.getItem("chmi_user") || "{}");

  return (
    <div className="content-grid">
      <div className="card">
        <h2>User Profile</h2>

        <div className="form">
          <label>Name<input value={user.name} disabled /></label>
          <label>Mobile<input value={user.mobile} disabled /></label>
          <label>Village<input value={user.village} disabled /></label>
          <label>Mandal<input value={user.mandal} disabled /></label>
          <label>District<input value={user.district} disabled /></label>
        </div>
      </div>

      <div className="card small-card">
        <h3>Profile</h3>
        <p className="muted">These are your registered details.</p>
      </div>
    </div>
  );
}
