<template>
  <div
    class="min-h-screen flex flex-col space-y-8 items-center justify-center text-center"
  >
    <div
      v-if="ui.mintLoader"
      class="flex flex-col space-y-4 flex-wrap -m-3 items-center justify-center"
    >
      <Loader class="my-4 animateLoader" />
      <span class="text-gray-700 font-medium"
        >Please wait while we're minting your NFT...</span
      >
    </div>
    <div
      v-else-if="ui.nftDetails"
      class="flex flex-col flex-wrap -m-3 items-center justify-center animate-zoom space-y-4"
    >
      <img
        class="animate-zoom"
        src="~/assets/icons/success.svg"
        alt="NFT"
        width="128"
      />
      <span class="text-gray-700 font-medium text-xl">NFT Minted </span>
      <span>{{ ui.nftDetails }}</span>
      <div
        class="text-green-600 cursor-pointer text-sm"
        @click="ui.nftDetails = null"
      >
        Go Back
      </div>
    </div>
    <div v-else>
      <div
        class="text-gray-700 font-medium text-base lg:text-2xl flex flex-wrap -m-3 items-center justify-center"
      >
        <div class="p-3 w-full">
          <span>I want to provide single-side liquidity in</span>
          <CurrencySelector
            class="px-2"
            :options="currencies"
            @selected="currencyHandler"
          />
        </div>
        <div class="p-3 w-full">
          <span>Calculate my range by</span>
          <IndicatorSelector
            :options="indicators"
            @selected="indicatorHandler"
          />
          <span v-if="indicator.id == 'bbands' || indicator.id == 'minmax'">
            and get last
            <DaysSelector
              class="px-2"
              :options="days"
              @selected="daysHandler"
            />
            day data</span
          >
        </div>
        <div
          v-if="indicator && (indicator.id === 'pct' || indicator.id === 'tgt')"
        >
          <div v-if="currency !== 'ETH-DAI'" class="p-3 w-full">
            I want to
            {{ currency == 'DAI' ? 'buy' : 'sell' }}
            <span>ETH at</span>
            <div
              class="mx-2 w-16 md:w-24 border-b-2 border-dotted text-green-600 border-green-500 font-semibold inline-flex items-center justify-between"
            >
              <span v-if="indicator.id === 'tgt'">$</span>
              <input
                v-model="percentage"
                class="w-auto min-w-0 focus:outline-none font-semibold"
                type="number"
              />
              <span v-if="indicator.id === 'pct'">%</span>
            </div>
            <span v-if="indicator.id !== 'tgt'">
              {{ currency == 'DAI' ? 'below' : 'above' }}
            </span>
            <span
              >the current ETH price
              <span class="text-green-600 font-semibold">
                ${{ ethPrice.toFixed(2) }}</span
              >
            </span>
          </div>
          <div v-else class="p-3 w-full">
            I want to buy ETH at
            <div
              class="mx-2 w-16 md:w-24 border-b-2 border-dotted text-green-600 border-green-500 font-semibold inline-flex items-center justify-between"
            >
              <span v-if="indicator.id === 'tgt'">$</span>
              <input
                v-model="buy"
                class="w-auto min-w-0 focus:outline-none font-semibold"
                type="number"
              />
              <span v-if="indicator.id === 'pct'">%</span>
            </div>
            {{ indicator.id == 'tgt' ? '' : 'below' }} and sell at
            <div
              class="mx-2 w-16 md:w-24 border-b-2 border-dotted text-green-600 border-green-500 font-semibold inline-flex items-center justify-between"
            >
              <span v-if="indicator.id === 'tgt'">$</span>
              <input
                v-model="sell"
                class="w-auto min-w-0 focus:outline-none font-semibold"
                type="number"
              />
              <span v-if="indicator.id === 'pct'">%</span>
            </div>
          </div>
          <div v-if="currency == 'ETH-DAI'" class="p-3 w-full">
            {{ indicator.id == 'tgt' ? '' : 'above' }} the current ETH price
            <span class="text-green-600 font-semibold">
              ${{ ethPrice.toFixed(2) }}</span
            >
          </div>
        </div>
      </div>
      <button
        v-if="show"
        class="px-4 py-2 mt-8 rounded text-white bg-green-600 text-sm font-medium appearance-none focus:outline-none"
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
        class="flex flex-col items-center justify-center space-y-2 mt-8"
      >
        <div class="text-gray-400 text-sm">
          You can provide liquidity between
        </div>
        <div
          class="text-4xl lg:text-6xl text-green-600 font-semibold flex flex-wrap items-center justify-center space-y-2 md:space-y-0 md:space-x-4"
        >
          <span>${{ range.a.toFixed(2) }}</span>
          <div class="text-gray-400 text-sm md:w-auto w-full">to</div>
          <span>${{ range.b.toFixed(2) }}</span>
        </div>
        <div v-if="dai && currency == 'ETH-DAI'" class="text-gray-400 pt-4">
          For every <span class="font-medium text-green-600">1 ETH</span> you
          need
          <span class="font-medium text-green-600"
            >{{ Number(dai).toFixed(2) }}
            DAI
          </span>
        </div>
        <div class="flex items-center space-x-4 py-8">
          <button
            class="text-green-600 text-sm flex items-center space-x-2 focus:outline-none appearance-none"
            @click="rangeHandler"
          >
            <span>Calculate Again</span>
            <ReloadIcon :class="{ 'spin-reverse': loading }" />
          </button>
          <button
            class="text-white bg-green-600 text-sm focus:outline-none appearance-none rounded py-1 px-4"
            @click="mintHandler"
          >
            <div
              v-if="ui.loading"
              class="text-lg"
              :class="{ 'loading-dots': ui.loading }"
            ></div>
            <span v-else>Mint</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IndicatorSelector from '~/components/IndicatorSelector.vue'
