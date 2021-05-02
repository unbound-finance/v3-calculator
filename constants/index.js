import { BigNumber } from 'ethers'
const NFTPositionManagerABI = require('./abis/NFTPositionManager.json')
const ERC20ABI = require('./abis/ERC20.json')
const UniswapV3PoolABI = require('./abis/UniswapV3Pool.json')
const FaucetABI = require('./abis/Faucet.json')

export const NFTPositionManagerAddress =
  '0x815BCC87613315327E04e4A3b7c96a79Ae80760c'

export const daiAddress = '0x88254521B0706D59C407B1578576D91dfE2E86Db'
export const wethAddress = '0xeee3c7c2873d1bc87a6a6374827c0b75ead656ee'
export const ethDaiPoolAddress = '0xf3E21d36352167e5c4C8F26186fF69d3e946105a'
export const faucetAddress = '0x1EADf7c1428b91239D9a51dD3e895eEA13B033fC'

export const MaxUint128 = BigNumber.from(2).pow(128).sub(1)

export { ERC20ABI, NFTPositionManagerABI, UniswapV3PoolABI, FaucetABI }
