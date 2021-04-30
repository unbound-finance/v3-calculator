import { ethers } from 'ethers'
import { UniswapV3PoolABI } from '../../constants'
import WalletProvider from '../WalletProvider'

// get token1 price w.r.t token0
export async function getPrice({ poolAddress }) {
  const wallet = new WalletProvider()
  // initiate contract instance
  const pool = new ethers.Contract(
    poolAddress,
    UniswapV3PoolABI,
    wallet.provider
  )
  // call slot0.tick
  const { tick } = await pool.slot0()
  // calculate price
  return { price: 1.0001 ** tick }
}

// get ticks by price range
export function getTickRange({ low, high, tickSpacing = 60 }) {
  const log1001 = 1 / Math.log10(Math.sqrt(1.0001))
  const lowTick = log1001 * Math.log10(Math.sqrt(low))
  const highTick = log1001 * Math.log10(Math.sqrt(high))

  return {
    lowTick: Math.ceil(lowTick / tickSpacing) * tickSpacing,
    highTick: Math.floor(highTick / tickSpacing) * tickSpacing,
  }
}
