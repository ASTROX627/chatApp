import { Response } from "express";
import jwt from "jsonwebtoken";
import Schema from "mongoose"

const generateTokenAndSetCookies = (userId: Schema.Types.ObjectId, res:Response) => {
  const secret = process.env.JWT_SECRET;
  if(secret){
    const token = jwt.sign({userId: userId.toString()}, secret, {
      expiresIn: "15d",
    });
    res.cookie("jwt", token,{
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })
  }

}

export default generateTokenAndSetCookies;