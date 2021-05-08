import Vue from 'vue'
import { getPriceByTick } from '../utils/helpers/UniswapV3'
import ECR20Helper from '~/utils/ERC20'
import WalletProvider from '~/utils/WalletProvider'

Vue.filter('localeNumber', (v) => Number(v).toLocaleString('en-US'))
Vue.filter('tickPrice', ({ base, quote, tick }) =>
  getPriceByTick({ base, quote, tick })
)

export default function ({ store }, inject) {
  const walletProvider = new WalletProvider(store)
  const erc20Helper = new ECR20Helper(walletProvider)

  inject('walletProvider', walletProvider)
  inject('erc20Helper', erc20Helper)
}
