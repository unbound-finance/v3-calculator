import Axios from 'axios'

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
