const { verifyToken } = require("../utils/jwtUtils")
const { AppError } = require("../utils/errorHandler")

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new AppError("No token provided", 401)
    }

    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

module.exports = {
  authMiddleware,
  adminMiddleware,
}
