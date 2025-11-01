import { type ReactElement, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Animator } from '@arwes/react-animator'
import { useHeaderHeight } from '../hooks/useHeaderHeight'

interface OperationsSidePanelProps {
  isMobile: boolean
  activeSection?: string
}

const OperationsSidePanel = ({ isMobile, activeSection = 'mission-center' }: OperationsSidePanelProps): ReactElement => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const headerHeight = useHeaderHeight()

  const navigationLinks = [
    { id: 'mission-center', label: 'Mission Center', path: '/deployment' },
    { id: 'armory', label: 'Armory', path: '/armory' }
  ]

  const handleLinkClick = (path: string) => {
    // Close mobile panel after selection
    if (isMobile) {
      setIsCollapsed(true)
    }
    // Navigate to the page
    navigate(path)
  }

  // Determine active section based on current route
  const getCurrentActiveSection = () => {
    if (location.pathname === '/deployment') return 'mission-center'
    if (location.pathname === '/armory') return 'armory'
    return activeSection
  }

  // Mobile collapsed toggle button
  if (isMobile && isCollapsed) {
    return (
      <Animator active={true}>
        <button
          onClick={() => setIsCollapsed(false)}
          data-augmented-ui="tl-clip br-clip border"
          css={{
            position: 'absolute',
            top: `${headerHeight - 35}px`, // Move up to avoid overlapping
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 6.5rem)',
            zIndex: 100,

            '--aug-border-all': '2px',
            '--aug-border-bg': '#BE501E',
            '--aug-clip-size': '6px',

            background: 'rgba(0, 0, 0, 0.65)',
            color: '#BE501E',
            fontFamily: 'FiraCode, monospace',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            padding: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',

            '&:hover': {
              '--aug-border-bg': '#000000',
              color: '#000000',
              background: 'rgba(190, 80, 30, 0.1)'
            }
          }}
        >
          ≡ OPERATIONS
        </button>
      </Animator>
    )
  }

  // Mobile expanded panel
  if (isMobile && !isCollapsed) {
    return (
      <>
        {/* Mobile Panel - No backdrop, positioned under topbar */}
        <Animator active={true}>
          <div
            data-augmented-ui="b-clip-x border"
            css={{
              position: 'fixed',
              top: `${headerHeight}px`, // Under the topbar
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 4rem)', // Reduced width with more margins
              maxWidth: '400px', // Maximum width for better mobile fit
              zIndex: 100, // Higher than topbar (10) but reasonable

              '--aug-b-extend1': '50%',
              '--aug-border-all': '2px',
              '--aug-border-bg': '#BE501E',

              background: 'rgba(0, 0, 0, 0.95)',
              padding: '2rem 1.5rem',
              backdropFilter: 'blur(10px)',
              borderBottom: '2px solid #BE501E',
              // Ensure it creates its own stacking context
              isolation: 'isolate'
            }}
          >
            <div css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 css={{
                color: '#BE501E',
                fontFamily: 'Nemesys, serif',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Operations Menu
              </h3>

              <button
                onClick={() => setIsCollapsed(true)}
                css={{
                  background: 'transparent',
                  border: 'none',
                  color: '#BE501E',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#000000',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                ✕
              </button>
            </div>

            <nav css={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navigationLinks.map((link) => {
                const isActive = getCurrentActiveSection() === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.path)}
                    data-augmented-ui="tl-clip br-clip border"
                    css={{
                      '--aug-border-all': '2px',
                      '--aug-border-bg': isActive ? '#2ECC71' : '#BE501E',
                      '--aug-clip-size': '6px',

                      background: 'transparent',
                      color: isActive ? '#2ECC71' : '#BE501E',
                      fontFamily: 'FiraCode, monospace',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      padding: '1rem 1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',

                      '&:hover': {
                        '--aug-border-bg': '#000000',
                        color: '#000000',
                        background: 'rgba(190, 80, 30, 0.1)'
                      }
                    }}
                  >
                    {link.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </Animator>
      </>
    )
  }

  // Desktop panel
  return (
    <Animator active={true}>
      <div
        data-augmented-ui="tl-clip tr-clip b-clip-x border"
        css={{
          position: 'fixed',
          top: '200px',
          left: '2rem',
          width: '235px',
          zIndex: 100,

          '--aug-tr': '20px',
          '--aug-tl': '8px',
          '--aug-b-extend1': '40%',
          '--aug-border-all': '3px',
          '--aug-border-bg': '#BE501E',

          background: 'rgba(0, 0, 0, 0.65)',
          padding: '2rem'
        }}
      >
        <nav css={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {navigationLinks.map((link) => {
            const isActive = getCurrentActiveSection() === link.id
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.path)}
                data-augmented-ui="tl-clip br-clip border"
                css={{
                  '--aug-border-all': '2px',
                  '--aug-border-bg': isActive ? '#2ECC71' : '#BE501E',
                  '--aug-clip-size': '8px',

                  background: 'transparent',
                  color: isActive ? '#2ECC71' : '#BE501E',
                  fontFamily: 'FiraCode, monospace',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  padding: '1.2rem 1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',

                  '&:hover': {
                    '--aug-border-bg': '#000000',
                    color: '#000000',
                    background: 'rgba(190, 80, 30, 0.1)',
                    transform: 'translateX(5px)'
                  }
                }}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        <div css={{
          marginTop: '2rem',
          padding: '1rem 0',
          borderTop: '1px solid rgba(190, 80, 30, 0.3)',
          fontSize: '0.8rem',
          color: 'rgba(190, 80, 30, 0.7)',
          fontFamily: 'FiraCode, monospace',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Tank Bank Interface
        </div>
      </div>
    </Animator>
  )
}

export default OperationsSidePanel