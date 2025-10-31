const { web3 } = require("../config/blockchain")
const { abi, bytecode } = require("./compile")

const deployContract = async () => {
  try {
    const accounts = await web3.eth.getAccounts()
    const deployerAccount = accounts[0]

    console.log("Deploying contract from:", deployerAccount)

    const contract = new web3.eth.Contract(abi)

    const deployTx = contract.deploy({
      data: bytecode,
    })

    const gas = await deployTx.estimateGas({ from: deployerAccount })
    const gasPrice = await web3.eth.getGasPrice()

    const deployedContract = await deployTx.send({
      from: deployerAccount,
      gas,
      gasPrice,
    })

    console.log("Contract deployed successfully")
    console.log("Contract address:", deployedContract.options.address)

    return deployedContract.options.address
  } catch (error) {
    console.error("Deployment failed:", error.message)
    throw error
  }
}

module.exports = {
  deployContract,
}
