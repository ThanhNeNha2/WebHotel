import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export let register = async (req, res) => {
  try {
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    // CREATE A NEW USER AND SAVE IN DB
    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
      },
    });
    // Send success response
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    // Send error response
    res.status(500).json({ message: "Failed to create user" });
  }
};
export let login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // CHECK IF THE USER EXIST
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Password incorrect!" });
    }

    const age = 1000 * 60 * 60 * 24 * 7;

    // SIGN TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      {
        // het han trong bao laau
        expiresIn: age,
      }
    );
    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.error("Error login :", error);
    res.status(500).json({ message: "Login failed " });
  }
};
export let logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout success!" });
};
