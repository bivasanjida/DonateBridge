import { createContext, useContext, useEffect, useReducer } from "react";
import {
  registerUser,
  loginUser,
  fetchMe,
  updateProfile as updateProfileRequest,
} from "../api/client";

const AuthContext = createContext(null);

const TOKEN_KEY = "donatebridge_token";

const initialState = {
  user: null,
  token: null,
  status: "loading", // "loading" | "authenticated" | "unauthenticated"
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SESSION_RESTORED":
      return { user: action.user, token: action.token, status: "authenticated" };
    case "LOGGED_IN":
      return { user: action.user, token: action.token, status: "authenticated" };
    case "LOGGED_OUT":
      return { user: null, token: null, status: "unauthenticated" };
    case "PROFILE_UPDATED":
      return { ...state, user: action.user };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      dispatch({ type: "LOGGED_OUT" });
      return;
    }

    fetchMe(token)
      .then(({ user }) => dispatch({ type: "SESSION_RESTORED", user, token }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        dispatch({ type: "LOGGED_OUT" });
      });
  }, []);

  const login = async (credentials) => {
    const { token, user } = await loginUser(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    dispatch({ type: "LOGGED_IN", user, token });
    return user;
  };

  const register = async (data) => {
    const { token, user } = await registerUser(data);
    localStorage.setItem(TOKEN_KEY, token);
    dispatch({ type: "LOGGED_IN", user, token });
    return user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    dispatch({ type: "LOGGED_OUT" });
  };

  const updateProfile = async (data) => {
    const { user } = await updateProfileRequest(data, state.token);
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
