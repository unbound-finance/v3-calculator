<template>
  <div class="container">
    <div
      class="max-w-lg mx-auto flex flex-col items-center justify-center py-8"
    >
      <div class="flex flex-col space-y-6">
        <p class="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Faucet
        </p>

        <ul class="text-sm text-gray-600 list-disc px-4">
          <li>You would need Kovan ETH to get started.</li>
          <li>
            This faucet will give you our test ETH and DAI tokens on kovan
            testnet.
          </li>

          <!-- <li>
            These are ETH, DAI, . You can find token addresses
            <a
              href="https://www.notion.so/Unbound-Testnet-06c16fd6fcb4479da2cb3b03389b5c39"
              target="_blank"
              class="text-light-primary dark:text-dark-primary font-medium underline"
              >here</a
            >
          </li>
          <li>
            You can then go to Uniswap, provide liquidity to the pool and
            receive Liquidity Pool Tokens(LPT).
          </li>
          <li>
            Then visit the unbound dashboard, use Mint to collatralize this LPT.
          </li>
          <li>
            The Uniswap pools that we support on testent are
            <nuxt-link
              to="/analytics"
              class="text-light-primary dark:text-dark-primary font-medium underline"
              >here</nuxt-link
            >
          </li> -->
        </ul>

        <p class="font-medium italic text-xs text-gray-600">
          **Note: You can only request test tokens once every 24 hours for your
          address.
        </p>

        <div v-if="isWalletConnected" class="flex items-center space-x-2">
          <button
            type="button"
            class="w-full font-medium rounded-lg py-4 appearance-none focus:outline-none"
            :title="
              ui.showRequestEth == false ? 'You already have kovan ETH' : ''
            "
            :class="ui.showRequestEth ? getActiveClass : getDisabledClass"
            :disabled="ui.showRequestEth == false"
            @click="requestKeth"
          >
            <div
              v-if="ui.ethLoading"
              class="text-lg"
              :class="{ 'loading-dots': ui.loading }"
            ></div>
            <span v-else>Request KETH</span>
          </button>

          <button
            type="button"
            class="w-full font-medium bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg py-4 appearance-none focus:outline-none"
            @click="requestFaucet"
          >
            <div
              v-if="ui.loading"
              class="text-lg"
              :class="{ 'loading-dots': ui.loading }"
            ></div>
            <span v-else>Request Tokens</span>
          </button>
        </div>
      </div>
      <span v-if="ui.errorMsg" class="text-sm text-red-600 my-2">{{
        ui.errorMsg
      }}</span>
      <div v-if="ui.successMsg" class="text-sm text-green-600 my-2">
        <span>{{ ui.successMsg }}</span>
        <a
          :href="txLink"
          target="_blank"
          class="text-sm text-green-600 underline"
          >View Transaction</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { faucetAddress, FaucetABI } from '~/constants'

export default {
  data() {
    return {
      ui: {
        loading: false,
        ethLoading: false,
        showSuccess: false,
        errorMsg: null,
        successMsg: null,
        showRequestEth: true,
      },
      txLink: null,
    }
  },

  computed: {
    isWalletConnected() {
      return !!this.$walletProvider.address
    },
    getDisabledClass() {
      return 'bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-600 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-gradient-to-r from-light-primary to-dark-primary text-white'
    },
  },

  async mounted() {
    const ethBalance = await this.ethBalance()
    if (ethBalance) {
      this.ui.showRequestEth = false
    }
  },

  methods: {
    async ethBalance() {
      try {
        // Read ETH Balance
        const ethBalance = await this.$walletProvider.provider.getBalance(
          this.$walletProvider.address
        )
        const etherString = ethers.utils.formatEther(ethBalance)
        if (etherString > '0.0') return true
        return false
      } catch (error) {
        console.log(error)
      }
    },

    async requestKeth() {
      this.ui.errorMsg = null
      this.ui.successMsg = null
      this.ui.ethLoading = true

      try {
        const { data } = await this.$axios.post(
          'https://faucet.unbound.finance/api/release',
          {
            address: this.$walletProvider.address,
          }
        )
        this.ui.successMsg = `0.05 kovan ETH sent. Please wait for the transaction to get confirmed before requesting the pool tokens.`
        this.txLink = `https://kovan.etherscan.io/tx/${data.hash}`
        this.ui.ethLoading = false
        this.ui.showRequestEth = false
        // this.ui.showRequestEth = false
      } catch (error) {
        this.ui.errorMsg = 'You can request kovan ETH only once in 24 hours.'
        this.ui.ethLoading = false
        setTimeout(() => {
          this.ui.errorMsg = null
        }, 2500)
      }
    },

    async requestFaucet() {
      this.ui.errorMsg = null
      this.ui.successMsg = null
      this.ui.loading = true
      const faucet = await new ethers.Contract(
        faucetAddress,
        FaucetABI,
        this.$walletProvider.signer
      )

      try {
        if (this.$walletProvider.address) {
          const distribute = await faucet.releaseAll(
            this.$walletProvider.address
          )
          this.ui.loading = false
          this.txLink = distribute.hash
          this.ui.showSuccess = true
        }
      } catch (error) {
        // eslint-disable-next-line eqeqeq
        if (error.code == 4001) {
          this.ui.errorMsg = 'User denied transaction signature.'
        } else {
          this.ui.errorMsg = 'You can request only once every 24 hours.'
        }
        this.ui.loading = false
        setTimeout(() => {
          this.ui.errorMsg = null
        }, 2500)
      }
    },
  },
}
</script>
