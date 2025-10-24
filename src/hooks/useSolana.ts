import { useState, useEffect, useCallback } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { solanaService, SolanaService } from '../services/solana'
import type { WalletInfo, TransactionInfo } from '../services/solana'

interface UseSolanaReturn {
  // Wallet state
  walletInfo: WalletInfo | null
  isLoading: boolean
  error: string | null

  // Network state
  networkStatus: any
  isConnected: boolean

  // Recent transactions
  recentTransactions: TransactionInfo[]
  loadingTransactions: boolean

  // Actions
  refreshBalance: () => Promise<void>
  refreshTransactions: () => Promise<void>
  refreshNetworkStatus: () => Promise<void>
  sendSOL: (toAddress: string, amount: number) => Promise<string>

  // Utilities
  formatSOL: (lamports: number) => string
  isValidAddress: (address: string) => boolean
  getExplorerUrl: (signature: string, type?: 'tx' | 'account') => string
}

export const useSolana = (): UseSolanaReturn => {
  const { publicKey, connected, sendTransaction } = useWallet()
  const { connection } = useConnection()

  // State
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [networkStatus, setNetworkStatus] = useState<any>(null)
  const [recentTransactions, setRecentTransactions] = useState<TransactionInfo[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)

  // Refresh wallet balance
  const refreshBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setWalletInfo(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const balance = await solanaService.getSOLBalance(publicKey)

      setWalletInfo({
        publicKey,
        balance,
        connected: true
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance'
      setError(errorMessage)
      console.error('Error fetching wallet balance:', err)
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, connected])

  // Refresh recent transactions
  const refreshTransactions = useCallback(async () => {
    if (!publicKey || !connected) {
      setRecentTransactions([])
      return
    }

    setLoadingTransactions(true)

    try {
      const transactions = await solanaService.getRecentTransactions(publicKey, 10)
      setRecentTransactions(transactions as TransactionInfo[])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      // Don't set error for transactions as it's not critical
    } finally {
      setLoadingTransactions(false)
    }
  }, [publicKey, connected])

  // Refresh network status
  const refreshNetworkStatus = useCallback(async () => {
    try {
      const status = await solanaService.getNetworkStatus()
      setNetworkStatus(status)
    } catch (err) {
      console.error('Error fetching network status:', err)
    }
  }, [])

  // Send SOL transaction
  const sendSOL = useCallback(async (toAddress: string, amount: number): Promise<string> => {
    if (!publicKey || !connected || !sendTransaction) {
      throw new Error('Wallet not connected')
    }

    if (!SolanaService.isValidPublicKey(toAddress)) {
      throw new Error('Invalid recipient address')
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    try {
      const toPubkey = new PublicKey(toAddress)
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL)

      const transaction = await solanaService.createTransferTransaction(
        publicKey,
        toPubkey,
        lamports
      )

      const signature = await sendTransaction(transaction, connection)

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed')

      // Refresh wallet info after successful transaction
      await refreshBalance()
      await refreshTransactions()

      return signature
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
      throw new Error(errorMessage)
    }
  }, [publicKey, connected, sendTransaction, connection, refreshBalance, refreshTransactions])

  // Auto-refresh data when wallet connects/disconnects
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalance()
      refreshTransactions()
    } else {
      setWalletInfo(null)
      setRecentTransactions([])
      setError(null)
    }
  }, [connected, publicKey, refreshBalance, refreshTransactions])

  // Load network status on mount
  useEffect(() => {
    refreshNetworkStatus()
  }, [refreshNetworkStatus])

  // Utility functions
  const formatSOL = useCallback((lamports: number) => {
    return SolanaService.formatSOL(lamports)
  }, [])

  const isValidAddress = useCallback((address: string) => {
    return SolanaService.isValidPublicKey(address)
  }, [])

  const getExplorerUrl = useCallback((signature: string, type: 'tx' | 'account' = 'tx') => {
    return SolanaService.getExplorerUrl(signature, type)
  }, [])

  return {
    // State
    walletInfo,
    isLoading,
    error,
    networkStatus,
    isConnected: connected,
    recentTransactions,
    loadingTransactions,

    // Actions
    refreshBalance,
    refreshTransactions,
    refreshNetworkStatus,
    sendSOL,

    // Utilities
    formatSOL,
    isValidAddress,
    getExplorerUrl,
  }
}