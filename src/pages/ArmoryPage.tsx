import { type ReactElement, useState, useEffect } from 'react'
import { Animator } from '@arwes/react-animator'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import OperationsSidePanel from '../components/OperationsSidePanel'

const ArmoryPage = (): ReactElement => {
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
      {/* Desktop side panel only */}
      {!isMobile && <OperationsSidePanel isMobile={isMobile} activeSection="armory" />}

      <div css={{
        minHeight: '100vh',
        padding: `${isMobile ? headerHeight + 20 : 200}px 1rem 2rem`,
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
          <Animator active={true}>
            <div
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
                Tactical tools and weapons for mission success. Deploy specialized equipment to dominate the digital battlefield.
              </p>

              <div css={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: 'FiraCode, monospace',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontStyle: 'italic'
              }}>
                Arsenal loading. Stand by for deployment orders.
              </div>
            </div>
          </Animator>
        </div>
      </div>
    </>
  )
}

export default ArmoryPage