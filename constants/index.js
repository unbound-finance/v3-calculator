import { BigNumber } from 'ethers'
const NFTPositionManagerABI = require('./abis/NFTPositionManager.json')
const ERC20ABI = require('./abis/ERC20.json')
const UniswapV3PoolABI = require('./abis/UniswapV3Pool.json')
const FaucetABI = require('./abis/Faucet.json')

export const NFTPositionManagerAddress =
  '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

export const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'
export const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const ethDaiPoolAddress = '0xC2e9F25Be6257c210d7Adf0D4Cd6E3E881ba25f8'
export const faucetAddress = '0x1EADf7c1428b91239D9a51dD3e895eEA13B033fC'

export const MaxUint128 = BigNumber.from(2).pow(128).sub(1)

export { ERC20ABI, NFTPositionManagerABI, UniswapV3PoolABI, FaucetABI }
