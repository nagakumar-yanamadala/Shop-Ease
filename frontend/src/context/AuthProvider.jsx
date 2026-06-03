import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect( () => {
    try {
      fetch(`${import.meta.env.VITE_API_URL}/me`, {
        credentials: "include",
      }).then((res)=>res.json())
      .then((data)=>{
        if (data.loggedIn) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
    } catch (error) {
      console.log("error",error)
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
