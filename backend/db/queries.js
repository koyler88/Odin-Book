const prisma = require("./prismaClient");

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
  });
}

async function createPost({ title, content, authorId }) {
  return prisma.post.create({
    data: { title, content, authorId },
  });
}

module.exports = {
  findUserByUsername,
  createUser,
  getPostsByUserId,
  createPost,
};
