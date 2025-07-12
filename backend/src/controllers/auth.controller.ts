import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/generateToken";
import { getLocalizedMessage } from "../utils/i18nHelper";

// REGISTER_CONTROLLER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.allFieldsRequired") })
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.passwordMismatch") })
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.passwordMinLength") })
      return;
    }

    const user = await User.findOne({ username });

    if (user) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.userExists") })
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
        message: getLocalizedMessage(req, "success.registrationSuccessful"),
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          profilePicture: newUser.profilePicture
        }
      })
    } else {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.invalidUserData") })
    }

  } catch (error) {
    console.log("error in register controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") })
  }
}

// LOGIN_CONTROLLER
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.allFieldsRequired") })
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.passwordMinLength") })
    }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      res.status(400).json({ error: getLocalizedMessage(req, "errors.invalidCredentials") })
      return;
    }

    generateTokenAndSetCookies(user._id, res);

    res.status(200).json({
      message: getLocalizedMessage(req, "success.loginSuccessful"),
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
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") })
  }
}

// LOGOUT_CONTROLLER
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0
    });
    res.status(200).json({ message: getLocalizedMessage(req, "success.logoutSuccessful") });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ error: getLocalizedMessage(req, "errors.internalServerError") })
  }
}