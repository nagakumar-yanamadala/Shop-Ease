const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

exports.verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
