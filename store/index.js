import { getEthPrice, getIndicatorValues } from '../utils'

export const state = () => ({
  ethPrice: 0,
  dai: 0,
  range: {},
  fetchingPrice: false,
})

export const mutations = {
  SET_ETH_PRICE(state, price) {
    state.ethPrice = price
  },
  SET_RANGE(state, range) {
    state.range = range
  },
  SET_PRICE_LOADER(state, payload) {
    state.fetchingPrice = payload
  },
  SET_DAI_COUNT(state, payload) {
    state.dai = payload
  },
}

export const actions = {
  async fetchEthPrice({ commit }) {
    commit('SET_PRICE_LOADER', true)
    const price = await getEthPrice()
    commit('SET_ETH_PRICE', price)
    commit('SET_PRICE_LOADER', false)
  },

  async fetchIndicatorValues({ commit }, { apollo, indicator, days }) {
    commit('SET_PRICE_LOADER', true)
    const { min, max } = await getIndicatorValues(apollo, indicator, days)
    commit('SET_PRICE_LOADER', false)
    return { min, max }
  },

  async calculateRange(
    { commit, state, dispatch },
    {
      currency,
      percentage,
      buy = 0,
      sell = 0,
      indicator = 'pct',
      apollo,
      days = 7,
    }
  ) {
    if (indicator === 'pct') {
      await dispatch('fetchEthPrice')
      const ethPrice = Number(state.ethPrice)
      let target
      let ratio

      if (currency === 'DAI') {
        target = ethPrice - (ethPrice * percentage) / 100
        ratio = target / ethPrice
        commit('SET_RANGE', { a: ratio ** 2 * ethPrice, b: ethPrice })
      } else if (currency === 'ETH-DAI') {
        const buyTarget = ethPrice - (ethPrice * buy) / 100
        const sellTarget = ethPrice + (ethPrice * sell) / 100
        const buyRatio = buyTarget / ethPrice
        const sellRatio = sellTarget / ethPrice
        commit('SET_RANGE', {
          a: buyRatio ** 2 * ethPrice,
          b: sellRatio ** 2 * ethPrice,
        })
      } else {
        target = ethPrice + (ethPrice * percentage) / 100
        ratio = target / ethPrice
        commit('SET_RANGE', { a: ethPrice, b: ratio ** 2 * ethPrice })
      }
    } else {
      const { min, max } = await dispatch('fetchIndicatorValues', {
        apollo,
        indicator,
        days,
      })
      commit('SET_RANGE', { a: min, b: max })
    }

    let { ethPrice } = state
    const {
      range: { a, b },
    } = state

    ethPrice = Number(ethPrice)

    const sqEth = Math.sqrt(ethPrice)
    const sqA = Math.sqrt(a)
    const d = 1 - Math.sqrt(ethPrice / b)

    console.log({ ethPrice, a, b, sqEth, sqA, d })

    const daiRequired = sqEth * ((sqEth - sqA) / d)

    commit('SET_DAI_COUNT', daiRequired)
  },
}

export const getters = {
  getEthPrice: (state) => {
    return state.ethPrice
  },
  getRange: (state) => {
    return state.range
  },
  getDaiCount: (state) => {
    return state.dai
  },
}
