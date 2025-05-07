import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [token]);

  const login = (userToken) => {
    try {
      const decodedUser = jwtDecode(userToken);
      if (decodedUser.exp * 1000 > Date.now()) {
        localStorage.setItem("token", userToken);
        setToken(userToken);
        setUser(decodedUser);
        setIsAuthenticated(true);
      } else {
        console.error("Token expired.");
        logout();
      }
    } catch (error) {
      console.error("Invalid token format:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
