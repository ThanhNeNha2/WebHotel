import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
export const getPosts = async (req, res) => {
  const query = req.query;
  // REACT DUA QUA
  // console.log("query", query);
  try {
    let posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 1000,
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(401).json("failed");
  }
};

export const getPost = async (req, res) => {
  try {
    let id = req.params.id;
    let post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    // KIEM TRA NGUOI DUNG DANG NHAP CHUA

    let userId;
    const token = req.cookies.token;
    if (!token) {
      userId = null;
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          userId = null;
        } else {
          userId = payload.id;
        }
      });
    }
    const saved = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          postId: id,
          userId,
        },
      },
    });

    res.status(200).json({ ...post, isSaved: saved ? true : false });
  } catch (error) {
    console.log(error);
    res.status(401).json("failed");
  }
};

export const addPost = async (req, res) => {
  try {
    let body = req.body;
    let tokenUserId = req.userId;

    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(401).json("failed");
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(401).json("failed");
  }
};

export const deletePost = async (req, res) => {
  try {
    let id = req.params.id;
    let tokenUserId = req.userId;
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Delete post success! " });
  } catch (error) {
    console.log(error);
    res.status(401).json("failed");
  }
};