import { formatBigNumber } from '~/utils'

export default {
  components: { IndicatorSelector },
  data() {
    return {
      currencies: ['ETH', 'DAI'],
      days: [7, 15, 30],
      indicators: [
        { id: 'pct', name: 'Percentage' },
        { id: 'tgt', name: 'Target Price' },
        { id: 'bbands', name: 'Bollinger Bands' },
        { id: 'minmax', name: 'Min Max' },
      ],
      currency: null,
      day: 7,
      indicator: { id: 'pct', name: 'Percentage' },
      percentage: 10,
      show: true,
      buy: 0,
      sell: 0,
      ui: {
        loading: false,
        minted: false,
        mintLoader: false,
        nftDetails: null,
      },
    }
  },
  computed: {
    ...mapGetters({
      ethPrice: 'getEthPrice',
      range: 'getRange',
      dai: 'getDaiCount',
    }),
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
    alert(e) {
      window.alert(e)
    },
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
    mintHandler() {
      this.ui.loading = true
      this.$store
        .dispatch('mint', {})
        .then(({ wait }) => {
          this.ui.loading = false
          // show loader
          this.ui.mintLoader = true
          // listen to event
          wait(1).then(({ events }) => {
            this.ui.mintLoader = false
            const { args } = events.find(
              ({ event }) => event === 'IncreaseLiquidity'
            )

            this.ui.nftDetails = {
              amount0: formatBigNumber(args.amount0),
              amount1: formatBigNumber(args.amount1),
              liquidity: formatBigNumber(args.liquidity),
              tokenId: formatBigNumber(args.tokenId) * 1e18,
            }
          })
        })
        .catch(() => {
          this.ui.loading = false
          this.ui.mintLoader = false
        })
    },
  },
}
</script>

<style>
/* .container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
} */
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
.animate-zoom {
  animation: zooming-in 0.25s linear;
}
.animateLoader {
  animation: 2s linear 0s infinite normal none rotateIt;
}
@keyframes rotateIt {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes zooming-in {
  from {
    transform: scale(0, 0);
  }
  to {
    transform: scale(1, 1);
  }
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
