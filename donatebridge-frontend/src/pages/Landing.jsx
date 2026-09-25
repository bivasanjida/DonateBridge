import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { user, status } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <div>
      <section className="hero">
        <h1>DonateBridge</h1>
        <p>
          Connecting donors with NGOs through a simple item-listing and
          pickup-request workflow. List an item, get it requested, scheduled,
          and collected — no phone calls, no confusion.
        </p>
        <div className="hero-actions">
          <Link to="/browse" className="btn-outline">
            Browse Items
          </Link>
          <Link to={isAuthenticated ? "/profile" : "/register"} className="btn">
            {isAuthenticated ? "Go to Profile" : "Get Started"}
          </Link>
        </div>
      </section>

      <section className="features">
        <Link to="/browse" className="feature-card">
          <h3>For Donors</h3>
          <p>
            List items you no longer need with a photo, category, and
            condition, and track their status until they're collected.
          </p>
        </Link>

        <Link to="/browse" className="feature-card">
          <h3>For NGOs</h3>
          <p>
            Browse available items, filter by category, and send pickup
            requests for the ones you need.
          </p>
        </Link>

        {user?.role === "Admin" ? (
          <Link to="/admin" className="feature-card">
            <h3>For Admins</h3>
            <p>
              Verify pickup requests, schedule collection, and keep a permanent
              record of every donation.
            </p>
          </Link>
        ) : (
          <div className="feature-card feature-card-disabled">
            <h3>For Admins</h3>
            <p>
              Verify pickup requests, schedule collection, and keep a permanent
              record of every donation.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Landing;
