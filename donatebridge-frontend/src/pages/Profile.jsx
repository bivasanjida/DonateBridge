import { useState } from "react";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [organizationName, setOrganizationName] = useState(
    user.organizationName || "",
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      setError("Please fill in every field.");
      setSuccess("");
      return;
    }

    if (user.role === "NGO" && !organizationName) {
      setError("Please enter your organization name.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await updateProfile({ name, email, phone, organizationName });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>My Profile</h1>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input value={user.role} disabled />
          </div>

          {user.role === "NGO" && (
            <div className="form-group">
              <label htmlFor="organizationName">Organization Name</label>
              <input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
          )}

          <Button
            btnText={isSubmitting ? "Saving..." : "Save Changes"}
            type="submit"
            disabled={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default Profile;
