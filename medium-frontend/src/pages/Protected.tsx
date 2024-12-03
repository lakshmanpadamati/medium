import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";

function Protected() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth"); 
    }
  }, [isAuthenticated, loading, navigate]);
 
  if (loading) {
    // Show a loading spinner or placeholder while checking auth status
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
   navigate("/auth")
   return null
  }
 
  return  <Outlet /> 

}

export default Protected;