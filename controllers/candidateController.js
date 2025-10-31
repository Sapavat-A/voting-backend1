const Candidate = require("../models/Candidate")
const { AppError } = require("../utils/errorHandler")

const addCandidate = async (req, res, next) => {
  try {
    const { name, party, walletAddress, contractId, bio } = req.body

    if (!name || !party || !walletAddress || contractId === undefined) {
      throw new AppError("Name, party, wallet address, and contract ID are required", 400)
    }

    const existingCandidate = await Candidate.findOne({ walletAddress })
    if (existingCandidate) {
      throw new AppError("Candidate with this wallet address already exists", 409)
    }

    const newCandidate = new Candidate({
      name,
      party,
      walletAddress,
      contractId,
      bio: bio || "",
    })

    await newCandidate.save()

    res.status(201).json({
      message: "Candidate added successfully",
      candidate: newCandidate,
    })
  } catch (error) {
    next(error)
  }
}

const getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().select("-__v")
    res.json({
      message: "Candidates retrieved successfully",
      count: candidates.length,
      candidates,
    })
  } catch (error) {
    next(error)
  }
}

const getCandidateById = async (req, res, next) => {
  try {
    const { id } = req.params
    const candidate = await Candidate.findById(id)

    if (!candidate) {
      throw new AppError("Candidate not found", 404)
    }

    res.json({
      message: "Candidate retrieved successfully",
      candidate,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addCandidate,
  getAllCandidates,
  getCandidateById,
}
