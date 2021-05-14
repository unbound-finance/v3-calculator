<template>
  <div class="relative z-10 flex items-center">
    <template
      v-if="$walletProvider.address && String($walletProvider.chainId) != '1'"
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
    <!-- Change Network Modal -->
    <Modal v-model="ui.showChgNetDialog" :persistent="true">
      <template>
        <div class="flex flex-col space-y-4 p-6">
          <div class="flex justify-between items-center">
            <p class="font-medium">Change Your Network</p>
          </div>

          <div>
            <p class="dark:text-gray-200 text-sm">
              We've detected that you need to switch your wallet's network from
              <span class="font-medium text-green-600">
                {{ networks[$walletProvider.chainId] }}
              </span>
              to
              <span class="font-medium text-green-600">Kovan testnet</span>
              network for this Dapp.
            </p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      networks: {
        1: 'Ethereum Mainnet',
        3: 'Ropsten Testnet',
        4: 'Rinkeby Testnet',
        5: 'Goerli Testnet',
        42: 'Kovan Testnet',
        56: 'BSC Mainnet',
        97: 'BSC Testnet',
      },
      ui: {
        showChgNetDialog: false,
      },
    }
  },
  computed: {
    chainId() {
      return this.$walletProvider.chainId
    },
  },
  watch: {
    chainId() {
      this.detectNetwork()
    },
  },
  mounted() {
    this.detectNetwork()
  },
  methods: {
    alert: (e) => window.alert(e),
    detectNetwork() {
      if (this.$walletProvider.chainId !== 42) {
        this.ui.showChgNetDialog = true
      } else {
        this.ui.showChgNetDialog = false
      }
    },
  },
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
