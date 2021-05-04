import { getEthPrice, getIndicatorValues } from '../utils'
import UniswapV3Module from './modules/uniswapv3'

export const state = () => ({
  ethPrice: 0,
  dai: 0,
  range: null,
  fetchingPrice: false,
  config: {},
  ready: false,
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
  setConfig(state, config) {
    state.config = config
    state.ready = true
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
      tgtPrice,
      buy = 0,
      sell = 0,
      indicator = 'pct',
      apollo,
      days = 7,
    }
  ) {
    await dispatch('fetchEthPrice')
    let ethPrice = Number(state.ethPrice)
    if (indicator === 'pct' || indicator === 'tgt') {
      const {
        data: { a, b },
      } = await this.$axios.post(
        'https://strategy-serverless.vercel.app/api/calculateRange',
        { currency, percentage, tgtPrice, buy, sell, indicator, ethPrice }
      )
      commit('SET_RANGE', { a, b })
    } else {
      const { min, max } = await dispatch('fetchIndicatorValues', {
        apollo,
        indicator,
        days,
      })
      commit('SET_RANGE', { a: min, b: max })
    }

    const {
      range: { a, b },
    } = state

    ethPrice = Number(ethPrice)

    const sqEth = Math.sqrt(ethPrice)
    const sqA = Math.sqrt(a)
    const d = 1 - Math.sqrt(ethPrice / b)

    const daiRequired = sqEth * ((sqEth - sqA) / d)

    commit('SET_DAI_COUNT', daiRequired)
  },
}

export const modules = { UniswapV3Module }

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
