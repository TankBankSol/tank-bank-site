

import { type ReactElement, useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
// import { useSolana } from '../hooks/useSolana'

const DisconnectModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }): ReactElement | null => {

  if (!isOpen) return null

  return (
    <div css={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div
        data-augmented-ui="tl-clip tr-clip b-clip-x border"
        css={{
          '--aug-tr': '25px',
          '--aug-b-extend1': '50%',
          '--aug-border-all': '7px',
          '--aug-border-bg': '#BE501E',

          background: 'black !important',
          backgroundColor: 'black !important',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          position: 'relative'
        }}>
        <button
          onClick={onCancel}
          css={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#BE501E',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#ad2007ff',
              transform: 'scale(1.1)'
            }
          }}
        >
          ✕
        </button>

        <h3 css={{
          color: '#BE501E',
          fontFamily: 'Nemesys, serif',
          fontSize: '2rem',
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Disconnect Commander Module
        </h3>

        <p css={{
          color: 'rgba(190, 80, 30, 0.9)',
          fontFamily: 'FiraCode, monospace',
          fontSize: '1rem',
          lineHeight: 1.6,
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Are you sure you want to disconnect your wallet from Tank Bank Command?
        </p>

        <div css={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={onConfirm}
            data-augmented-ui="tl-clip br-clip border"
            css={{
              '--aug-border-all': '2px',
              '--aug-border-bg': '#d32f2f',
              '--aug-clip-size': '8px',

              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.2rem',
              background: 'transparent',
              color: '#d32f2f',
              fontFamily: 'FiraCode, monospace',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                '--aug-border-bg': '#b71c1c',
                background: 'rgba(211, 47, 47, 0.1)',
                color: '#b71c1c',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <span css={{
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              CONFIRM DISCONNECT
            </span>
          </button>

          <button
            onClick={onCancel}
            data-augmented-ui="tl-clip br-clip border"
            css={{
              '--aug-border-all': '2px',
              '--aug-border-bg': '#BE501E',
              '--aug-clip-size': '8px',

              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.2rem',
              background: 'transparent',
              color: '#BE501E',
              fontFamily: 'FiraCode, monospace',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                '--aug-border-bg': '#000000',
                background: 'rgba(190, 80, 30, 0.1)',
                color: '#000',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <span css={{
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              CANCEL
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

const WalletButton = (): ReactElement => {
  const { wallet, disconnect, connecting, connected, select, wallets, publicKey } = useWallet()
  const { connection } = useConnection()
  // const { networkStatus } = useSolana()
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [buttonWidth, setButtonWidth] = useState(170)
  const [solBalance, setSolBalance] = useState<number>(0)
  const [tankBalance, setTankBalance] = useState<number>(0)

  // Calculate responsive button width
  useEffect(() => {
    const calculateButtonWidth = () => {
      const screenWidth = window.innerWidth
      const isMobile = screenWidth <= 768

      if (isMobile) {
        // Mobile: use almost full width with padding
        const padding = 46 // 23px padding on each side
        const calculatedWidth = screenWidth - padding
        setButtonWidth(Math.min(calculatedWidth, 380)) // Cap at 380px
      } else {
        // Desktop: fixed width
        setButtonWidth(170)
      }
    }

    calculateButtonWidth()
    window.addEventListener('resize', calculateButtonWidth)
    window.addEventListener('orientationchange', calculateButtonWidth)

    return () => {
      window.removeEventListener('resize', calculateButtonWidth)
      window.removeEventListener('orientationchange', calculateButtonWidth)
    }
  }, [])

  // Fetch wallet balances
  useEffect(() => {
    if (connected && publicKey) {
      // Fetch SOL balance
      connection.getBalance(publicKey).then((balance: number) => {
        const solAmount = balance / LAMPORTS_PER_SOL
        setSolBalance(solAmount)
      }).catch((error) => {
        console.error('❌ SOL Balance fetch error:', error)
      })

      // Fetch TANK token balance
      const fetchTankBalance = async () => {
        try {
          const tankMintAddress = new PublicKey('5Z1urJyhqPNnrJA63M8bTUmL2ghXxNGgnB7n7FRpump')

          // Get token accounts by owner
          const tokenAccounts = await connection.getTokenAccountsByOwner(
            publicKey,
            {
              mint: tankMintAddress,
            }
          )

          if (tokenAccounts.value.length > 0) {
            // Get account info for the first token account
            const accountInfo = await connection.getAccountInfo(tokenAccounts.value[0].pubkey)
            if (accountInfo) {
              // Parse token account data to get balance
              const accountData = accountInfo.data
              // Token account data structure: first 64 bytes are layout, amount is at bytes 64-72
              const amount = accountData.readBigUInt64LE(64)
              // TANK has 6 decimals
              const tankAmount = Number(amount) / Math.pow(10, 6)
              setTankBalance(tankAmount)
            }
          } else {
            setTankBalance(0)
          }
        } catch (error) {
          console.error('❌ TANK Balance fetch error:', error)
          setTankBalance(0)
        }
      }

      fetchTankBalance()
    } else {
      setSolBalance(0)
      setTankBalance(0)
    }
  }, [connected, publicKey, connection])

  const formatBalance = (balance: number): string => {
    return balance.toFixed(4)
  }

  const handleClick = async () => {
    if (connected) {
      setShowDisconnectModal(true)
    } else {
      // Always use our custom modal
      setShowCustomModal(true)
    }
  }

  const handleConfirmDisconnect = () => {
    disconnect()
    setShowDisconnectModal(false)
  }

  const handleCancelDisconnect = () => {
    setShowDisconnectModal(false)
  }

  const getButtonText = () => {
    if (connecting) return 'Connecting...'
    if (connected && wallet) {
      return (
        <div css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <div css={{ fontSize: '0.7rem', opacity: 0.8 }}>
            {wallet.adapter.name}
          </div>
          <div css={{
            display: 'flex',
            gap: '0.8rem',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            <span>SOL: {formatBalance(solBalance)}</span>
            <span>TANK: {formatBalance(tankBalance)}</span>
          </div>
        </div>
      )
    }
    return 'Connect Wallet'
  }

  // const getNetworkIndicator = () => {
  //   if (!networkStatus) return null

  //   const isDevnet = networkStatus.network === 'devnet'
  //   const isUsingFallback = networkStatus.usingFallback

  //   return (
  //     <div css={{
  //       position: 'absolute',
  //       top: -8,
  //       right: -8,
  //       backgroundColor: isDevnet ? '#f39c12' : '#2ecc71',
  //       color: '#000',
  //       fontSize: '0.6rem',
  //       fontWeight: 'bold',
  //       padding: '2px 6px',
  //       borderRadius: '10px',
  //       border: '1px solid #fff',
  //       zIndex: 10,
  //       boxShadow: '0 0 4px rgba(0,0,0,0.5)'
  //     }}>
  //       {isDevnet ? 'DEV' : 'MAIN'}
  //       {isUsingFallback && ' (FB)'}
  //     </div>
  //   )
  // }

  return (
    <div>
        <div
          data-augmented-ui="br-clip bl-clip border"
          css={{
            position: 'relative',
            width: buttonWidth,
            height: connected ? 80 : 60,
            cursor: 'pointer',
            background: 'rgba(0, 0, 0, 0.65)',

            '--aug-border-all': '2px',
            '--aug-border-bg': connected ? '#2ECC71' : '#BE501E',
            '--aug-clip-size': '8px',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: connected ? '#2ECC71' : '#BE501E',
            fontFamily: connected ? 'FiraCode, monospace' : 'Nemesys, monospace',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textAlign: 'center',
            transition: 'all 0.3s ease',

            '&:hover': {
              '--aug-border-bg': '#000000',
              color: '#000000',
              background: 'rgba(190, 80, 30, 0.1)'
            },

            '@media (max-width: 768px)': {
              fontSize: '0.7rem',
              height: connected ? 70 : 50,
              padding: '0.5rem 1rem'
            }
          }}
          onClick={handleClick}
        >
          {getButtonText()}
        </div>

      <DisconnectModal
        isOpen={showDisconnectModal}
        onConfirm={handleConfirmDisconnect}
        onCancel={handleCancelDisconnect}
      />

      {/* Custom Wallet Modal */}
      {showCustomModal && (
        <div css={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div
            data-augmented-ui="tl-clip tr-clip b-clip-x border"
            css={{
              '--aug-tr': '25px',
              '--aug-b-extend1': '50%',
              '--aug-border-all': '7px',
              '--aug-border-bg': '#BE501E',

              background: 'black !important',
              backgroundColor: 'black !important',
              padding: '3rem',
              maxWidth: '500px',
              width: '100%',
              position: 'relative'
            }}>
            <button
              onClick={() => setShowCustomModal(false)}
              css={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#BE501E',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#ad2007ff',
                  transform: 'scale(1.1)'
                }
              }}
            >
              ✕
            </button>

            <h3 css={{
              color: '#BE501E',
              fontFamily: 'Nemesys, serif',
              fontSize: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              Connect Tank Wallet
            </h3>

            <div css={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {wallets.map((walletOption) => (
                <button
                  key={walletOption.adapter.name}
                  onClick={async () => {
                    try {
                      select(walletOption.adapter.name)
                      setShowCustomModal(false)
                    } catch (error) {
                      console.error('Connection error:', error)
                      alert(`Connection failed: ${error}`)
                    }
                  }}
                  data-augmented-ui="tl-clip br-clip border"
                  css={{
                    '--aug-border-all': '2px',
                    '--aug-border-bg': '#BE501E',
                    '--aug-clip-size': '8px',

                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.2rem',
                    background: 'transparent',
                    color: '#BE501E',
                    fontFamily: 'FiraCode, monospace',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      '--aug-border-bg': '#000000',
                      background: 'rgba(190, 80, 30, 0.1)',
                      color: '#000',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <img
                    src={walletOption.adapter.icon}
                    alt={walletOption.adapter.name}
                    css={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px'
                    }}
                  />
                  <span css={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}>
                    {walletOption.adapter.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletButton