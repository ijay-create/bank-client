import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const STORAGE_KEY = "bank_user";

/* =========================
   SAFE PARSE
========================= */
const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.log("Corrupted auth storage:", err);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER ON REFRESH
  ========================= */
  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY));

    if (stored) {
      setUser(stored);
    }

    setLoading(false);
  }, []);

  /* =========================
     LOGIN (CLEAN + CONSISTENT)
  ========================= */
  const login = (data) => {
    const formattedUser = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      ...(data.user || {}),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedUser));
    setUser(formattedUser);
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  /* =========================
     CONTEXT VALUE
  ========================= */
  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.accessToken || null,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);