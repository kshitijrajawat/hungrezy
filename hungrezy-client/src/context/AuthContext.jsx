import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : { user: null, token: "" };
  });

  const login = (user, token) => {
    const data = { user, token };
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
  };

  const logout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
