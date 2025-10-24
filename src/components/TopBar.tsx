

import { type ReactElement, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Animator } from '@arwes/react-animator'
import WalletButton from './WalletButton'
import ContractAddressFrame from './ContractAddressFrame'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

const MenuButton = ({ children, active = true, onClick }: { children: string; active?: boolean; onClick?: () => void }): ReactElement => {
  return (
    <Animator active={active}>
      <div
        css={{
          position: 'relative',
          width: 180,
          height: 60,
          lineHeight: '60px',
          textAlign: 'center',
          textDecoration: 'none',
          color: '#BE501E',
          margin: '0 15px',
          transition: '.5s',
          cursor: 'pointer',

          '@media (max-width: 768px)': {
            width: 120,
            height: 45,
            lineHeight: '45px',
            margin: '0 6px',
            fontSize: '0.85rem'
          },

          '@media (max-width: 480px)': {
            width: 100,
            height: 40,
            lineHeight: '40px',
            margin: '0 4px',
            fontSize: '0.8rem'
          },

          '& span': {
            position: 'absolute',
            transition: 'transform .5s',
          },

          '& span:nth-of-type(1), & span:nth-of-type(3)': {
            width: '100%',
            height: '2px',
            background: '#BE501E',
          },

          '& span:nth-of-type(1)': {
            top: 0,
            left: 0,
            transformOrigin: 'right',
          },

          '&:hover span:nth-of-type(1)': {
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform .5s',
          },

          '& span:nth-of-type(3)': {
            bottom: 0,
            left: 0,
            transformOrigin: 'left',
          },

          '&:hover span:nth-of-type(3)': {
            transform: 'scaleX(0)',
            transformOrigin: 'right',
            transition: 'transform .5s',
          },

          '& span:nth-of-type(2), & span:nth-of-type(4)': {
            width: '2px',
            height: '100%',
            background: '#BE501E',
          },

          '& span:nth-of-type(2)': {
            top: 0,
            left: 0,
            transform: 'scale(0)',
            transformOrigin: 'bottom',
          },

          '&:hover span:nth-of-type(2)': {
            transform: 'scale(1)',
            transformOrigin: 'top',
            transition: 'transform .5s',
          },

          '& span:nth-of-type(4)': {
            top: 0,
            right: 0,
            transform: 'scale(0)',
            transformOrigin: 'top',
          },

          '&:hover span:nth-of-type(4)': {
            transform: 'scale(1)',
            transformOrigin: 'bottom',
            transition: 'transform .5s',
          },

          '&:hover': {
            color: '#000000',
            '& span': {
              background: '#000000',
            },
          }
        }}
        onClick={onClick}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <div css={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Nemesys, monospace',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          zIndex: 1,

          '@media (max-width: 768px)': {
            fontSize: '0.75rem'
          },

          '@media (max-width: 480px)': {
            fontSize: '0.7rem'
          }
        }}>
          {children}
        </div>
      </div>
    </Animator>
  )
}


const TopBar = (): ReactElement => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <div css={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      pointerEvents: 'none',

      /* Desktop Layout */
      '@media (min-width: 769px)': {
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 2rem'
      },

      /* Mobile Layout - Vertical Stack */
      '@media (max-width: 768px)': {
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem',
        gap: '0.75rem'
      }
    }}>
      {/* Logo Section */}
      <div css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        pointerEvents: 'auto',

        '@media (max-width: 768px)': {
          alignItems: 'center',
          width: '100%',
          gap: '0.5rem'
        }
      }}>
        <img
          src="/Logo Outline ORANGE Long.png"
          alt="Tank Bank Logo"
          css={{
            width: '300px',
            height: 'auto',
            filter: 'drop-shadow(0 0 10px rgba(168, 84, 14, 0.3))',
            '@media (max-width: 768px)': {
              width: '100%',
              maxWidth: '350px'
            }
          }}
        />
        <div css={{
          '@media (max-width: 768px)': {
            display: 'none'
          }
        }}>
          <ContractAddressFrame />
        </div>
      </div>

      {/* Desktop Menu */}
      <div css={{
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        '@media (max-width: 768px)': {
          display: 'none'
        }
      }}>
        <MenuButton onClick={() => navigate('/')}>Command</MenuButton>
        <MenuButton onClick={() => navigate('/deployment')}>{isMobile ? 'OPS' : 'Operations'}</MenuButton>
        <MenuButton onClick={() => navigate('/comms')}>Comm</MenuButton>
      </div>

      {/* Desktop Wallet Button */}
      <div css={{
        pointerEvents: 'auto',
        '@media (max-width: 768px)': {
          display: 'none'
        }
      }}>
        <WalletButton />
      </div>

      {/* Mobile Menu Buttons */}
      <div css={{
        display: 'none',
        '@media (max-width: 768px)': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          pointerEvents: 'auto',
          flexWrap: 'wrap'
        },
        '@media (max-width: 480px)': {
          gap: '0.25rem'
        }
      }}>
        <MenuButton onClick={() => navigate('/')}>Command</MenuButton>
        <MenuButton onClick={() => navigate('/deployment')}>{isMobile ? 'OPS' : 'Operations'}</MenuButton>
        <MenuButton onClick={() => navigate('/comms')}>Comm</MenuButton>
      </div>

      {/* Mobile Wallet Button */}
      <div css={{
        display: 'none',
        '@media (max-width: 768px)': {
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          pointerEvents: 'auto',
          paddingTop: '1rem'
        }
      }}>
        <WalletButton />
      </div>
    </div>
  )
}

export default TopBar