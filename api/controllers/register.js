// import bcrypt from "bcrypt";
// import prisma from "../lib/prisma.js";

// export let register = async (req, res) => {
//   try {
//     // Hash password
//     let hashPassword = await bcrypt.hash(req.body.password, 10);

//     // CREATE A NEW USER AND SAVE IN DB
//     const newUser = await prisma.user.create({
//       data: {
//         username: req.body.username,
//         email: req.body.email,
//         password: hashPassword,
//       },
//     });

//     console.log("New user created:", newUser);

//     // Send success response
//     res
//       .status(201)
//       .json({ message: "User created successfully", user: newUser });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     // Send error response
//     res.status(500).json({ error: "Failed to create user" });
//   }
// };
