import DonationPost from "../models/donationPost.js";

export const seedDonationPosts = async (_req, res) => {
  return res.status(410).json({
    error: "Sample posts are no longer supported. Donors can list real items.",
  });
};

export const listDonationPosts = async (_req, res) => {
  try {
    const posts = await DonationPost.find()
      .populate("donor", "name email phone")
      .sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching donation posts:", error);
    return res.status(500).json({ error: "Failed to fetch donation posts" });
  }
};

export const createDonationPost = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      quantity,
      itemCondition,
      pickupLocation,
      imageUrl,
    } = req.body;

    if (!title || !category || !description || !quantity || !pickupLocation) {
      return res.status(400).json({ error: "Please fill in all required fields" });
    }

    const post = await DonationPost.create({
      title,
      category,
      description,
      quantity,
      itemCondition,
      pickupLocation,
      imageUrl: imageUrl || "",
      donor: req.user.id,
      status: "Listed",
    });

    return res.status(201).json({ post });
  } catch (error) {
    console.error("Error creating donation post:", error);
    return res.status(500).json({ error: "Failed to create donation post" });
  }
};

export const getMyDonationPosts = async (req, res) => {
  try {
    const posts = await DonationPost.find({ donor: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching donor posts:", error);
    return res.status(500).json({ error: "Failed to fetch your donation posts" });
  }
};

const editableFields = [
  "title",
  "category",
  "description",
  "quantity",
  "itemCondition",
  "pickupLocation",
  "imageUrl",
];

export const updateDonationPost = async (req, res) => {
  try {
    const post = await DonationPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Donation post not found" });
    if (post.donor.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only edit your own items" });
    }
    if (post.status !== "Listed") {
      return res.status(409).json({ error: "Only listed items can be edited" });
    }

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });
    await post.save();
    return res.status(200).json({ post });
  } catch (error) {
    console.error("Error updating donation post:", error);
    return res.status(500).json({ error: "Failed to update donation post" });
  }
};

export const deleteDonationPost = async (req, res) => {
  try {
    const post = await DonationPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Donation post not found" });
    if (post.donor.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own items" });
    }
    if (post.status !== "Listed") {
      return res.status(409).json({ error: "Only listed items can be deleted" });
    }

    await post.deleteOne();
    return res.status(200).json({ message: "Donation post deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation post:", error);
    return res.status(500).json({ error: "Failed to delete donation post" });
  }
};

export const getDonationPostById = async (req, res) => {
  try {
    const post = await DonationPost.findById(req.params.id).populate(
      "donor",
      "name email phone",
    );

    if (!post) {
      return res.status(404).json({ error: "Donation post not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching donation post:", error);
    return res.status(500).json({ error: "Failed to fetch donation post" });
  }
};
