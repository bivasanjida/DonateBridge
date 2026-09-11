import DonationPost from "../models/donationPost.js";
import { dummyDonationPosts } from "../data/dummyDonationPosts.js";

export const seedDonationPosts = async (_req, res) => {
  try {
    const count = await DonationPost.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        message: "Donation posts already seeded",
        count,
      });
    }

    const posts = await DonationPost.insertMany(dummyDonationPosts);
    return res.status(201).json({
      message: "Donation posts seeded successfully",
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Error seeding donation posts:", error);
    return res.status(500).json({ error: "Failed to seed donation posts" });
  }
};

export const listDonationPosts = async (_req, res) => {
  try {
    const posts = await DonationPost.find().sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching donation posts:", error);
    return res.status(500).json({ error: "Failed to fetch donation posts" });
  }
};

export const getDonationPostById = async (req, res) => {
  try {
    const post = await DonationPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Donation post not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching donation post:", error);
    return res.status(500).json({ error: "Failed to fetch donation post" });
  }
};
