<template>
  <div class="container py-5">
    <!-- <div
      v-if="loading"
      class="flex flex-col items-center justify-center space-y-4 min-h-screen"
    >
      <MagicLoader :color="color" />
      <div class="text-gray-800 text-sm">
        Fetching best range for ETH-DAI pair, please wait
      </div>
    </div> -->
    <div>
      <form
        class="flex flex-wrap items-end space-x-4"
        @submit.prevent="getTickData"
      >
        <div class="inline-flex flex-col">
          <label>select pool</label>
          <select
            v-model="selectedPool"
            class="focus:outline-none cursor-pointer"
          >
            <option
              v-for="(pool, index) in PoolList"
              :key="index"
              class="text-sm"
              :value="pool"
            >
              {{ pool.name }}
            </option>
          </select>
        </div>
        <div class="inline-flex flex-col">
          <label>start price</label>
          <input v-model="startPrice" type="number" />
        </div>
        <div class="inline-flex flex-col">
          <label>end price</label>
          <input v-model="endPrice" type="number" />
        </div>
        <div class="inline-flex flex-col">
          <label>price space</label>
          <input v-model="priceSpace" type="number" />
        </div>
        <button
          class="py-2 px-4 appearance-none bg-green-600 text-white focus:outline-none"
          @click="getTickData"
        >
          <MagicLoader v-if="loading" :color="white" />
          <span v-else>Search</span>
        </button>
      </form>
      <div v-if="ticks && ticks.length > 0" class="mt-8">
        <!-- <div v-for="(range, i) in rangeGroup.slice(0, 3)" :key="i">
          <div class="flex space-x-2 font-mono text-sm">
            <span> {{ i + 1 }}</span>
            <span>Range: {{ range.minTickIdx }} - {{ range.maxTickIdx }}</span>
            <span
              >Price:
              <span class="text-green-600 font-medium">
                {{ range.minPrice | localeNumber }} -
                {{ range.maxPrice | localeNumber }}
              </span>
            </span>
            <span
              >Total Liquidity:
              <span class="text-green-600 font-medium">
                {{ range.totalLiquidity | localeNumber }}
              </span>
            </span>
          </div>
        </div> -->

        <div class="mt-4">
          <span class="font-medium">Price Range wise liquidity</span>
          <div class="border-b border-gray-300 border-dashed my-2"></div>
          <div v-for="(liquidity, i) in liquidityGroup" :key="i">
            <div class="flex space-x-2 font-mono text-sm">
              <span> {{ i + 1 }}</span>
              <span
                >Price Range:
                <span class="text-green-600 font-medium">{{
                  liquidity.range
                }}</span>
              </span>
              <span
                >Total Liquidity:
                <span class="text-green-600 font-medium">
                  {{ liquidity.liquidity | localeNumber }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div
      v-else
      class="text-gray-800 flex flex-col items-center justify-center min-h-screen"
    >
      Error in fetching data
    </div> -->
  </div>
</template>

<script>
import { PoolList } from '../constants'
import { getPriceByTick } from '../utils/helpers/UniswapV3'
import getLiquidityAtTicksQuery from '~/apollo/queries/getLiquidityAtTicks'

export default {
  // apollo: {
  //   $loadingKey: 'loading',
  //   $client: 'uniswapV3SubgraphClient',
  //   ticks: {
  //     prefetch: true,
  //     query: getLiquidityAtTicksQuery,
  //     variables() {
  //       return {
  //         pool: '0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8',
  //         tickLowerBound: -99480,
  //         tickUpperBound: -63480,
  //       }
  //     },
  //   },
  // },
  data: () => ({
    PoolList,
    selectedPool: PoolList[0],
    startPrice: 2000,
    endPrice: 5000,
    priceSpace: 200,
    loading: false,
    color: '#059669',
    white: '#ffffff',
    ticks: [],
    rangeGroup: [],
    liquidityGroup: [],
  }),

  watch: {
    ticks() {
      this.sortTicks()
      this.findLiquidityPerPriceSpacing(
        this.priceSpace,
        this.startPrice,
        this.endPrice
      )
    },
  },

  mounted() {
    this.sortTicks()
    this.findLiquidityPerPriceSpacing(
      this.priceSpace,
      this.startPrice,
      this.endPrice
    )
  },

  methods: {
    async getTickData() {
      this.loading = true
      if (this.selectedPool) {
        const {
          data: { ticks },
        } = await this.$apollo.query({
          client: 'uniswapV3SubgraphClient',
          query: getLiquidityAtTicksQuery,
          variables: {
            pool: this.selectedPool.address,
            tickLowerBound: this.selectedPool.tickLowerBound,
            tickUpperBound: this.selectedPool.tickUpperBound,
          },
        })
        this.ticks = ticks
        this.findLiquidityPerPriceSpacing(
          this.priceSpace,
          this.startPrice,
          this.endPrice
        )
        this.loading = false
      }
    },
    sortTicks() {
      const data = this.ticks
      if (data) {
        this.rangeGroup = data
          .filter(
            (e) =>
              Math.abs(
                Number(e.liquidityNet) /
                  Number(`1e${18 - this.selectedPool.decimals}`)
              ) > 100000
          )
          .reduce((arr, tick) => {
            const lastPriceGroup = arr[arr.length - 1]
            const price1 = getPriceByTick({
              base: this.selectedPool.baseToken,
              quote: this.selectedPool.quoteToken,
              tick: tick.tickIdx,
            })
            const lastPrice =
              lastPriceGroup?.[lastPriceGroup.length - 1]?.tickIdx ||
              Number.NEGATIVE_INFINITY

            if (price1 - lastPrice > 200) arr.push([tick])
            else lastPriceGroup.push(tick)
            return arr
          }, [])
          .sort((tickGroupA, tickGroupB) => {
            const maxLiqA = tickGroupA.reduce(
              (sum, { liquidityNet }) =>
                sum +
                Math.abs(
                  Number(liquidityNet) /
                    Number(`1e${18 - this.selectedPool.decimals}`)
                ),
              0
            )
            const maxLiqB = tickGroupB.reduce(
              (sum, { liquidityNet }) =>
                sum +
                Math.abs(
                  Number(liquidityNet) /
                    Number(`1e${18 - this.selectedPool.decimals}`)
                ),
              0
            )

            return maxLiqB - maxLiqA
          })
          .map((tickGroup) => {
            const priceGroup = tickGroup.map((tick) =>
              Math.abs(Number(tick.price1))
            )
            const tickIdxGroup = tickGroup.map((tick) =>
              Math.abs(Number(tick.tickIdx))
            )
            const totalLiquidity = tickGroup.reduce(
              (sum, { liquidityNet }) =>
                sum +
                Math.abs(
                  Number(liquidityNet) /
                    Number(`1e${18 - this.selectedPool.decimals}`)
                ),
              0
            )

            return {
              minTickIdx: Math.min(...tickIdxGroup),
              maxTickIdx: Math.max(...tickIdxGroup),
              minPrice: Math.min(...priceGroup),
              maxPrice: Math.max(...priceGroup),
              totalLiquidity,
            }
          })
      }
    },

    findLiquidityPerPriceSpacing(priceSpace, startPrice, endPrice) {
      this.loading = true
      priceSpace = Number(priceSpace)
      startPrice = Number(startPrice)
      endPrice = Number(endPrice)

      const data = this.ticks
      if (data) {
        this.liquidityGroup = []
        let i = startPrice
        const space = priceSpace
        for (i; i < endPrice; i += space) {
          const liquidity = data
            .filter(
              ({ tickIdx }) =>
                i + 1 <
                  getPriceByTick({
                    quote: this.selectedPool.quoteToken,
                    tick: tickIdx,
                  }) &&
                getPriceByTick({
                  quote: this.selectedPool.quoteToken,
                  tick: tickIdx,
                }) <
                  i + priceSpace
            )
            .reduce(
              (sum, { liquidityNet }) =>
                sum +
                Math.abs(
                  Number(liquidityNet) /
                    Number(`1e${18 - this.selectedPool.decimals}`)
                ),
              0
            )

          this.liquidityGroup.push({
            range:
              i === startPrice
                ? `${i}-${i + priceSpace}`
                : `${i + 1}-${i + priceSpace}`,
            liquidity,
          })
          this.loading = false
        }
      }
    },
  },
}
</script>
