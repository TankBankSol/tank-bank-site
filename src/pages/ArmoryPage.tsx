import { type ReactElement, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import OperationsSidePanel from '../components/OperationsSidePanel'
import ProfileCard from '../components/ProfileCard'
import { ProfileService } from '../services/profileService'

const ArmoryPage = (): ReactElement => {
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
          <OperationsSidePanel isMobile={isMobile} activeSection="armory" />
        </div>
      )}

      <div css={{
        minHeight: '100vh',
        padding: `${isMobile ? headerHeight + 20 : 200}px 1rem 2rem`,
        paddingLeft: isMobile ? '1rem' : '205px', // Make room for desktop side panel
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
                Armory
              </h2>

              <p css={{
                color: 'rgba(190, 80, 30, 0.9)',
                fontFamily: 'FiraCode, monospace',
                fontSize: isMobile ? '0.9rem' : '1rem',
                lineHeight: 1.6,
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                Enginneers are hard at work building and testing gaming SDK for customized payment options.
              </p>

              <div css={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: 'FiraCode, monospace',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontStyle: 'italic'
              }}>
                More Details Soon.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ArmoryPage