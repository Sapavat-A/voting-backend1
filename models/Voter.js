const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const VoterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  voterId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  votedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

VoterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

VoterSchema.methods.comparePassword = async function (passwordToCheck) {
  return await bcrypt.compare(passwordToCheck, this.password)
}

module.exports = mongoose.model("Voter", VoterSchema)
