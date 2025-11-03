import { Connection, clusterApiUrl } from '@solana/web3.js'

// Environment configuration
const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY
const SOLANA_NETWORK = import.meta.env.VITE_SOLANA_NETWORK || 'mainnet-beta'

// Validate environment variables
if (!HELIUS_API_KEY) {
  throw new Error('VITE_HELIUS_API_KEY is required in environment variables')
}

// Helius RPC endpoint
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`

// Fallback to public RPC if Helius fails
const FALLBACK_RPC_URL = clusterApiUrl(SOLANA_NETWORK as 'devnet' | 'testnet' | 'mainnet-beta')

// Connection configuration with optimal settings
const CONNECTION_CONFIG = {
  commitment: 'confirmed' as const,
  httpHeaders: {
    'User-Agent': 'TankBank/1.0.0',
  },
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
      },
    })
  },
}

// Create primary connection
export const connection = new Connection(HELIUS_RPC_URL, CONNECTION_CONFIG)

// Create fallback connection
export const fallbackConnection = new Connection(FALLBACK_RPC_URL, CONNECTION_CONFIG)

// Connection with automatic fallback
export class RobustConnection {
  private primaryConnection: Connection
  private fallbackConnection: Connection
  private usingFallback: boolean = false

  constructor() {
    this.primaryConnection = connection
    this.fallbackConnection = fallbackConnection
  }

  async getConnection(): Promise<Connection> {
    if (this.usingFallback) {
      return this.fallbackConnection
    }

    try {
      // Test primary connection with a simple call
      await this.primaryConnection.getVersion()
      return this.primaryConnection
    } catch (error) {
      console.warn('Primary Helius RPC failed, switching to fallback:', error)
      this.usingFallback = true
      return this.fallbackConnection
    }
  }

  async resetToPrimary(): Promise<void> {
    try {
      await this.primaryConnection.getVersion()
      this.usingFallback = false
      // Successfully reconnected to primary Helius RPC
    } catch (error) {
      console.warn('Primary RPC still unavailable:', error)
    }
  }

  isUsingFallback(): boolean {
    return this.usingFallback
  }
}

// Singleton instance
export const robustConnection = new RobustConnection()

// Network information
export const NETWORK_CONFIG = {
  name: SOLANA_NETWORK,
  rpcUrl: HELIUS_RPC_URL,
  fallbackUrl: FALLBACK_RPC_URL,
  explorerUrl: SOLANA_NETWORK === 'mainnet-beta'
    ? 'https://solscan.io'
    : `https://solscan.io/?cluster=${SOLANA_NETWORK}`,
} as const

// Export types for TypeScript
export type NetworkName = typeof SOLANA_NETWORK
export type SolanaConnection = Connection