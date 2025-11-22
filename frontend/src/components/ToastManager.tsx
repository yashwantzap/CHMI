// src/components/ToastManager.tsx
import React, { useState } from "react";
import Toast from "./Toast";

let showToastFunction: any;

export function showToast(message: string, type: "success" | "error" | "info" = "info") {
  if (showToastFunction) showToastFunction(message, type);
}

export default function ToastManager() {
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "error" | "info" }[]
  >([]);

  showToastFunction = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }
        />
      ))}
    </div>
  );
}
