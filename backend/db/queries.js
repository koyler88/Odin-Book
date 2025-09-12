const prisma = require("./prismaClient");

async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true } },
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });
}

async function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

async function createUser(username, hashedPassword) {
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
}

async function getPostsByUserId(userId) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true } },
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });
}

async function createPost({ title, content, authorId }) {
  return prisma.post.create({
    data: { title, content, authorId },
  });
}

async function getPostById(postId) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, username: true } },
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });
}

async function updatePost({ title, content, postId }) {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      title,
      content,
    },
  });
}

async function deletePost(postId) {
  return prisma.post.delete({
    where: { id: postId },
  });
}

async function getProfileByUserId(userId) {
  return prisma.profile.findUnique({
    where: { userId },
    include: {
      user: true,
      posts: true,
    },
  });
}

async function updateProfile(userId, data) {
  return prisma.profile.update({
    where: { userId },
    data: {
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      location: data.location,
    },
  });
}

async function getCommentsByPostId(postId) {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      author: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

async function createComment({ content, postId, authorId }) {
  return prisma.comment.create({
    data: { content, postId, authorId },
  });
}

async function getCommentById(commentId) {
  return prisma.comment.findUnique({ where: { id: commentId } });
}

async function updateComment(commentId, content) {
  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
}

async function deleteComment(commentId) {
  return prisma.comment.delete({ where: { id: commentId } });
}

async function addLike({ postId, userId }) {
  return prisma.like.create({
    data: { postId, userId },
  });
}

async function removeLike({ postId, userId }) {
  return prisma.like.delete({
    where: { userId_postId: { userId, postId } },
  });
}

async function createFollow(followerId, followingId) {
  return prisma.follow.create({
    data: { followerId, followingId, status: "accepted" },
  });
}

async function deleteFollow(followerId, followingId) {
  return prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
}

async function getMessagesForUser(userId) {
  return prisma.message.findMany({
    where: {
      OR: [{ authorId: userId }, { recipientId: userId }],
    },
    include: {
      author: { select: { id: true, username: true } },
      recipient: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

async function getConversation(userId, otherUserId) {
  return prisma.message.findMany({
    where: {
      OR: [
        { authorId: userId, recipientId: otherUserId },
        { authorId: otherUserId, recipientId: userId },
      ],
    },
    include: {
      author: { select: { id: true, username: true } },
      recipient: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

async function createMessage({ authorId, recipientId, content }) {
  return prisma.message.create({
    data: {
      authorId,
      recipientId,
      content,
    },
  });
}

async function getMessageById(messageId) {
  return prisma.message.findUnique({
    where: { id: messageId },
  });
}

async function deleteMessage(messageId) {
  return prisma.message.delete({
    where: { id: messageId },
  });
}

module.exports = {
  findUserByUsername,
  createUser,
  getAllPosts,
  getPostsByUserId,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getProfileByUserId,
  updateProfile,
  getCommentsByPostId,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
  addLike,
  removeLike,
  createFollow,
  deleteFollow,
  getMessagesForUser,
  getConversation,
  createMessage,
  getMessageById,
  deleteMessage,
};
