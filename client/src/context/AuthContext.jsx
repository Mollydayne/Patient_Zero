import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);
export function useAuth() { return useContext(AuthCtx); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(d => setUser(d.user))
      .finally(() => setBooting(false));
  }, []);

  async function login(username, password) {
    const r = await fetch(import.meta.env.VITE_API_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!r.ok) {
      const body = await r.json().catch(()=>({}));
      throw new Error(body.error || "invalid_credentials");
    }
    const data = await r.json();
    setUser(data.user);
  }

  async function logout() {
    await fetch(import.meta.env.VITE_API_URL + "/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, booting, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
