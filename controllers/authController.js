const Voter = require("../models/Voter")
const { generateToken } = require("../utils/jwtUtils")
const { AppError } = require("../utils/errorHandler")

const register = async (req, res, next) => {
  try {
    const { name, email, voterId, password, walletAddress, role } = req.body

    if (!name || !email || !voterId || !password || !walletAddress) {
      throw new AppError("All fields are required", 400)
    }

    const existingVoter = await Voter.findOne({ $or: [{ email }, { voterId }, { walletAddress }] })
    if (existingVoter) {
      throw new AppError("Email, voter ID, or wallet address already registered", 409)
    }

    const newVoter = new Voter({
      name,
      email,
      voterId,
      password,
      walletAddress,
      role: role || "voter",
    })

    await newVoter.save()

    res.status(201).json({
      message: "Voter registered successfully",
      voterId: newVoter._id,
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError("Email and password are required", 400)
    }

    const voter = await Voter.findOne({ email })
    if (!voter) {
      throw new AppError("Invalid email or password", 401)
    }

    const isPasswordValid = await voter.comparePassword(password)
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401)
    }

    const token = generateToken(voter._id, voter.role)

    res.json({
      message: "Login successful",
      token,
      voter: {
        id: voter._id,
        name: voter.name,
        email: voter.email,
        role: voter.role,
        hasVoted: voter.hasVoted,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
}
