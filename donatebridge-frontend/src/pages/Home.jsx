import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Landing from "./Landing";

const Home = () => {
  const { status } = useAuth();

  if (status === "loading") {
    return <p className="route-loading">Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Landing />;
};

export default Home;
