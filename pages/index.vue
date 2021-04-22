<template>
  <div
    class="container min-h-screen flex flex-col space-y-8 items-center justify-center"
  >
    <div
      class="text-gray-700 font-medium text-base lg:text-2xl flex flex-wrap -m-3 items-center justify-center"
    >
      <div class="p-3 w-full">
        <span>I want to provide liquidity in</span>
        <CurrencySelector
          class="px-2"
          :options="currencies"
          @selected="currencyHandler"
        />
      </div>
      <div class="p-3 w-full">
        <span>Calculate my range by</span>
        <IndicatorSelector :options="indicators" @selected="indicatorHandler" />
        <span v-if="indicator.id !== 'pct'">
          and get last
          <DaysSelector class="px-2" :options="days" @selected="daysHandler" />
          day data</span
        >
      </div>
      <div v-if="indicator && indicator.id === 'pct'">
        <div v-if="currency !== 'ETH-DAI'" class="p-3 w-full">
          I want to
          {{ currency == 'DAI' ? 'buy' : 'sell' }}
          <span>ETH at</span>
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
          {{ currency == 'DAI' ? 'below' : 'above' }}
          <span
            >the current ETH price
            <span class="text-green-600 font-semibold"> ${{ ethPrice }}</span>
          </span>
        </div>
        <div v-else class="p-3 w-full">
          I want to buy ETH at
          <div
            class="mx-2 w-16 md:w-24 border-b-2 border-dotted text-green-600 border-green-500 font-semibold inline-flex items-center justify-between"
          >
            <input
              v-model="buy"
              class="w-auto min-w-0 focus:outline-none font-semibold"
              type="number"
            />
            <span>%</span>
          </div>
          below and sell at
          <div
            class="mx-2 w-16 md:w-24 border-b-2 border-dotted text-green-600 border-green-500 font-semibold inline-flex items-center justify-between"
          >
            <input
              v-model="sell"
              class="w-auto min-w-0 focus:outline-none font-semibold"
              type="number"
            />
            <span>%</span>
          </div>
        </div>
        <div v-if="currency == 'ETH-DAI'" class="p-3 w-full">
          above the current ETH price
          <span class="text-green-600 font-semibold"> ${{ ethPrice }}</span>
        </div>
      </div>
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
import IndicatorSelector from '~/components/IndicatorSelector.vue'

export default {
  components: { IndicatorSelector },
  data() {
    return {
      currencies: ['ETH', 'DAI', 'ETH-DAI'],
      days: [7, 15, 30],
      indicators: [
        { id: 'pct', name: 'Percentage' },
        { id: 'bbands', name: 'Bollinger Bands' },
        { id: 'minmax', name: 'Min Max' },
      ],
      currency: null,
      day: 7,
      indicator: { id: 'pct', name: 'Percentage' },
      percentage: 10,
      show: true,
      buy: 10,
      sell: 10,
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
    indicator: {
      handler() {
        this.show = true
      },
      deep: true,
    },
  },
  mounted() {
    this.$store.dispatch('fetchEthPrice')
  },
  methods: {
    currencyHandler(currency) {
      this.currency = currency
    },
    indicatorHandler(indicator) {
      this.indicator = indicator
    },
    daysHandler(day) {
      this.day = day
    },
    async rangeHandler() {
      this.ui.loading = true
      await this.$store.dispatch('calculateRange', {
        currency: this.currency,
        percentage: this.percentage,
        buy: this.buy,
        sell: this.sell,
        indicator: this.indicator.id,
        apollo: this.$apollo,
        days: this.day,
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
