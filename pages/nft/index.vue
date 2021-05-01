<template>
  <div class="container py-5">
    <div class="w-full flex flex-wrap items-center justify-center -m-3">
      <div v-for="nft in nftTokens" :key="nft.id" class="p-3">
        <NFTCard :details="nft" />
      </div>
    </div>
  </div>
</template>

<script>
import getUserNFTQuery from '~/apollo/queries/getUserNFT'

export default {
  apollo: {
    $client: 'uniswapV3Client',
    nftTokens: {
      prefetch: true,
      query: getUserNFTQuery,
      variables() {
        return { userAddress: this.$walletProvider.address }
      },
    },
  },
}
</script>
