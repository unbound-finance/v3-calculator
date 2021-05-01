<template>
  <div class="w-[290px] h-[400px] bg-mesh-pattern bg-cover p-3 rounded-lg">
    <div
      class="rounded-lg border-[0.5px] border-gray-400 p-4 flex flex-col justify-between font-mono text-white h-full"
    >
      <div class="flex items-center justify-between">
        <span class="text-xl">ETH/DAI</span>
        <div class="">#{{ details.tokenId }}</div>
      </div>
      <div class="flex justify-between items-end">
        <div class="flex flex-col space-y-2">
          <div class="flex space-x-2">
            <div
              class="bg-white bg-opacity-75 rounded text-gray-800 font-mono text-xs px-2"
            >
              Fees
            </div>
            <div
              v-if="ui.loading"
              class="text-sm"
              :class="{ 'loading-dots': ui.loading }"
            ></div>
            <span v-else class="text-xs"
              >{{ nftDescription.fee ? nftDescription.fee / 1e4 : 0 }}%</span
            >
          </div>
          <div class="flex space-x-2">
            <div
              class="bg-white bg-opacity-75 rounded text-gray-800 font-mono text-xs px-2"
            >
              Min
            </div>
            <div
              v-if="ui.loading"
              class="text-sm"
              :class="{ 'loading-dots': ui.loading }"
            ></div>
            <span v-else class="text-xs">{{
              nftDescription.tickLower
                ? (1.0001 ** nftDescription.tickLower).toFixed(2)
                : 0
            }}</span>
          </div>
          <div class="flex space-x-2">
            <div
              class="bg-white bg-opacity-75 rounded text-gray-800 font-mono text-xs px-2"
            >
              Max
            </div>
            <div
              v-if="ui.loading"
              class="text-sm"
              :class="{ 'loading-dots': ui.loading }"
            ></div>
            <span v-else class="text-xs">{{
              nftDescription.tickUpper
                ? (1.0001 ** nftDescription.tickUpper).toFixed(2)
                : 0
            }}</span>
          </div>
        </div>
        <img src="~/assets/unbound.svg" alt="unbound" width="24" />
      </div>
    </div>
  </div>
</template>

<script>
import NFTPositionManager from '~/utils/NFTPositionManager'
export default {
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nftDescription: {},
      ui: {
        loading: false,
      },
    }
  },
  mounted() {
    this.nftDescriptor()
  },
  methods: {
    async nftDescriptor() {
      this.ui.loading = true
      const nft = new NFTPositionManager()
      const tokenId = this.details.tokenId
      this.nftDescription = await nft.nftDescription({ tokenId })
      this.ui.loading = false
    },
  },
}
</script>
