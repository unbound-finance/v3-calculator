import { ethers } from 'ethers'
import { getHistoricalPrice } from '../data'
import { ethDaiPoolAddress } from '../constants'
import { bbands, minmax } from './indicators'
import { getPrice } from './helpers/UniswapV3'

export const formatBigNumber = (x) => ethers.utils.formatEther(x)

export async function getEthPrice() {
  return (await getPrice({ poolAddress: ethDaiPoolAddress })).price
}

export async function getIndicatorValues(apollo, indicator, days) {
  const date = new Date()
  const pastDate = new Date(date.getTime() - days * 24 * 60 * 60 * 1000)

  const daysToTimestamp = Math.floor(pastDate.setHours(0, 0, 0, 0) / 1000)
  const prices = await getHistoricalPrice(apollo, {
    token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    timestamp: daysToTimestamp,
  })
  if (indicator === 'bbands') {
    const { min, max } = bbands(prices)
    return { min, max }
  }
  if (indicator === 'minmax') {
    const { min, max } = minmax(prices)
    return { min, max }
  }
  return { min: 0, max: 0 }
}
