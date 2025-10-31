const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  const status = err.status || 500
  const message = err.message || "Internal Server Error"

  res.status(status).json({
    error: message,
    timestamp: new Date(),
  })
}

const AppError = class extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

module.exports = {
  errorHandler,
  AppError,
}
