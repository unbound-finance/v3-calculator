<template>
  <div class="relative z-10 flex items-center">
    <template
      v-if="$walletProvider.address && String($walletProvider.chainId) === '42'"
    >
      <div
        class="text-[8pt] border text-white rounded-full bg-black absolute px-1 -top-2 -right-4"
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
      <span
        class="max-w-[98px] truncate"
        :class="$walletProvider.address ? 'ml-2' : ''"
        >{{ $walletProvider.address || 'connect' }}
      </span>
    </button>
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
  @apply bg-green-600;
  @apply text-white;
  @apply flex;
  @apply items-center;
  @apply text-sm;
  @apply px-4;
  @apply py-2;
  @apply transition-colors;

  &:focus,
  &:hover {
    @apply bg-green-800;
  }
}
</style>
