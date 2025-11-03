import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js'
import { robustConnection, NETWORK_CONFIG } from '../config/solana'

export class SolanaService {
  private connection: Connection | null = null

  async getConnection(): Promise<Connection> {
    if (!this.connection) {
      this.connection = await robustConnection.getConnection()
    }
    return this.connection
  }

  /**
   * Get SOL balance for a wallet address
   */
  async getSOLBalance(publicKey: PublicKey): Promise<number> {
    try {
      const connection = await this.getConnection()
      const balance = await connection.getBalance(publicKey)
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      console.error('Error fetching SOL balance:', error)
      throw new Error('Failed to fetch SOL balance')
    }
  }

  /**
   * Get account info for a public key
   */
  async getAccountInfo(publicKey: PublicKey) {
    try {
      const connection = await this.getConnection()
      return await connection.getAccountInfo(publicKey)
    } catch (error) {
      console.error('Error fetching account info:', error)
      throw new Error('Failed to fetch account info')
    }
  }

  /**
   * Get recent transactions for a wallet
   */
  async getRecentTransactions(publicKey: PublicKey, limit = 10) {
    try {
      const connection = await this.getConnection()
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit })

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getTransaction(sig.signature, {
              commitment: 'confirmed',
              maxSupportedTransactionVersion: 0
            })
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              confirmationStatus: sig.confirmationStatus,
              transaction: tx
            }
          } catch (error) {
            console.warn(`Failed to fetch transaction ${sig.signature}:`, error)
            return null
          }
        })
      )

      return transactions.filter(tx => tx !== null)
    } catch (error) {
      console.error('Error fetching recent transactions:', error)
      throw new Error('Failed to fetch recent transactions')
    }
  }

  /**
   * Create a simple SOL transfer transaction
   */
  async createTransferTransaction(
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    lamports: number
  ): Promise<Transaction> {
    try {
      const connection = await this.getConnection()
      const { blockhash } = await connection.getLatestBlockhash()

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: fromPubkey,
      })

      transaction.add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      )

      return transaction
    } catch (error) {
      console.error('Error creating transfer transaction:', error)
      throw new Error('Failed to create transfer transaction')
    }
  }

  /**
   * Send and confirm a transaction
   */
  async sendAndConfirmTransaction(
    transaction: Transaction,
    signers: any[] = []
  ): Promise<string> {
    try {
      const connection = await this.getConnection()

      // Send transaction
      const signature = await connection.sendTransaction(transaction, signers, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      })

      // Transaction sent successfully

      // Confirm transaction
      const confirmation = await connection.confirmTransaction({
        signature,
        ...(await connection.getLatestBlockhash()),
      })

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`)
      }

      // Transaction confirmed successfully
      return signature
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw new Error('Failed to send transaction')
    }
  }

  /**
   * Get network status and connection health
   */
  async getNetworkStatus() {
    try {
      const connection = await this.getConnection()
      const [version, slot, blockTime] = await Promise.all([
        connection.getVersion(),
        connection.getSlot(),
        connection.getBlockTime(await connection.getSlot())
      ])

      return {
        network: NETWORK_CONFIG.name,
        rpcUrl: NETWORK_CONFIG.rpcUrl,
        usingFallback: robustConnection.isUsingFallback(),
        version,
        currentSlot: slot,
        blockTime,
        explorerUrl: NETWORK_CONFIG.explorerUrl
      }
    } catch (error) {
      console.error('Error getting network status:', error)
      throw new Error('Failed to get network status')
    }
  }

  /**
   * Validate if a string is a valid Solana public key
   */
  static isValidPublicKey(address: string): boolean {
    try {
      new PublicKey(address)
      return true
    } catch {
      return false
    }
  }

  /**
   * Format SOL amount for display
   */
  static formatSOL(lamports: number, decimals = 4): string {
    const sol = lamports / LAMPORTS_PER_SOL
    return sol.toFixed(decimals)
  }

  /**
   * Convert SOL to lamports
   */
  static solToLamports(sol: number): number {
    return Math.floor(sol * LAMPORTS_PER_SOL)
  }

  /**
   * Get explorer URL for transaction or account
   */
  static getExplorerUrl(signature: string, type: 'tx' | 'account' = 'tx'): string {
    const baseUrl = NETWORK_CONFIG.explorerUrl
    const cluster = NETWORK_CONFIG.name !== 'mainnet-beta' ? `?cluster=${NETWORK_CONFIG.name}` : ''

    if (type === 'tx') {
      return `${baseUrl}/tx/${signature}${cluster}`
    } else {
      return `${baseUrl}/account/${signature}${cluster}`
    }
  }
}

// Singleton instance
export const solanaService = new SolanaService()

// Export types
export interface WalletInfo {
  publicKey: PublicKey
  balance: number
  connected: boolean
}

export interface TransactionInfo {
  signature: string
  slot: number
  blockTime: number | null
  confirmationStatus: string | undefined
  transaction: any
}