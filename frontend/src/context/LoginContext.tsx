import React, { createContext, useContext, useState } from "react";

interface LoginContextType {
  verified: boolean;
  setVerified: (v: boolean) => void;
}

const LoginContext = createContext<LoginContextType>({
  verified: false,
  setVerified: () => {},
});

export const useLogin = () => useContext(LoginContext);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(
    sessionStorage.getItem("chmi_verified") === "1"
  );

  return (
    <LoginContext.Provider value={{ verified, setVerified }}>
      {children}
    </LoginContext.Provider>
  );
}
