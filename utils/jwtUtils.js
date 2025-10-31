const jwt = require("jsonwebtoken")

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    throw new Error("Invalid or expired token")
  }
}

module.exports = {
  generateToken,
  verifyToken,
}
