

import { type ReactElement, useState } from 'react'
import FrameContainer from '../components/FrameContainer'

const DeploymentPage = (): ReactElement => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const mainCategories = [
    {
      id: 'bot-services',
      title: 'Bot Services',
      description: 'Comprehensive automation solutions for trading, community management, and security monitoring on Solana',
      features: ['Trading Bots', 'Telegram Bots', 'Discord Bots', 'Security Bots', 'DCA Automation', 'Arbitrage', 'Community Management', 'Risk Assessment']
    },
    {
      id: 'token-services',
      title: 'Token Services',
      description: 'Complete token lifecycle management including creation, vesting, locking, and multi-signature security programs',
      features: ['Token Creation', 'Vesting Schedules', 'Liquidity Locking', 'Multi-sig Wallets', 'Supply Management', 'Governance Tools', 'Team Allocations', 'Security Protocols']
    }
  ]


  return (
    <div css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '140px 2rem 2rem',
      color: '#A8540E',
      fontFamily: 'FiraCode, monospace',
      '@media (max-width: 768px)': {
        paddingTop: '280px'
      },
      '& *': {
        animation: 'none !important',
        transition: 'none !important'
      }
    }}>
      {/* Invisible spacer to match comms page title spacing */}
      <div css={{
        height: '3rem',
        marginBottom: '3rem'
      }}></div>

      <div css={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        maxWidth: '1000px',
        width: '100%',
        justifyItems: 'center',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
          justifyItems: 'center',
          placeItems: 'center',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      }}>
        {mainCategories.map((category) => (
          <FrameContainer key={category.id} width={350} height={400}>
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
              textAlign: 'center',
              padding: '1rem',
              overflow: 'hidden',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <h3 css={{
                color: '#BE501E',
                marginBottom: '0.8rem',
                fontSize: '1.2rem',
                fontFamily: 'Nemesys, serif',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}>
                {category.title}
              </h3>
              <p css={{
                fontSize: '0.8rem',
                marginBottom: '1rem',
                opacity: 0.8,
                lineHeight: 1.3,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'FiraCode, monospace',
                wordBreak: 'break-word',
                hyphens: 'auto',
                textAlign: 'center',
                overflow: 'hidden'
              }}>
                {category.description}
              </p>

              <div css={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.3rem',
                marginBottom: '1rem',
                justifyContent: 'center',
                maxHeight: '80px',
                overflow: 'hidden',
                alignItems: 'flex-start'
              }}>
                {category.features.slice(0, 3).map((feature: string, index: number) => (
                  <span
                    key={index}
                    css={{
                      background: 'rgba(190, 80, 30, 0.2)',
                      color: '#BE501E',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '12px',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      border: '1px solid rgba(190, 80, 30, 0.3)',
                      fontFamily: 'FiraCode, monospace',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {feature}
                  </span>
                ))}
                {category.features.length > 3 && (
                  <span css={{
                    color: '#A8540E',
                    fontSize: '0.65rem',
                    fontFamily: 'FiraCode, monospace'
                  }}>
                    +{category.features.length - 3} more
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedCategory(category.id)}
                css={{
                  padding: '0.6rem 1.2rem',
                  background: '#BE501E',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#000',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'FiraCode, monospace',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    background: '#A8540E',
                    color: '#fff',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Deploy {category.title}
              </button>
            </div>
          </FrameContainer>
        ))}
      </div>

        {/* Selected Category Details */}
        {selectedCategory && (
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
              maxWidth: '600px',
              width: '100%',
              position: 'relative',
              backdropFilter: 'blur(10px)'
            }}>
              <button
                onClick={() => setSelectedCategory(null)}
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
                  '&:hover': {
                    color: '#ad2007ff'
                  }
                }}
              >
                ✕
              </button>

              <h3 css={{
                color: '#BE501E',
                fontSize: '2rem',
                fontFamily: 'Nemesys, serif',
                marginBottom: '1rem'
              }}>
                Deployment Details
              </h3>

              <p css={{
                color: '#A8540E',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                marginBottom: '2rem',
                fontFamily: 'FiraCode, monospace'
              }}>
                Configure and deploy your {selectedCategory} solution. Advanced settings and
                customization options will be available in the Tank Bank Command Center.
              </p>

              <div css={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <button css={{
                  background: '#BE501E',
                  color: '#000',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'FiraCode, monospace',
                  '&:hover': {
                    background: '#ad2007ff',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  Deploy Now
                </button>

                <button css={{
                  background: 'transparent',
                  color: '#BE501E',
                  border: '2px solid #BE501E',
                  padding: '1rem 2rem',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'FiraCode, monospace',
                  '&:hover': {
                    background: 'rgba(190, 80, 30, 0.1)'
                  }
                }}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default DeploymentPage