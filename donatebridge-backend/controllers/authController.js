import jwt from "jsonwebtoken";
import User from "../models/user.js";

const SELF_REGISTER_ROLES = ["Donor", "NGO"];
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // keep in sync with JWT_EXPIRES_IN default ("7d")

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_MS,
  });
};

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  organizationName: user.organizationName,
  createdAt: user.createdAt,
});

export const register = async (req, res) => {
  const { name, email, password, phone, role, organizationName } = req.body;

  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({ error: "Please fill in every field." });
  }

  if (!SELF_REGISTER_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (role === "NGO" && !organizationName) {
    return res
      .status(400)
      .json({ error: "Organization name is required for NGO accounts." });
  }

  const existingUser = await User.exists({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already in use" });
  }

  try {
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      role,
      organizationName: role === "NGO" ? organizationName : undefined,
    });

    const token = signToken(newUser);
    setTokenCookie(res, token);
    return res.status(201).json({ user: toSafeUser(newUser) });
  } catch (err) {
    console.error(`Error registering user: ${err}`);
    return res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter both email and password." });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);
    setTokenCookie(res, token);
    return res.status(200).json({ user: toSafeUser(user) });
  } catch (err) {
    console.error(`Error logging in user: ${err}`);
    return res.status(500).json({ error: "Login failed" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out" });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  return res.status(200).json({ user: toSafeUser(user) });
};

export const updateProfile = async (req, res) => {
  const { name, email, phone, organizationName } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Please fill in every field." });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (user.role === "NGO" && !organizationName) {
    return res
      .status(400)
      .json({ error: "Organization name is required for NGO accounts." });
  }

  const normalizedEmail = email.toLowerCase();
  if (normalizedEmail !== user.email) {
    const existingUser = await User.exists({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }
  }

  try {
    user.name = name;
    user.email = normalizedEmail;
    user.phone = phone;
    if (user.role === "NGO") {
      user.organizationName = organizationName;
    }
    await user.save();

    return res.status(200).json({ user: toSafeUser(user) });
  } catch (err) {
    console.error(`Error updating profile: ${err}`);
    return res.status(500).json({ error: "Profile update failed" });
  }
};
