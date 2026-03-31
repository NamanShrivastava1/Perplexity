import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists) {
      return res.status(409).json({
        success: false,
        message: "User with this username or email already exists",
        error: "User Already Exists",
      });
    }

    const user = await userModel.create({
      username,
      email,
      password,
    });

    const emailVerificationToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    await sendEmail(
      user.email,
      "Welcome to Perplexity!",
      `<h1>Welcome, ${user.username}!</h1><p>Thank you for registering at Perplexity. We're excited to have you on board!</p>
      <p>Please verify your email address by clicking the link below:</p><p><a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a></p>
      <p>Thank you,<br/>The Perplexity Team</p>`,
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid token or user not found",
      error: "User Not Found",
    });
  }

  user.verified = true;
  await user.save();

  const html = `<h1>Email Verified</h1><p>Your email has been verified successfully. You can now log in to your account.</p>
  <p><a href="http://localhost:3000/login">Go to Login</a></p>`;

  res.send(html);
}
