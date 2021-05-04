import { ethers } from 'ethers'
import {
  NFTPositionManagerAddress,
  NFTPositionManagerABI,
  MaxUint128,
} from '../constants'
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
    amount0 = !amount0
      ? ethers.utils.parseEther('1')
      : ethers.utils.parseEther(amount0.toString())
    amount1 = !amount1
      ? ethers.utils.parseEther('1')
      : ethers.utils.parseEther(amount1.toString())
    // set deadline and userAddress
    const deadline = Math.floor(new Date().getTime() / 1000) + 300
    const userAddress = this.wallet.address

    console.log({
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

  // decrease liquidity
  decreaseLiquidity({ tokenId, liquidity, amount0Min = 0, amount1Min = 0 }) {
    amount0Min = ethers.utils.parseEther(amount0Min.toString())
    amount1Min = ethers.utils.parseEther(amount1Min.toString())
    const deadline = Math.floor(new Date().getTime() / 1000) + 300

    return this.nft.decreaseLiquidity([
      tokenId,
      liquidity,
      amount0Min,
      amount1Min,
      deadline,
    ])
  }

  // collect
  collect({ tokenId, amount0 = MaxUint128, amount1 = MaxUint128 }) {
    const userAddress = this.wallet.address
    return this.nft.collect([tokenId, userAddress, amount0, amount1])
  }

  // burn NFT
  burn({ tokenId }) {
    return this.nft.burn(tokenId)
  }

  // NFTDescriptor
  async nftDescription({ tokenId }) {
    return await this.nft.positions(tokenId)
  }
}

export default NFTPositionManager
