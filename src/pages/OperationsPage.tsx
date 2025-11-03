

import { type ReactElement, useState, useEffect } from 'react'
// import { useWallet } from '@solana/wallet-adapter-react'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import OperationCard from '../components/OperationCard'
import OperationsSidePanel from '../components/OperationsSidePanel'
import ProfileCard from '../components/ProfileCard'

const OperationsPage = (): ReactElement => {
  const [isMobile, setIsMobile] = useState(false)
  const headerHeight = useHeaderHeight()
  // const { connected } = useWallet()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const operations = [
    { name: "Night Forge", url: "https://x.com/TankBankSol/status/1985154407114174768" },
    { name: "Black Phantom", url: "#" }
  ]

  return (
    <>
      {/* Desktop side panel only */}
      {!isMobile && <OperationsSidePanel isMobile={isMobile} activeSection="mission-center" />}

      {/* Desktop Profile Card - Below side panel */}
      {!isMobile && (
        <div css={{
          position: 'fixed',
          top: '525px', // More space below the side panel
          left: '2rem',
          width: '255px', // Match side panel width exactly
          zIndex: 50 // Lower than side panel
        }}>
          <ProfileCard isMobile={false} />
        </div>
      )}

      <div css={{
        minHeight: '100vh',
        padding: `${isMobile ? headerHeight + 0 : 200}px 1rem 2rem`,
        paddingLeft: isMobile ? '1rem' : '300px', // Make room for desktop side panel
        paddingRight: isMobile ? '1rem' : '165px', // Add right padding to center content better
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
          <OperationCard operations={operations} isMobile={isMobile} />
        </div>
      </div>
    </>
  )
}

export default OperationsPage