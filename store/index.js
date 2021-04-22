import { getEthPrice, getIndicatorValues } from '../utils'

export const state = () => ({
  ethPrice: 0,
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
}

export const actions = {
  async fetchEthPrice({ commit }) {
    commit('SET_PRICE_LOADER', true)
    const price = await getEthPrice()
    commit('SET_ETH_PRICE', price)
    commit('SET_PRICE_LOADER', false)
  },

  async fetchIndicatorValues({ commit }, { indicator, days }) {
    commit('SET_PRICE_LOADER', true)
    const a = await getIndicatorValues(indicator, days)
    commit('SET_PRICE_LOADER', false)
    return a
  },

  async calculateRange(
    { commit, state, dispatch },
    { currency, percentage, buy = 0, sell = 0, indicator = 'pct' }
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
      const data = await dispatch('fetchIndicatorValues', {
        indicator,
        days: 1,
      })
      console.log(data)
    }
  },
}

export const getters = {
  getEthPrice: (state) => {
    return state.ethPrice
  },
  getRange: (state) => {
    return state.range
  },
}
