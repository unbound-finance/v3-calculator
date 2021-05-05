<template>
  <div class="py-4 border-b-2">
    <div class="flex items-center justify-center flex-1 mx-auto max-w-6xl">
      <div class="w-full flex items-center justify-between px-4">
        <nuxt-link to="/">
          <div class="flex items-center space-x-2">
            <img src="~/assets/unbound.svg" alt="unbound" width="24" />
            <span>Unbound</span>
          </div>
        </nuxt-link>
        <div class="flex items-center space-x-4">
          <!-- <nuxt-link to="/faucet" class="text-sm">Faucet</nuxt-link> -->
          <nuxt-link to="/nft" class="text-sm"> My NFTs </nuxt-link>
          <Wallet />
        </div>
      </div>
    </div>
  </div>
</template>
