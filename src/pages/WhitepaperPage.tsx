import { type ReactElement, useState, useEffect } from 'react'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import ProfileCard from '../components/ProfileCard'

const WhitepaperPage = (): ReactElement => {
  const [isMobile, setIsMobile] = useState(false)
  const headerHeight = useHeaderHeight()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Desktop Profile Card - Left side */}
      {!isMobile && (
        <div css={{
          position: 'fixed',
          top: '200px',
          left: '2rem',
          width: '255px',
          zIndex: 50
        }}>
          <ProfileCard isMobile={false} />
        </div>
      )}

      <div css={{
        minHeight: '100vh',
        padding: `${isMobile ? headerHeight + 20 : 200}px 1rem 2rem`,
        paddingLeft: isMobile ? '1rem' : '175px',
        paddingRight: isMobile ? '1rem' : '165px',
        color: '#BE501E',
        fontFamily: 'FiraCode, monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>

        <div css={{
          maxWidth: '800px',
          width: '100%'
        }}>
          <div
            className="animate-hidden animate-border-grow"
            data-augmented-ui="tl-clip tr-clip b-clip-x border"
            css={{
              '--aug-tr': '20px',
              '--aug-tl': '8px',
              '--aug-b-extend1': '40%',
              '--aug-border-all': '3px',
              '--aug-border-bg': '#BE501E',

              background: 'rgba(0, 0, 0, 0.65)',
              padding: '3rem',
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >
            <div className="animate-hidden animate-content-delayed">
              <h2 css={{
                color: '#BE501E',
                fontFamily: 'Nemesys, serif',
                fontSize: isMobile ? '1.4rem' : '2.2rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                textAlign: 'center',
                textShadow: '0 0 15px rgba(190, 80, 30, 0.5)',
                '@media (max-width: 480px)': {
                  fontSize: '1.2rem'
                }
              }}>
                Tank Bank Whitepaper
              </h2>

              <p css={{
                color: 'rgba(190, 80, 30, 0.9)',
                fontFamily: 'FiraCode, monospace',
                fontSize: isMobile ? '0.9rem' : '1rem',
                lineHeight: 1.6,
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                Technical documentation outlining Tank Bank's decentralized gaming infrastructure,
                x402 SDK framework, and $TANKS token ecosystem.
              </p>
            </div>
          </div>

          {/* Whitepaper Content */}
          <div
            className="animate-hidden animate-border-grow"
            data-augmented-ui="tl-clip tr-clip b-clip-x border"
            css={{
              '--aug-tr': '20px',
              '--aug-tl': '8px',
              '--aug-b-extend1': '40%',
              '--aug-border-all': '3px',
              '--aug-border-bg': '#BE501E',

              background: 'rgba(0, 0, 0, 0.65)',
              padding: '2rem',
              marginBottom: '2rem'
            }}
          >
            <div className="animate-hidden animate-content-delayed" css={{
              color: 'rgba(190, 80, 30, 0.9)',
              fontFamily: 'FiraCode, monospace',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              lineHeight: 1.6,
              textAlign: 'left',
              maxHeight: '70vh',
              overflowY: 'auto',
              paddingRight: '1rem',

              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.3)'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(190, 80, 30, 0.6)',
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(190, 80, 30, 0.8)'
              },

              '& h2': {
                color: '#BE501E',
                fontFamily: 'Nemesys, serif',
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                fontWeight: 'bold',
                marginTop: '2.5rem',
                marginBottom: '1rem',
                textShadow: '0 0 15px rgba(190, 80, 30, 0.4)',
                borderBottom: '1px solid rgba(190, 80, 30, 0.3)',
                paddingBottom: '0.5rem',
                '&:first-of-type': {
                  marginTop: 0
                }
              },

              '& h3': {
                color: '#BE501E',
                fontFamily: 'FiraCode, monospace',
                fontSize: isMobile ? '1.0rem' : '1.1rem',
                fontWeight: 'bold',
                marginTop: '2rem',
                marginBottom: '1rem',
                textShadow: '0 0 10px rgba(190, 80, 30, 0.3)',
                '&:first-of-type': {
                  marginTop: 0
                }
              },

              '& p': {
                marginBottom: '1rem',
                textAlign: 'justify'
              },

              '& ul': {
                paddingLeft: '1.5rem',
                marginBottom: '1rem'
              },

              '& li': {
                marginBottom: '0.5rem'
              }
            }}>
              <h2>Abstract</h2>
              <p>
                TANK BANK is a decentralized gaming infrastructure designed to empower developers and players alike. Built on the Solana network, TANK BANK introduces a modular SDK framework, x402 comprising a Facilitator, Server, and Client system that bridges Web3 technology with modern gaming environments.
              </p>
              <p>
                At the core of the ecosystem is the $TANKS token, serving as both the governance and access mechanism. Developers stake $TANKS to utilize the SDK, while players interact with integrated games that benefit from instant Solana-based settlements, asset tracking, and cross-game interoperability.
              </p>

              <h2>1. Introduction</h2>
              <p>
                The gaming industry has evolved toward decentralized economies, but only a few systems effectively merge fast, low-cost blockchain infrastructure with developer accessibility.
              </p>
              <p>
                TANK BANK addresses this gap by providing an SDK that allows games to integrate crypto-based assets, governance, and player economies with minimal friction.
              </p>
              <p>Our mission is to:</p>
              <ul>
                <li>Equip developers with easy-to-use SDK tools for on-chain integration.</li>
                <li>Empower players to earn, trade, and own in-game assets.</li>
                <li>Foster a cross-game economy governed by the $TANKS community.</li>
              </ul>

              <h2>2. The x402 SDK Architecture</h2>
              <p>
                The x402 SDK is a three-layer system engineered for scalability, modularity, and real-time synchronization across games.
              </p>

              <h3>2.1 Facilitator</h3>
              <p>The Facilitator is the communication backbone between the client and the blockchain.</p>
              <p>It manages:</p>
              <ul>
                <li>RPC connections to Solana nodes</li>
                <li>Token transactions and verifications</li>
                <li>Session authentication</li>
                <li>Developer and player identity management</li>
              </ul>

              <h3>2.2 Server</h3>
              <p>The Server layer powers:</p>
              <ul>
                <li>Matchmaking logic</li>
                <li>Game-state persistence</li>
                <li>Leaderboards and achievements</li>
                <li>Asset validation and event tracking</li>
              </ul>
              <p>
                The Server integrates seamlessly with the Facilitator, ensuring that every on-chain and off-chain event remains synchronized and verifiable.
              </p>

              <h3>2.3 Client</h3>
              <p>The Client SDK provides developers with lightweight APIs for:</p>
              <ul>
                <li>Player wallet connections</li>
                <li>Token-gated access</li>
                <li>Reward distribution</li>
                <li>NFT and item integrations</li>
              </ul>
              <p>
                Initially optimized for web-based games, the SDK will evolve toward Unity, Unreal Engine, and mobile SDKs, enabling full cross-platform support.
              </p>

              <h2>3. $TANKS Token</h2>

              <h3>3.1 Overview</h3>
              <p>
                $TANKS is the native governance and utility token of the TANK BANK ecosystem. It underpins all platform activity, from staking and governance to developer access.
              </p>

              <h3>3.2 Token Utility</h3>
              <ul>
                <li><strong>Governance:</strong> $TANKS holders can vote on SDK updates, ecosystem grants, and platform direction.</li>
                <li><strong>Developer Access:</strong> Developers must lock a set amount of $TANKS to deploy and maintain games on the network.</li>
                <li><strong>Ecosystem Incentives:</strong> Games that contribute to player engagement and network volume receive $TANKS rewards.</li>
                <li><strong>Liquidity & Fees:</strong> Transaction and access fees within the SDK will be partially redistributed to stakers and liquidity providers.</li>
              </ul>

              <h3>3.3 Tokenomics</h3>
              <p>(Exact numbers to be defined, placeholder structure below)</p>
              <ul>
                <li><strong>Total Supply:</strong> 100,000,000 $TANKS</li>
                <li><strong>Marketing & Rewards:</strong> 40%</li>
                <li><strong>Development & Operations:</strong> 25%</li>
                <li><strong>Liquidity & Exchange:</strong> 20%</li>
                <li><strong>Team & Advisors:</strong> 15%</li>
              </ul>

              <h2>4. Governance System</h2>
              <p>TANK BANK operates under a DAO model, where $TANKS holders propose and vote on:</p>
              <ul>
                <li>Treasury allocations</li>
                <li>Partnership integrations</li>
                <li>Staking and reward adjustments</li>
              </ul>
              <p>
                Governance votes will be executed on-chain using Solana smart contracts to ensure transparency and immutability.
              </p>

              <h2>5. Game Developer Integration</h2>
              <p>
                Developers can integrate x402 into their games through simple APIs and SDK libraries.
              </p>
              <p>Upon locking $TANKS, they gain:</p>
              <ul>
                <li>SDK Access Keys</li>
                <li>Developer Dashboard (monitor metrics, performance, and usage)</li>
                <li>Access to cross-game player economy</li>
                <li>Optional liquidity pools for in-game tokens</li>
              </ul>
              <p>
                A developer's stake determines their access tier and network benefits, aligning long-term participation with ecosystem growth.
              </p>

              <h2>6. Roadmap</h2>

              <h3>Phase 1 – Foundation (Q4 2025)</h3>
              <ul>
                <li>Deploy TANK BANK core smart contracts on Solana</li>
                <li>Launch $TANKS token</li>
                <li>Release x402 (Facilitator & Client SDK Beta)</li>
                <li>First web game integrations</li>
              </ul>

              <h3>Phase 2 – Expansion (Q1 2026)</h3>
              <ul>
                <li>SDK Server integration and API Dashboard</li>
                <li>Governance portal launch</li>
                <li>Game Dev incentive program</li>
              </ul>

              <h3>Phase 3 – Ecosystem Growth (Mid–2026)</h3>
              <ul>
                <li>SDK support for Unity and Unreal Engine</li>
                <li>On-chain tournaments and leaderboards</li>
                <li>DAO treasury activation</li>
              </ul>

              <h3>Phase 4 – Full Deployment (2027)</h3>
              <ul>
                <li>Multi-chain bridge (Ethereum, Base)</li>
                <li>In-game lending and staking markets</li>
                <li>SDK 2.0 (AI-assisted development tools)</li>
              </ul>

              <h2>7. Security and Transparency</h2>
              <p>TANK BANK is built on Solana for its high throughput and low fees, with emphasis on:</p>
              <ul>
                <li>Secure smart contracts audited by third-party firms</li>
                <li>Transparent governance records</li>
                <li>Open-source SDK components</li>
              </ul>

              <h2>8. Conclusion</h2>
              <p>
                TANK BANK redefines how developers and players interact with decentralized ecosystems. Through the $TANKS token and x402 SDK, we provide a scalable, interoperable framework that transforms Web3 gaming into a cohesive, player-owned economy.
              </p>
              <p>
                Join the mission to build the future of decentralized gaming — one tank at a time.
              </p>

              <h2>9. Links</h2>
              <ul>
                <li><strong>Website:</strong> tankbank.app</li>
                <li><strong>Network:</strong> Solana</li>
                <li><strong>Token:</strong> $TANKS</li>
                <li><strong>SDK Repository:</strong> Coming Soon</li>
              </ul>

              <div css={{
                marginTop: '2rem',
                padding: '1rem',
                border: '1px solid rgba(190, 80, 30, 0.3)',
                borderRadius: '8px',
                textAlign: 'center',
                background: 'rgba(190, 80, 30, 0.1)'
              }}>
                <p css={{
                  margin: 0,
                  fontStyle: 'italic',
                  fontSize: '0.8rem'
                }}>
                  This document represents Tank Bank's current strategic vision and technical roadmap.
                  All information is subject to change as development progresses and market conditions evolve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WhitepaperPage