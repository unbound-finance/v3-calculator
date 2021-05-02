<template>
  <div class="container py-5">
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center space-y-4 min-h-screen"
    >
      <MagicLoader :color="color" />
      <div class="text-gray-800 text-sm">Fetching your NFTs, please wait</div>
    </div>
    <div
      v-if="nftTokens && nftTokens.length > 0"
      class="w-full flex flex-wrap items-center justify-center -m-3"
    >
      <div v-for="nft in nftTokens" :key="nft.id" class="p-3">
        <nuxt-link :to="`/nft/${nft.tokenId}`">
          <NFTCard :details="nft" />
        </nuxt-link>
      </div>
    </div>
    <div
      v-else
      class="text-gray-800 flex flex-col items-center justify-center min-h-screen"
    >
      Currently, you don't own any NFT. Please mint it from here
      <nuxt-link to="/" class="py-2">
        <button
          class="appearance-none px-6 py-2 text-white bg-green-600 text-sm focus:outline-none rounded"
        >
          Mint NFT
        </button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import getUserNFTQuery from '~/apollo/queries/getUserNFT'

export default {
  apollo: {
    $loadingKey: 'loading',
    $client: 'uniswapV3Client',
    nftTokens: {
      prefetch: true,
      query: getUserNFTQuery,
      variables() {
        return { userAddress: this.$walletProvider.address }
      },
    },
  },
  data: () => ({
    loading: 0,
    color: '#059669',
  }),
}
</script>
