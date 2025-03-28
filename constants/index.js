import { BigNumber } from 'ethers'
const NFTPositionManagerABI = require('./abis/NFTPositionManager.json')
const ERC20ABI = require('./abis/ERC20.json')
const UniswapV3PoolABI = require('./abis/UniswapV3Pool.json')
const FaucetABI = require('./abis/Faucet.json')

export const NFTPositionManagerAddress =
  '0x815BCC87613315327E04e4A3b7c96a79Ae80760c'

export const daiAddress = '0xF821ddD9068B75F0d906f066590c646085B9fF3a'
export const wethAddress = '0xf35acA6667C80705fFB21a84ab39F1ac9a4b00fE'
export const ethDaiPoolAddress = '0x95f917bD85d0aa741bC8e2AC6b69e8427c991F5b'
export const faucetAddress = '0x1ba2e2267160A77E94881192272ecfe7DF72c32a'

export const MaxUint128 = BigNumber.from(2).pow(128).sub(1)

export { ERC20ABI, NFTPositionManagerABI, UniswapV3PoolABI, FaucetABI }
