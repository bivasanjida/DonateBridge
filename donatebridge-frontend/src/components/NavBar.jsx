import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const guestPages = [
  { link: "/login", text: "Login" },
  { link: "/register", text: "Register" },
];

const authPages = [
  { link: "/", text: "Home" },
  { link: "/browse", text: "Browse Items" },
];

const adminPages = [
  { link: "/admin", text: "Dashboard" },
  { link: "/admin/verification", text: "Verification" },
  { link: "/admin/history", text: "History" },
  { link: "/admin/users", text: "Users" },
];

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, status, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/");
  };

  const pages =
    status === "authenticated"
      ? user?.role === "Admin"
        ? adminPages
        : authPages
      : status === "unauthenticated"
        ? guestPages
        : [];

  return (
    <div className="nav-main-div">
      <Link to="/" className="nav-brand">
        DonateBridge
      </Link>
      <nav>
        <ul className="nav-ul">
          {pages.map((item, idx) => (
            <li
              key={idx}
              className={`nav-item ${
                location.pathname === item.link ? "active" : ""
              }`}
            >
              <Link to={item.link}>{item.text}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {status === "authenticated" && (
        <div className="nav-profile" ref={menuRef}>
          <button
            className="nav-profile-btn"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {user.name}
            <span className={`nav-profile-caret ${isMenuOpen ? "open" : ""}`}>
              ▾
            </span>
          </button>
          {isMenuOpen && (
            <div className="nav-profile-menu">
              <Link
                to="/profile"
                className="nav-profile-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <button
                className="nav-profile-menu-item nav-profile-menu-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
