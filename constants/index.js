import { ChainId, Token } from '@uniswap/sdk-core'
import { BigNumber } from 'ethers'
import PoolList from './poolList'
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

export const DAI = new Token(
  ChainId.MAINNET,
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  18,
  'DAI',
  'DAI Stablecoin'
)
export const WETH = new Token(
  ChainId.MAINNET,
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  18,
  'WETH',
  'Wrapped Ether'
)
export const USDC = new Token(
  ChainId.MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)
export const USDT = new Token(
  ChainId.MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)

export {
  ERC20ABI,
  NFTPositionManagerABI,
  UniswapV3PoolABI,
  FaucetABI,
  PoolList,
}
