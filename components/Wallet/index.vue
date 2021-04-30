<template>
  <div class="relative z-10 flex items-center">
    <template
      v-if="
        $walletProvider.isConnected && String($walletProvider.chainId) === '1'
      "
    >
      <div
        class="text-[8pt] border text-gray-800 rounded-full bg-border px-2 py-1 absolute -top-4 -right-4"
      >
        TestNet
      </div>
    </template>
    <button
      class="connect-button"
      @click="$walletProvider.connect().catch((e) => alert(e.message))"
    >
      <Identicon
        v-if="$walletProvider.address"
        :address="$walletProvider.address"
        class="h-6 w-6"
      />
      <span class="ml-2 max-w-[98px] truncate"
        >{{ $walletProvider.address || 'connect' }}
      </span>
    </button>

    <!-- <WalletModel ref="walletModel" /> -->
    <!-- <ProfileMenu v-if="menu" v-model="menu"> </ProfileMenu> -->
  </div>
</template>

<script>
export default {
  methods: { alert: (e) => window.alert(e) },
}
</script>

<style lang="scss">
.connect-button {
  @apply rounded;
  @apply outline-none;
  @apply border-none;
  @apply bg-opacity-10;
  @apply flex;
  @apply items-center;
  @apply text-sm;
  @apply px-3;
  @apply py-2;
  @apply transition-colors;

  &:focus,
  &:hover {
    @apply bg-opacity-5;
  }
}
</style>
