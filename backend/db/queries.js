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

module.exports = {
  findUserByUsername,
  createUser,
};
