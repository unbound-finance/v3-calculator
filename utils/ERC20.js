import { ethers } from 'ethers'
import { ERC20ABI } from '@/constants'
import { formatBigNumber } from './'

class ECR20Helper {
  constructor(walletProvider) {
    this.walletProvider = walletProvider
  }

  approve(token, contract) {
    const pool = new ethers.Contract(
      token,
      ERC20ABI,
      this.walletProvider.signer
    )
    const approveToken = ethers.utils.parseEther('1000000')
    return new Promise((resolve, reject) => {
      pool.approve(contract, approveToken).catch(reject)
      pool.on('Approval', (...args) => resolve(...args))
    })
  }

  async canInteract(token, contract) {
    return (await this.getAllowance(token, contract)) >= 100000
  }

  async getAllowance(token, contract) {
    const userAddress = this.walletProvider.address

    const pool = new ethers.Contract(
      token,
      ERC20ABI,
      this.walletProvider.signer
    )
    const allowance = await pool.allowance(userAddress, contract)
    const formattedAllowance = formatBigNumber(allowance)
    return Number(formattedAllowance)
  }
}

export default ECR20Helper
