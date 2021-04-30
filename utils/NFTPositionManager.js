import { ethers } from 'ethers'
import { NFTPositionManagerAddress, NFTPositionManagerABI } from '../constants'
import ECR20Helper from './ERC20'
import WalletProvider from './WalletProvider'

class NFTPositionManager {
  wallet = new WalletProvider()
  ERC20 = new ECR20Helper(this.wallet)
  nft = new ethers.Contract(
    NFTPositionManagerAddress,
    NFTPositionManagerABI,
    this.wallet.signer
  )

  // mint NFTs
  async mint({
    token0,
    token1,
    fees = 3000,
    tickLower,
    tickUpper,
    amount0 = 1,
    amount1 = 1,
    minAmount0 = 0,
    minAmount1 = 0,
  }) {
    // check for token0 and token1 allowance
    const token0Allowance = await this.ERC20.canInteract(
      token0,
      NFTPositionManagerAddress
    )
    const token1Allowance = await this.ERC20.canInteract(
      token1,
      NFTPositionManagerAddress
    )

    if (!token0Allowance) {
      // approve token0
      await this.ERC20.approve(token0, NFTPositionManagerAddress)
    }
    if (!token1Allowance) {
      // approve token1
      await this.ERC20.approve(token1, NFTPositionManagerAddress)
    }
    // convert amounts to BigNumber
    amount0 = ethers.utils.parseEther(amount0.toString())
    amount1 = ethers.utils.parseEther(amount1.toString())
    // set deadline and userAddress
    const deadline = Math.floor(new Date().getTime() / 1000) + 300
    const userAddress = this.wallet.address

    console.log({
      token0,
      token1,
      fees,
      tickLower,
      tickUpper,
      amount0,
      amount1,
      minAmount0,
      minAmount1,
      userAddress,
      deadline,
    })

    // emit mint transaction to network
    return this.nft.mint([
      token0, // weth
      token1, // dai
      fees,
      tickLower,
      tickUpper,
      amount0,
      amount1,
      minAmount0,
      minAmount1,
      userAddress,
      deadline,
    ])
  }
}

export default NFTPositionManager
