import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/generateToken";

// REGISTER_CONTROLLER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      res.status(400).json({ error: "All fields are required. " })
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Password and confirm password do not match." })
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters." })
      return;
    }

    const user = await User.findOne({ username });

    if (user) {
      res.status(400).json({ error: "a user with this username already exists." })
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePicture = `https://avatar.iran.liara.run/public/girl/?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePicture: gender === "male" ? boyProfilePicture : girlProfilePicture
    })

    if (newUser) {
      await newUser.save();

      res.status(201).json({
        message: "Registration successful",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          profilePicture: newUser.profilePicture
        }
      })
    } else {
      res.status(400).json({ error: "Invalid user data" })
    }

  } catch (error) {
    console.log("error in register controller", error);
    res.status(500).json({ error: "Internal server error" })
  }
}

// LOGIN_CONTROLLER
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "All fields are required." })
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters." })
    }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    generateTokenAndSetCookies(user._id, res);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        gender: user.gender,
        profilePicture: user.profilePicture
      }
    })
  } catch (error) {
    console.log("Error in login controller.", error);
    res.status(500).json({ error: "Internal server error" })
  }
}

// LOGOUT_CONTROLLER
export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0
    });
    res.status(200).json({ error: "Logged out successful" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ error: "Internal server error" })
  }
}