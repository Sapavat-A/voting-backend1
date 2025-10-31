const express = require("express")
const { addCandidate, getAllCandidates, getCandidateById } = require("../controllers/candidateController")
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/add", authMiddleware, adminMiddleware, addCandidate)
router.get("/", getAllCandidates)
router.get("/:id", getCandidateById)

module.exports = router
