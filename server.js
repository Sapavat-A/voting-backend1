require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

// Import routes
const authRoutes = require("./routes/authRoutes")
const candidateRoutes = require("./routes/candidateRoutes")
const voteRoutes = require("./routes/voteRoutes")

// Error handler
const { errorHandler } = require("./utils/errorHandler")

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/candidates", candidateRoutes)
app.use("/api/vote", voteRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Global error handler
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
