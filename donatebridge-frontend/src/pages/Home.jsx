import Landing from "./Landing";

const Home = () => {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <p className="route-loading">Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "Admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Landing />;
};

export default Home;
