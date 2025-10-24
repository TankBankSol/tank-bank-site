

import { type ReactElement, useRef, useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Animator } from '@arwes/react-animator'
import { FrameOctagon } from '@arwes/react-frames'

const WalletSidePanel = (): ReactElement => {
  const { connected, publicKey } = useWallet()
  const { connection } = useConnection()
  const [solBalance, setSolBalance] = useState<number>(0)
  const [tankBalance, setTankBalance] = useState<number>(0)
  const [hasAccount] = useState<boolean>(false) // For now, simulate no account
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const enlistButtonRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (connected && publicKey) {
      // Fetch SOL balance
      connection.getBalance(publicKey).then(balance => {
        setSolBalance(balance / LAMPORTS_PER_SOL)
      })

      // TODO: Fetch TANK token balance when token mint is available
      // For now, set to 0
      setTankBalance(0)
    } else {
      setSolBalance(0)
      setTankBalance(0)
    }
  }, [connected, publicKey, connection])

  const formatBalance = (balance: number): string => {
    return balance.toFixed(4)
  }

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div css={{
      position: 'fixed',
      left: '2rem',
      top: '150px',
      zIndex: 5,
      display: connected ? 'block' : 'none',
      '@media (max-width: 768px)': {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '400px',
        zIndex: 15
      }
    }}>
      <Animator active={connected}>
        <div css={{
          position: 'relative',
          width: 300,
          height: 400,
          backgroundColor: 'rgba(45, 49, 47, 0.9)',
          border: '2px solid #BE501E',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(190, 80, 30, 0.3)',
          backdropFilter: 'blur(10px)',
          '@media (max-width: 768px)': {
            width: '100%',
            height: 'auto',
            minHeight: '300px',
            maxHeight: '70vh',
            overflowY: 'auto',
            backgroundColor: 'rgba(45, 49, 47, 0.85)',
            backdropFilter: 'blur(15px)'
          }
        }}>

          <div css={{
            position: 'absolute',
            inset: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            color: '#BE501E',
            fontFamily: 'FiraCode, monospace'
          }}>
            <div css={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem',
              fontFamily: 'Nemesys, serif'
            }}>
              Wallet Info
            </div>

            {publicKey && (
              <div css={{
                fontSize: '0.8rem',
                textAlign: 'center',
                marginBottom: '1rem',
                wordBreak: 'break-all'
              }}>
                {truncateAddress(publicKey.toString())}
              </div>
            )}

            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <div css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem',
                backgroundColor: 'rgba(190, 80, 30, 0.1)',
                borderRadius: '4px'
              }}>
                <span css={{ fontSize: '0.9rem' }}>SOL:</span>
                <span css={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {formatBalance(solBalance)}
                </span>
              </div>

              <div css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem',
                backgroundColor: 'rgba(190, 80, 30, 0.1)',
                borderRadius: '4px'
              }}>
                <span css={{ fontSize: '0.9rem' }}>TANK:</span>
                <span css={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {formatBalance(tankBalance)}
                </span>
              </div>
            </div>

            {!hasAccount && (
              <div css={{
                marginTop: '2rem',
                display: 'flex',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Animator active={connected}>
                  <div
                    css={{
                      position: 'relative',
                      width: 120,
                      height: 50,
                      cursor: 'pointer',

                      '[data-name=bg]': {
                        color: 'hsla(36, 48%, 6%, 0.10)',
                        filter: 'drop-shadow(0 0 4px hsla(38, 61%, 8%, 0.09))'
                      },
                      '[data-name=line]': {
                        color: '#BE501E',
                        filter: 'drop-shadow(0 0 2px #BE501E)'
                      },

                      '&:hover [data-name=line]': {
                        color: '#000000',
                        filter: 'drop-shadow(0 0 3px #000000)'
                      }
                    }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <FrameOctagon
                      elementRef={enlistButtonRef}
                      padding={3}
                      strokeWidth={2}
                    />
                    <div css={{
                      position: 'absolute',
                      inset: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#BE501E',
                      fontFamily: 'FiraCode, monospace',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      zIndex: 1,
                      transition: 'color 0.3s ease',

                      '&:hover': {
                        color: '#000000'
                      }
                    }}>
                      ENLIST
                    </div>
                  </div>
                </Animator>

                {showTooltip && (
                  <div css={{
                    position: 'absolute',
                    bottom: '60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(45, 49, 47, 0.95)',
                    border: '2px solid #BE501E',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    color: '#BE501E',
                    fontFamily: 'FiraCode, monospace',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    lineHeight: 1.4,
                    maxWidth: '220px',
                    boxShadow: '0 0 15px rgba(190, 80, 30, 0.4)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 100,
                    whiteSpace: 'pre-line'
                  }}>
                    Enlisting creates an account to start services.{'\n\n'}.05 SOL deposit required to create account.{'\n\n'}.05 SOL will be returned when account is closed.
                  </div>
                )}
              </div>
            )}

            <div css={{
              marginTop: '1rem',
              fontSize: '0.8rem',
              textAlign: 'center',
              opacity: 0.8
            }}>
              Connected to Tank Bank
            </div>
          </div>
        </div>
      </Animator>
    </div>
  )
}

export default WalletSidePanel