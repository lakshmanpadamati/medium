import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

interface User {
  fullname: string;
  email: string;
  id: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; // Loading state to handle async behavior
}

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true, // Start in loading state
  });
  const navigate = useNavigate();

  const login = (user: User, token: string) => {
    localStorage.setItem("token", token);
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    localStorage.removeItem("token");
    navigate("/auth");
  };

  useEffect(() => {
   console.log("authcontext useffect")
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token")|| null;
      if (!storedToken) {
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: false,
          loading: false,
        }));
        console.log("token missed")
        navigate("/auth");
        return;
      }
if(!authState.isAuthenticated){
  

      try {
        const response = await fetch("http://localhost:4000/api/v1/user/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Invalid token");
        }
        const user: User = await response.json();
        setAuthState({
          user,
          token: storedToken,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
        localStorage.removeItem("token");
        navigate("/auth");
      }
    }
    };
  
    checkAuth();
  }, [navigate,authState.isAuthenticated]);
  
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
     <Outlet/>
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
