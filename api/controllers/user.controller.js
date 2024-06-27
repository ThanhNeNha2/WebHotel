import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    let users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const getUser = async (req, res) => {
  try {
    let user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    let idToken = req.userId;
    let { avatar, password, ...input } = req.body;
    // Cách 1
    let body = { ...(avatar && { avatar }), ...input };
    // Cách 2
    // let body = { ...(avatar ? { avatar } : null), ...input };

    if (password) {
      let hashPassword = await bcrypt.hash(password, 10);
      body = { password: hashPassword, ...input };
    }

    if (id !== idToken) {
      return res
        .status(401)
        .json({ message: "Không xác định được người dùng!" });
    }
    let userUpdate = await prisma.user.update({
      where: {
        id,
      },
      data: body,
    });
    delete userUpdate.password;
    res.status(200).json(userUpdate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    let idToken = req.userId;

    if (id !== idToken) {
      return res
        .status(401)
        .json({ message: "Không xác định được người dùng!" });
    }
    await prisma.user.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Delete Success! " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const savePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const tokenUserId = req.userId;
    const savePost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });
    if (savePost) {
      await prisma.savedPost.delete({
        where: {
          id: savePost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list  " });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const profilePosts = async (req, res) => {
  const tokenUserId = req.params.userId;
  try {
    let userPosts = await prisma.post.findMany({
      where: {
        userId: tokenUserId,
      },
    });
    let saved = await prisma.savedPost.findMany({
      where: {
        userId: tokenUserId,
      },
      include: {
        post: true,
      },
    });
    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};
