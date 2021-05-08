<template>
  <div class="container py-5">
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center space-y-4 min-h-screen"
    >
      <MagicLoader :color="color" />
      <div class="text-gray-800 text-sm">
        Fetching best range for ETH-DAI pair, please wait
      </div>
    </div>
    <div v-if="ticks && ticks.length > 0">
      <div v-for="(range, i) in rangeGroup" :key="i">
        <div class="flex space-x-2 font-mono text-sm">
          <span> {{ i + 1 }}</span>
          <span>Range: {{ range.minTickIdx }} - {{ range.maxTickIdx }}</span>
          <span
            >Price: {{ range.minPrice | localeNumber }} -
            {{ range.maxPrice | localeNumber }}</span
          >
          <span
            >Total Liquidity: {{ range.totalLiquidity | localeNumber }}
          </span>
        </div>
      </div>

      <pre class="font-mono text-sm">{{ liquidityGroup }}</pre>
    </div>
    <div
      v-else
      class="text-gray-800 flex flex-col items-center justify-center min-h-screen"
    >
      Error in fetching data
    </div>
  </div>
</template>

<script>
import getLiquidityAtTicksQuery from '~/apollo/queries/getLiquidityAtTicks'

export default {
  apollo: {
    $loadingKey: 'loading',
    $client: 'uniswapV3SubgraphClient',
    ticks: {
      prefetch: true,
      query: getLiquidityAtTicksQuery,
      variables() {
        return {
          pool: '0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8',
          tickLowerBound: -99480,
          tickUpperBound: -63480,
        }
      },
    },
  },
  data: () => ({
    loading: 0,
    color: '#059669',
    rangeGroup: [],
    liquidityGroup: [],
  }),

  watch: {
    ticks() {
      this.sortTicks()
      this.findLiquidityPerPriceSpacing(200, 2000, 5000)
    },
  },

  mounted() {
    this.sortTicks()
    this.findLiquidityPerPriceSpacing(200, 2000, 5000)
  },

  methods: {
    sortTicks() {
      const data = this.ticks
      if (data) {
        this.rangeGroup = data
          .filter((e) => Math.abs(Number(e.liquidityNet) / 1e18) > 100000)
          .reduce((arr, tick) => {
            const lastPriceGroup = arr[arr.length - 1]
            const lastPrice =
              lastPriceGroup?.[lastPriceGroup.length - 1]?.price1 ||
              Number.NEGATIVE_INFINITY

            if (tick.price1 - lastPrice > 200) arr.push([tick])
            else lastPriceGroup.push(tick)
            return arr
          }, [])
          .sort((tickGroupA, tickGroupB) => {
            const maxLiqA = tickGroupA.reduce(
              (sum, { liquidityNet }) =>
                sum + Math.abs(Number(liquidityNet) / 1e18),
              0
            )
            const maxLiqB = tickGroupB.reduce(
              (sum, { liquidityNet }) =>
                sum + Math.abs(Number(liquidityNet) / 1e18),
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
                sum + Math.abs(Number(liquidityNet) / 1e18),
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
      const data = this.ticks
      if (data) {
        this.liquidityGroup = []
        let i = startPrice
        const space = priceSpace
        for (i; i < endPrice; i += space) {
          const liquidity = data
            .filter(({ price1 }) => i + 1 < price1 && price1 < i + priceSpace)
            .reduce(
              (sum, { liquidityNet }) =>
                sum + Math.abs(Number(liquidityNet) / 1e18),
              0
            )

          this.liquidityGroup.push({
            range:
              i === startPrice
                ? `${i}-${i + priceSpace}`
                : `${i + 1}-${i + priceSpace}`,
            liquidity,
          })
        }
      }
    },
  },
}
</script>
