import { DAI, USDT, USDC } from './'
export default [
  {
    name: 'ETH-DAI',
    address: '0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8',
    decimals: 0, // 0 means 18
    tickLowerBound: -99480,
    tickUpperBound: -63480,
    get quoteToken() {
      return DAI
    },
  },
  {
    name: 'ETH-USDT',
    address: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
    decimals: 6,
    tickLowerBound: -212580,
    tickUpperBound: -176580,
    get quoteToken() {
      return USDT
    },
  },
  {
    name: 'ETH-USDC',
    address: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
    decimals: 6,
    tickLowerBound: 176520,
    tickUpperBound: 212520,
    get quoteToken() {
      return USDC
    },
  },
]
