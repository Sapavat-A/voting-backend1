const Web3 = require("web3")

const web3 = new Web3(process.env.NETWORK_RPC_URL || "http://127.0.0.1:8545")

const initializeBlockchain = async () => {
  try {
    const isConnected = await web3.eth.net.isListening()
    if (isConnected) {
      console.log("Connected to Ethereum network")
      const accounts = await web3.eth.getAccounts()
      console.log("Available accounts:", accounts.length)
    }
  } catch (error) {
    console.error("Blockchain connection failed:", error.message)
  }
}

module.exports = {
  web3,
  initializeBlockchain,
}
