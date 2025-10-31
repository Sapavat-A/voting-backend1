const mongoose = require("mongoose")

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  contractId: {
    type: Number,
    required: true,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Candidate", CandidateSchema)
