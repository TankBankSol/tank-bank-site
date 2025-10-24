

import { type ReactElement, useRef, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Animator } from '@arwes/react-animator'
import { FrameOctagon } from '@arwes/react-frames'
import { useSolana } from '../hooks/useSolana'

const DisconnectModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }): ReactElement | null => {
  const confirmButtonRef = useRef<SVGSVGElement | null>(null)
  const cancelButtonRef = useRef<SVGSVGElement | null>(null)

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
      zIndex: 1000
    }}>
      <div css={{
        backgroundColor: 'rgba(45, 49, 47, 0.95)',
        border: '2px solid #BE501E',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '400px',
        boxShadow: '0 0 30px rgba(190, 80, 30, 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        <div css={{
          color: '#BE501E',
          fontFamily: 'FiraCode, monospace',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 css={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            DISCONNECT COMMANDER MODULE
          </h2>
          <p css={{
            fontSize: '0.9rem',
            lineHeight: 1.4,
            opacity: 0.9
          }}>
            Are you sure you want to disconnect your wallet from Tank Bank Command?
          </p>
        </div>

        <div css={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <Animator active={true}>
            <div
              css={{
                position: 'relative',
                width: 100,
                height: 50,
                cursor: 'pointer',

                '[data-name=bg]': {
                  color: 'hsla(36, 48%, 6%, 0.10)',
                  filter: 'drop-shadow(0 0 4px hsla(38, 61%, 8%, 0.09))'
                },
                '[data-name=line]': {
                  color: '#d32f2f',
                  filter: 'drop-shadow(0 0 2px #d32f2f)'
                },

                '&:hover [data-name=line]': {
                  color: '#b71c1c',
                  filter: 'drop-shadow(0 0 3px #b71c1c)'
                }
              }}
              onClick={onConfirm}
            >
              <FrameOctagon
                elementRef={confirmButtonRef}
                padding={3}
                strokeWidth={2}
              />
              <div css={{
                position: 'absolute',
                inset: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d32f2f',
                fontFamily: 'FiraCode, monospace',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                zIndex: 1,
                transition: 'color 0.3s ease',

                '&:hover': {
                  color: '#b71c1c'
                }
              }}>
                CONFIRM
              </div>
            </div>
          </Animator>

          <Animator active={true}>
            <div
              css={{
                position: 'relative',
                width: 100,
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
              onClick={onCancel}
            >
              <FrameOctagon
                elementRef={cancelButtonRef}
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
                fontSize: '0.7rem',
                fontWeight: 'bold',
                zIndex: 1,
                transition: 'color 0.3s ease',

                '&:hover': {
                  color: '#000000'
                }
              }}>
                CANCEL
              </div>
            </div>
          </Animator>
        </div>
      </div>
    </div>
  )
}

const WalletButton = (): ReactElement => {
  const { wallet, disconnect, connecting, connected, select, wallets } = useWallet()
  const { walletInfo, isLoading, networkStatus } = useSolana()
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)

  // Debug wallet state
  useEffect(() => {
    console.log('Wallet state:', { wallet: wallet?.adapter?.name, connecting, connected })
    console.log('Available wallets:', wallets.map(w => w.adapter.name))
    console.log('Is mobile:', window.innerWidth <= 768)
    console.log('User agent:', navigator.userAgent)
  }, [wallet, connecting, connected, wallets])

  const handleClick = async () => {
    if (connected) {
      setShowDisconnectModal(true)
    } else {
      console.log('Opening wallet modal...')
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
    if (isLoading && connected) return 'Loading...'
    if (connected && wallet) {
      if (walletInfo) {
        return `${walletInfo.balance.toFixed(3)} SOL`
      }
      return `${wallet.adapter.name} Connected`
    }
    return 'Connect Wallet'
  }

  const getNetworkIndicator = () => {
    if (!networkStatus) return null

    const isDevnet = networkStatus.network === 'devnet'
    const isUsingFallback = networkStatus.usingFallback

    return (
      <div css={{
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: isDevnet ? '#f39c12' : '#2ecc71',
        color: '#000',
        fontSize: '0.6rem',
        fontWeight: 'bold',
        padding: '2px 6px',
        borderRadius: '10px',
        border: '1px solid #fff',
        zIndex: 10,
        boxShadow: '0 0 4px rgba(0,0,0,0.5)'
      }}>
        {isDevnet ? 'DEV' : 'MAIN'}
        {isUsingFallback && ' (FB)'}
      </div>
    )
  }

  return (
    <div>
      <Animator active={true}>
        <div
          css={{
            position: 'relative',
            width: 180,
            height: 60,
            cursor: 'pointer',

            '[data-name=bg]': {
              color: 'hsla(36, 48%, 6%, 0.10)',
              filter: 'drop-shadow(0 0 4px hsla(38, 61%, 8%, 0.09))'
            },
            '[data-name=line]': {
              color: connected ? '#2ECC71' : '#BE501E',
              filter: connected
                ? 'drop-shadow(0 0 2px #2ECC71)'
                : 'drop-shadow(0 0 2px #BE501E)'
            },

            '&:hover [data-name=line]': {
              color: '#000000',
              filter: 'drop-shadow(0 0 3px #000000)'
            }
          }}
          onClick={handleClick}
        >
          <FrameOctagon
            elementRef={svgRef}
            padding={3}
            strokeWidth={2}
          />
          <div css={{
            position: 'absolute',
            inset: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: connected ? '#2ECC71' : '#BE501E',
            fontFamily: connected ? 'FiraCode, monospace' : 'Nemesys, monospace',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            zIndex: 1,
            textAlign: 'center',
            transition: 'color 0.3s ease',
            ':hover': {
              color: '#000000'
            }
          }}>
            {getButtonText()}
          </div>
          {getNetworkIndicator()}
        </div>
      </Animator>

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
          <div css={{
            background: 'linear-gradient(135deg, rgba(45, 49, 47, 0.95) 0%, rgba(30, 33, 31, 0.95) 100%)',
            border: '2px solid #BE501E',
            borderRadius: '12px',
            padding: '3rem',
            maxWidth: '500px',
            width: '100%',
            position: 'relative',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 30px rgba(190, 80, 30, 0.3)'
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
                      console.log(`Connecting to ${walletOption.adapter.name}...`)

                      // For mobile devices, especially Phantom
                      if (window.innerWidth <= 768 && walletOption.adapter.name === 'Phantom') {
                        console.log('Mobile Phantom connection attempt...')

                        // Try different mobile connection approaches
                        try {
                          // Method 1: Try direct wallet connection
                          console.log('Trying direct wallet connection...')
                          await walletOption.adapter.connect()
                          setShowCustomModal(false)
                          return
                        } catch (directError) {
                          console.log('Direct connection failed:', directError)

                          // Method 2: Try universal link
                          try {
                            const universalLink = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`
                            console.log('Trying universal link:', universalLink)
                            window.open(universalLink, '_blank')
                            setShowCustomModal(false)
                            return
                          } catch (universalError) {
                            console.log('Universal link failed, trying regular select:', universalError)
                          }
                        }
                      }

                      select(walletOption.adapter.name)
                      setShowCustomModal(false)
                    } catch (error) {
                      console.error('Connection error:', error)
                      alert(`Connection failed: ${error}`)
                    }
                  }}
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.2rem',
                    background: 'rgba(190, 80, 30, 0.1)',
                    border: '2px solid #BE501E',
                    borderRadius: '8px',
                    color: '#BE501E',
                    fontFamily: 'FiraCode, monospace',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: '#BE501E',
                      color: '#000',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(190, 80, 30, 0.4)'
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