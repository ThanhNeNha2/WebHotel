import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  try {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;

    const chats = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chats) {
      return res.status(404).json({ message: "Chat not found!" });
    }
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId],
        lastMessage: text,
      },
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};
