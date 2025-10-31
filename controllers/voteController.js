const Voter = require("../models/Voter")
const Candidate = require("../models/Candidate")
const Vote = require("../models/Vote")
const { web3 } = require("../config/blockchain")
const { AppError } = require("../utils/errorHandler")

const castVote = async (req, res, next) => {
  try {
    const { candidateId, transactionHash, blockNumber } = req.body
    const voterId = req.user.id

    if (!candidateId || !transactionHash || blockNumber === undefined) {
      throw new AppError("Candidate ID, transaction hash, and block number are required", 400)
    }

    const voter = await Voter.findById(voterId)
    if (!voter) {
      throw new AppError("Voter not found", 404)
    }

    if (voter.hasVoted) {
      throw new AppError("You have already voted", 400)
    }

    const candidate = await Candidate.findById(candidateId)
    if (!candidate) {
      throw new AppError("Candidate not found", 404)
    }

    try {
      const receipt = await web3.eth.getTransactionReceipt(transactionHash)
      if (!receipt || receipt.blockNumber !== blockNumber) {
        throw new AppError("Invalid transaction hash or block number", 400)
      }
    } catch (error) {
      throw new AppError("Failed to verify blockchain transaction", 400)
    }

    const newVote = new Vote({
      voterId,
      candidateId,
      transactionHash,
      blockNumber,
    })

    await newVote.save()

    voter.hasVoted = true
    voter.votedFor = candidateId
    await voter.save()

    candidate.voteCount += 1
    await candidate.save()

    res.status(201).json({
      message: "Vote cast successfully",
      vote: newVote,
    })
  } catch (error) {
    next(error)
  }
}

const getResults = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: -1 })
    const totalVotes = await Vote.countDocuments()

    const results = candidates.map((candidate) => ({
      id: candidate._id,
      name: candidate.name,
      party: candidate.party,
      voteCount: candidate.voteCount,
      percentage: totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : 0,
    }))

    res.json({
      message: "Results retrieved successfully",
      totalVotes,
      results,
    })
  } catch (error) {
    next(error)
  }
}

const getVotesByVoter = async (req, res, next) => {
  try {
    const voterId = req.user.id
    const votes = await Vote.find({ voterId }).populate("candidateId", "name party")

    res.json({
      message: "Voter votes retrieved successfully",
      count: votes.length,
      votes,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  castVote,
  getResults,
  getVotesByVoter,
}
