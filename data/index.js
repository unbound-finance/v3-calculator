import getHistoricalPriceQuery from '~/apollo/queries/getHistoricalPrice'
import getUserNFTQuery from '~/apollo/queries/getUserNFT'

export async function getHistoricalPrice(apollo, { token, timestamp }) {
  const {
    data: { tokenDayDatas },
  } = await apollo.query({
    query: getHistoricalPriceQuery,
    variables: { token, timestamp },
  })

  return tokenDayDatas.map((a) => Number(a.priceUSD))
}

export async function getUserNFT(apollo, { userAddress }) {
  const {
    data: { nftTokens },
  } = await apollo.query({
    query: getUserNFTQuery,
    variables: { userAddress },
  })

  return nftTokens
}
