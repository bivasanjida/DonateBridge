import { createContext, useContext, useEffect, useReducer } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchMe,
  updateProfile as updateProfileRequest,
} from "../api/client";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  status: "loading", // "loading" | "authenticated" | "unauthenticated"
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SESSION_RESTORED":
      return { user: action.user, status: "authenticated" };
    case "LOGGED_IN":
      return { user: action.user, status: "authenticated" };
    case "LOGGED_OUT":
      return { user: null, status: "unauthenticated" };
    case "PROFILE_UPDATED":
      return { ...state, user: action.user };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchMe()
      .then(({ user }) => dispatch({ type: "SESSION_RESTORED", user }))
      .catch(() => dispatch({ type: "LOGGED_OUT" }));
  }, []);

  const login = async (credentials) => {
    const { user } = await loginUser(credentials);
    dispatch({ type: "LOGGED_IN", user });
    return user;
  };

  const register = async (data) => {
    const { user } = await registerUser(data);
    dispatch({ type: "LOGGED_IN", user });
    return user;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      dispatch({ type: "LOGGED_OUT" });
    }
  };

  const updateProfile = async (data) => {
    const { user } = await updateProfileRequest(data);
    dispatch({ type: "PROFILE_UPDATED", user });
    return user;
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
