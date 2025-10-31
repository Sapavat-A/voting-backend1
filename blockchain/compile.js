const fs = require("fs")
const path = require("path")
const solc = require("solc")

const contractPath = path.join(__dirname, "VotingContract.sol")
const contractSource = fs.readFileSync(contractPath, "utf8")

const input = {
  language: "Solidity",
  sources: {
    "VotingContract.sol": {
      content: contractSource,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
}

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)))

const contract = compiledContract.contracts["VotingContract.sol"]["VotingContract"]
const abi = contract.abi
const bytecode = contract.evm.bytecode.object

module.exports = {
  abi,
  bytecode,
}
