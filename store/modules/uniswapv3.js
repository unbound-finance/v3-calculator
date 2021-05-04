import { getTickRange } from '~/utils/helpers/UniswapV3'
import NFTPositionManager from '~/utils/NFTPositionManager'
import { daiAddress, wethAddress } from '~/constants'

export default {
  state: {
    ticks: {},
  },
  mutations: {
    SET_TICK_RANGE(state, tickRange) {
      state.ticks = tickRange
    },
  },
  actions: {
    // tick range
    tickRange({ commit }) {
      const range = getTickRange({
        low: this.app.store.state.range.a,
        high: this.app.store.state.range.b,
      })
      commit('SET_TICK_RANGE', range)
    },

    // mint
    mint(
      { state, dispatch },
      { token0 = wethAddress, token1 = daiAddress, amount0, amount1 }
    ) {
      // get tickRange
      dispatch('tickRange')

      // call mint
      const nft = new NFTPositionManager()
      return nft.mint({
        token0,
        token1,
        tickLower: state.ticks.lowTick,
        tickUpper: state.ticks.highTick,
        amount0,
        amount1,
      })
    },
  },
}
