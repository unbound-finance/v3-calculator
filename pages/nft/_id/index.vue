<template>
  <div class="container min-h-screen flex items-center justify-center">
    <div class="md:w-1/2 p-4 flex flex-col items-start justify-start">
      <div class="w-full">
        <span class="text-3xl font-mono">ETH/DAI</span>
        <div class="border-b border-gray-200"></div>
      </div>
      <div class="py-6 flex flex-col space-y-2">
        <span class="font-mono text-sm text-gray-800"
          >Fees: {{ nftDescription.fee ? nftDescription.fee / 1e4 : 0 }}%</span
        >
        <span class="font-mono text-sm text-gray-800"
          >Range:
          {{
            nftDescription.tickLower
              ? (1.0001 ** nftDescription.tickLower).toFixed(2)
              : 0
          }}
          -
          {{
            nftDescription.tickUpper
              ? (1.0001 ** nftDescription.tickUpper).toFixed(2)
              : 0
          }}</span
        >
        <span class="font-mono text-sm text-gray-800"
          >Liquidity:
          {{ nftDescription.liquidity ? nftDescription.liquidity : 0 }}</span
        >
      </div>
      <div>
        <div v-if="ui.burnLoader" class="flex space-x-2 items-center">
          <MagicLoader />
          <span class="text-sm text-red-500">{{ ui.message }}</span>
        </div>
        <button
          v-else
          class="appearance-none focus:outline-none px-6 py-2 bg-red-500 text-white text-sm rounded hover:bg-white hover:text-red-500 hover:border-red-500 hover:border transition-colors"
          @click="burn"
        >
          <span>Burn</span>
        </button>
      </div>
    </div>
    <div class="md:w-1/2 p-4 flex items-center justify-center">
      <NFTCard
        v-tilt="{
          scale: 1.1,
        }"
        :details="{ tokenId: $router.currentRoute.params.id }"
      />
    </div>
  </div>
</template>

<script>
import NFTPositionManager from '~/utils/NFTPositionManager'
import { formatBigNumber } from '~/utils'

export default {
  data() {
    return {
      nftDescription: {},
      ui: {
        loading: false,
        burnLoader: false,
        message: 'burning your token 🔥',
      },
    }
  },
  mounted() {
    this.nftDescriptor()
  },
  methods: {
    async nftDescriptor() {
      const nft = new NFTPositionManager()
      const tokenId = this.$router.currentRoute.params.id
      this.nftDescription = await nft.nftDescription({ tokenId })
    },

    async burn() {
      this.ui.burnLoader = true
      const nft = new NFTPositionManager()
      const tokenId = this.$router.currentRoute.params.id

      this.ui.message = 'fetching NFT status...'

      // fetch details for tokenID
      const { liquidity, tokensOwed0, tokensOwed1 } = await nft.nftDescription({
        tokenId,
      })

      this.ui.message = 'removing your liquidity'

      const runBurn = async (tokenId) => {
        this.ui.message = 'burning your token 🔥'
        await nft
          .burn({ tokenId })
          .then(({ wait }) =>
            wait(1).then(() => {
              this.ui.message = 'NFT burned!'
              this.$router.push('/nft')
            })
          )
          .catch((e) => {
            this.ui.burnLoader = false
            alert(e.message)
          })
      }

      if (
        !Number(formatBigNumber(liquidity)) &&
        !Number(formatBigNumber(tokensOwed0)) &&
        !Number(formatBigNumber(tokensOwed1))
      ) {
        await runBurn(tokenId)
      } else if (
        (Number(formatBigNumber(tokensOwed0)) ||
          Number(formatBigNumber(tokensOwed1))) &&
        !Number(formatBigNumber(liquidity))
      ) {
        this.ui.message = 'collecting fees 💸'
        await nft
          .collect({ tokenId })
          .then(({ wait }) => wait(1).then(() => runBurn(tokenId)))
      } else {
        // decrease liquidity
        await nft.decreaseLiquidity({ tokenId, liquidity }).then(({ wait }) =>
          wait(1).then(() => {
            this.ui.message = 'collecting fees 💸'
            return nft
              .collect({ tokenId })
              .then(({ wait }) => wait(1).then(() => runBurn(tokenId)))
          })
        )
      }

      this.ui.burnLoader = false
    },
  },
}
</script>
