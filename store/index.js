import { getEthPrice } from '../utils'

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

  async calculateRange({ commit, state, dispatch }, { currency, percentage }) {
    await dispatch('fetchEthPrice')
    const ethPrice = Number(state.ethPrice)
    let target
    let ratio

    if (currency === 'DAI') {
      target = ethPrice - (ethPrice * percentage) / 100
      ratio = target / ethPrice
      commit('SET_RANGE', { a: ratio ** 2 * ethPrice, b: ethPrice })
    } else {
      target = ethPrice + (ethPrice * percentage) / 100
      ratio = target / ethPrice
      commit('SET_RANGE', { a: ethPrice, b: ratio ** 2 * ethPrice })
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
