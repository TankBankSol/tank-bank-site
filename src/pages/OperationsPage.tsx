

import { type ReactElement, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import OperationCard from '../components/OperationCard'
import OperationsSidePanel from '../components/OperationsSidePanel'
import ProfileCard from '../components/ProfileCard'
import { ProfileService } from '../services/profileService'

const OperationsPage = (): ReactElement => {
  const [isMobile, setIsMobile] = useState(false)
  const headerHeight = useHeaderHeight()
  const { connected, publicKey } = useWallet()
  const [hasProfile, setHasProfile] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const checkProfile = async () => {
      if (connected && publicKey) {
        setProfileLoading(true)
        try {
          const profile = await ProfileService.getProfile(publicKey.toString())
          setHasProfile(!!profile)
        } catch (error) {
          console.error('Error checking profile:', error)
          setHasProfile(false)
        } finally {
          setProfileLoading(false)
        }
      } else {
        setHasProfile(false)
        setProfileLoading(false)
      }
    }

    checkProfile()

    // Listen for profile updates
    const handleProfileUpdate = () => {
      checkProfile()
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate)
  }, [connected, publicKey])

  const operations = [
    { name: "Night Forge", url: "https://x.com/TankBankSol/status/1985154407114174768" },
    { name: "Black Phantom", url: "#" }
  ]

  return (
    <>
      {/* Desktop Profile Card - Above side panel */}
      {!isMobile && hasProfile && !profileLoading && (
        <div css={{
          position: 'fixed',
          top: '200px', // Same as sidepanel starting position
          left: '2rem',
          width: '255px', // Match side panel width exactly
          zIndex: 100 // Same as side panel
        }}>
          <ProfileCard isMobile={false} />
        </div>
      )}

      {/* Desktop side panel - Position based on profile presence */}
      {!isMobile && (
        <div css={{
          position: 'fixed',
          top: (hasProfile && !profileLoading) ? '470px' : '200px', // Move up if no profile
          left: '2rem',
          width: '235px',
          zIndex: 100
        }}>
          <OperationsSidePanel isMobile={isMobile} activeSection="mission-center" />
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