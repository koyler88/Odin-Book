const prisma = require("./prismaClient");

async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profile: { select: { avatarUrl: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

async function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

async function createUser(username, hashedPassword) {
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  await createProfile(user.id);

  return user;
}


async function getPostsByUserId(userId) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profile: { select: { avatarUrl: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

async function getPostsFromFollowedUsers(userId) {
  const followedUsers = await prisma.follow.findMany({
    where: { followerId: userId, status: "accepted" },
    select: { followingId: true },
  });

  const followingIds = followedUsers.map((f) => f.followingId);

  return prisma.post.findMany({
    where: { authorId: { in: followingIds } },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profile: { select: { avatarUrl: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function createPost({ title, content, authorId, imageUrl }) {
  return prisma.post.create({
    data: {
      content,
      authorId,
      imageUrl,
    },
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
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  });

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
  });

  return { ...profile, posts };
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

async function createProfile(userId) {
  // Default values can be customized as needed
  const DEFAULT_AVATAR = "https://res.cloudinary.com/drromn4sx/image/upload/v1758656851/avatar-default-svgrepo-com_p7dw48.svg"
  return prisma.profile.create({
    data: {
      userId,
      bio: '',
      avatarUrl: DEFAULT_AVATAR,
      location: '',
    },
  });
}

async function findUsersByUsername(username) {
  return prisma.user.findMany({
    where: {
      username: {
        contains: username,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          avatarUrl: true,
        },
      },
    },
    take: 10, // optional: limit results to 10 for performance
  });
}


module.exports = {
  findUserByUsername,
  createUser,
  getAllPosts,
  getPostsByUserId,
  getPostsFromFollowedUsers,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getProfileByUserId,
  createProfile,
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
  findUsersByUsername
};

