import Axios from 'axios'
import { getHistoricalPrice } from '../data'
import { bbands, minmax } from './indicators'

export async function getEthPrice() {
  try {
    const data = JSON.stringify({
      query: `
            query($id: String!) {
              pair(id: $id) {
                token1Price
              }
            }
          `,
      variables: {
        id: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
      },
    })
    const config = {
      method: 'post',
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    }

    try {
      const {
        data: {
          data: {
            pair: { token1Price },
          },
        },
      } = await Axios(config)
      if (!token1Price) {
        return 0
      }
      return Number(token1Price).toFixed(2)
    } catch (e) {
      return 0
    }
  } catch (error) {
    throw new Error('Something went wrong', error)
  }
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
