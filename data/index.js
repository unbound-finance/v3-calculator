import getHistoricalPriceQuery from '~/apollo/queries/getHistoricalPrice'

export async function getHistoricalPrice(apollo, { token, timestamp }) {
  const {
    data: { tokenDayDatas },
  } = await apollo.query({
    query: getHistoricalPriceQuery,
    variables: { token, timestamp },
  })

  return tokenDayDatas.map((a) => Number(a.priceUSD))
}
