<template>
  <div
    class="container min-h-screen flex flex-col space-y-8 items-center justify-center"
  >
    <div
      class="text-gray-700 font-medium text-base lg:text-3xl flex flex-wrap -m-3 items-center"
    >
      <div class="p-3 w-full">
        <span>I want to provide liquidity in</span>
        <currency-selector class="px-2" @selected="currencyHandler" />
      </div>
      <div class="p-3 w-full">
        I want to
        {{ currency == 'ETH-DAI' ? 'buy' : 'sell' }}
        <span>at</span>
        <div
          class="mx-2 w-16 md:w-24 border-b-2 border-dotted text-green-600 border-green-500 font-semibold inline-flex items-center justify-between"
        >
          <input
            v-model="percentage"
            class="w-auto min-w-0 focus:outline-none font-semibold"
            type="number"
          />
          <span>%</span>
        </div>
        {{ currency == 'ETH-DAI' ? 'below' : 'above' }}
        <span
          >the current ETH price
          <span class="text-green-600 font-semibold"> ${{ ethPrice }}</span>
        </span>
      </div>
      <div class="p-3 w-full"></div>
    </div>
    <button
      v-if="show"
      class="px-4 py-2 rounded text-white bg-green-600 text-sm font-medium appearance-none focus:outline-none"
      @click="rangeHandler"
    >
      <div
        v-if="ui.loading"
        class="text-lg"
        :class="{ 'loading-dots': ui.loading }"
      ></div>
      <span v-else> Calculate Range</span>
    </button>
    <div
      v-else-if="range.a && range.b"
      class="flex flex-col items-center justify-center space-y-2"
    >
      <div class="text-gray-400 text-sm">You can invest between</div>
      <div
        class="text-4xl lg:text-6xl text-green-600 font-semibold flex flex-wrap items-center justify-center space-y-2 md:space-y-0 md:space-x-4"
      >
        <span>${{ range.a.toFixed(2) }}</span>
        <div class="text-gray-400 text-sm md:w-auto w-full">to</div>
        <span>${{ range.b.toFixed(2) }}</span>
      </div>
      <button
        class="text-green-600 text-sm flex items-center space-x-2 focus:outline-none appearance-none pt-8"
        @click="rangeHandler"
      >
        <span>Calculate Again</span>
        <ReloadIcon :class="{ 'spin-reverse': loading }" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      currency: null,
      percentage: 10,
      show: true,
      ui: {
        loading: false,
      },
    }
  },
  computed: {
    ...mapGetters({ ethPrice: 'getEthPrice', range: 'getRange' }),
    loading() {
      return this.$store.state.fetchingPrice
    },
  },
  watch: {
    percentage() {
      this.$store.dispatch('fetchEthPrice')
    },
    currency() {
      this.$store.dispatch('fetchEthPrice')
    },
  },
  mounted() {
    this.$store.dispatch('fetchEthPrice')
  },
  methods: {
    currencyHandler(currency) {
      this.currency = currency
    },
    async rangeHandler() {
      this.ui.loading = true
      await this.$store.dispatch('calculateRange', {
        currency: this.currency,
        percentage: this.percentage,
      })
      this.ui.loading = false
      this.show = false
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}
.spin-reverse {
  animation: spin-reverse 1s linear infinite;
}
@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>
