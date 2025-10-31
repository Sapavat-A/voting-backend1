const express = require("express")
const { castVote, getResults, getVotesByVoter } = require("../controllers/voteController")
const { authMiddleware } = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/cast", authMiddleware, castVote)
router.get("/results", getResults)
router.get("/my-votes", authMiddleware, getVotesByVoter)

module.exports = router
