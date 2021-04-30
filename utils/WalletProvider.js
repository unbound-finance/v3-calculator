import { Object } from 'core-js'
import { ethers } from 'ethers'
import { makeMutations } from './helpers'

function getLocalStorageItem(key) {
  const a = localStorage.getItem(`${window.location.hostname}.wallet.${key}`)
  return a === 'null' ? null : a
}
function removeLocalStorageItem(key) {
  return localStorage.removeItem(`${window.location.hostname}.wallet.${key}`)
}
function setLocalStorageItem(key, value) {
  return localStorage.setItem(
    `${window.location.hostname}.wallet.${key}`,
    value
  )
}
class WalletProvider {
  store = null
  onChainChangedListeners = []
  onAccountChangedListeners = []
  vuexStoreModule = {
    state: () => ({
      isConnected: getLocalStorageItem('isConnected') === 'true',
      address: getLocalStorageItem('address'),
      chainId: getLocalStorageItem('chainId'),
      balance: Number(getLocalStorageItem('balance') || 0),
    }),
    mutations: {
      ...makeMutations('isConnected', 'address', 'chainId', 'balance'),
    },
  }

  get walletState() {
    return this.store?.state.wallet
  }

  get provider() {
    return new ethers.providers.Web3Provider(this.ethereum)
  }

  get signer() {
    return this.provider?.getSigner()
  }

  constructor(store) {
    this.store = store
    store?.registerModule('wallet', this.vuexStoreModule)

    Object.entries(this.vuexStoreModule.state()).forEach(([key, value]) => {
      Object.defineProperty(this, key, {
        get() {
          return this.store?.state.wallet[key] || this[`_${key}`]
        },
        set(value) {
          this.store?.commit(key, value)
          this[`_${key}`] = value
          setLocalStorageItem(key, value)
        },
      })

      this[key] = value
    })

    this.ethereum = window.ethereum || window.web3
    if (!this.ethereum) return

    this.ethereum.autoRefreshOnNetworkChange = false
    this.ethereum.on('chainChanged', async (...args) => {
      this.chainId = await this.getChainId()
      this.onChainChangedListeners.forEach((func) => func(...args))
    })
    this.ethereum.on('accountsChanged', (...args) => {
      this.onChainChangedListeners.forEach((func) => func(...args))
      this.address = args[0][0]
    })

    if (localStorage.getItem('disconnected') !== 'true') {
      this.isConnected = this.isEthereumConnected

      if (this.isConnected) {
        this.getChainId()
          .then((chainId) => (this.chainId = chainId))
          .catch((e) => console.warn(e))

        this.getAddress()
          .then((address) => {
            this.address = address
          })
          .catch((e) => console.warn(e))
      }
    }
    // else if (!connector.connected) {
    //   // create new session
    //   connector.createSession()
    // }
  }

  watch(hash) {
    return new Promise((resolve) => this.provider.once(hash, resolve))
  }

  addOnChainChanged(func) {
    if (typeof func === 'function') return

    this.onChainChangedListeners.push(func)
  }

  removeOnChainChanged(funcToRemove) {
    if (typeof func !== 'function') return

    this.onChainChangedListeners = this.onChainChangedListeners.filter(
      (func) => funcToRemove === func
    )
  }

  addOnAccountChanged(func) {
    if (typeof func === 'function') return

    this.onAccountChangedListeners.push(func)
  }

  removeOnAccountChanged(funcToRemove) {
    if (typeof func !== 'function') return

    this.onAccountChangedListeners = this.onChainChangedListeners.filter(
      (func) => funcToRemove === func
    )
  }

  async getChainId() {
    const { chainId } = await this.provider.getNetwork()
    return chainId
  }

  // getNetworkType() {
  //   const web3 = new Web3(this.ethereum)
  //   return web3.eth.net.getNetworkType()
  // }

  get isEthereumConnected() {
    return this.ethereum.isConnected()
  }

  getAddress() {
    return this.signer?.getAddress()
  }

  async connect() {
    if (window.ethereum) {
      await this.ethereum.enable()
      localStorage.removeItem('disconnected')

      this.chainId = await this.getChainId()

      if (String(this.chainId) !== '42') {
        this.disconnect()
        throw new Error('Network not supported, please switch to Kovan Network')
      }

      this.address = await this.getAddress()
      this.isConnected = true
    } else {
      throw new Error('Browser not supported')
    }
  }

  disconnect() {
    this.isConnected = false

    Object.entries(this.vuexStoreModule.state()).forEach(([key]) =>
      removeLocalStorageItem(key)
    )
    Object.entries(this.vuexStoreModule.state()).forEach(
      ([key, value]) => (this[key] = value)
    )

    localStorage.setItem('disconnected', true)
  }
}

export default WalletProvider
