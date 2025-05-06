import User from "../models/User.js";

// Authentication middleware (simplified)
export const auth = async (req, res, next) => {
  try {
    // Get Clerk token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Mock auth data (this would come from Clerk in production)
    req.auth = {
      userId: "clerk_user_id", // This would be the actual Clerk ID in production
      firstName: "Demo",
      lastName: "User",
      emailAddresses: [{ emailAddress: "demo@example.com" }],
    };

    // Find or create user in our database
    let user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      // If this is first login, create a user in our DB
      const primaryEmail = req.auth.emailAddresses[0]?.emailAddress;

      if (!primaryEmail) {
        return res.status(400).json({ error: "No email found for user" });
      }

      user = new User({
        clerkId: req.auth.userId,
        email: primaryEmail,
        firstName: req.auth.firstName || "",
        lastName: req.auth.lastName || "",
      });

      await user.save();
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
