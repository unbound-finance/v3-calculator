import { BigNumber } from 'ethers'
const NFTPositionManagerABI = require('./abis/NFTPositionManager.json')
const ERC20ABI = require('./abis/ERC20.json')
const UniswapV3PoolABI = require('./abis/UniswapV3Pool.json')
const FaucetABI = require('./abis/Faucet.json')

export const NFTPositionManagerAddress =
  '0xa31b47971cdc5376e41cfa2d4378912156ab1f10'

export const daiAddress = '0x861add02867dee152cf54a252feec46d09ebbd8f'
export const wethAddress = '0xea281ab5765b95856659d166b275c2123d9cd8df'
export const ethDaiPoolAddress = '0xbc13cc5B09BE2e36135C82724B134582Fc15F6A6'
export const faucetAddress = '0x1EADf7c1428b91239D9a51dD3e895eEA13B033fC'

export const MaxUint128 = BigNumber.from(2).pow(128).sub(1)

export { ERC20ABI, NFTPositionManagerABI, UniswapV3PoolABI, FaucetABI }
