import { type ReactElement, useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface OperationsSidePanelProps {
  isMobile: boolean
  activeSection?: string
}

const OperationsSidePanel = ({ isMobile, activeSection = 'mission-center' }: OperationsSidePanelProps): ReactElement => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCollapsed(true)
      }
    }

    if (!isCollapsed && isMobile) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCollapsed, isMobile])


  const navigationLinks = [
    { id: 'mission-center', label: 'Mission Center', path: '/operations' },
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
    if (location.pathname === '/operations') return 'mission-center'
    if (location.pathname === '/armory') return 'armory'
    return activeSection
  }

  // Mobile collapsed toggle button
  if (isMobile && isCollapsed) {
    return (
        <button
          className="animate-hidden animate-tactical-fade"
          onClick={() => setIsCollapsed(false)}
          data-augmented-ui="tl-clip br-clip border"
          css={{
            width: 'calc(100vw - 35px)', // Match wallet button width
            maxWidth: '410px', // Match wallet button max width

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
    )
  }

  // Mobile expanded panel
  if (isMobile && !isCollapsed) {
    return (
      <>
        {/* Mobile Dropdown - positioned directly below operations button */}
        <div
            ref={dropdownRef}
            data-augmented-ui="tl-clip tr-clip border"
            css={{
              position: 'relative',
              width: 'calc(100vw - 46px)', // Match wallet button width calculation
              maxWidth: '380px', // Match wallet button max width
              margin: '0 auto', // Center the dropdown
              marginBottom: '1rem', // Space below dropdown

              '--aug-tl': '6px',
              '--aug-tr': '6px',
              '--aug-border-all': '2px',
              '--aug-border-bg': '#BE501E',

              background: 'rgba(0, 0, 0, 0.85)',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <nav css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {navigationLinks.map((link) => {
                const isActive = getCurrentActiveSection() === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.path)}
                    data-augmented-ui="tl-clip br-clip border"
                    css={{
                      '--aug-border-all': '1px',
                      '--aug-border-bg': isActive ? '#2ECC71' : '#BE501E',
                      '--aug-clip-size': '4px',

                      background: 'transparent',
                      color: isActive ? '#2ECC71' : '#BE501E',
                      fontFamily: 'FiraCode, monospace',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      padding: '0.8rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left',

                      '&:hover': {
                        '--aug-border-bg': '#000000',
                        color: '#000000',
                        background: 'rgba(190, 80, 30, 0.1)',
                        transform: 'translateX(5px)',
                        boxShadow: '0 2px 6px rgba(190, 80, 30, 0.3)'
                      }
                    }}
                  >
                    {link.label}
                  </button>
                )
              })}
            </nav>
          </div>
      </>
    )
  }

  // Desktop panel
  return (
    <div
      className="animate-hidden animate-tactical-slide"
        data-augmented-ui="tl-clip tr-clip b-clip-x border"
        css={{
          width: '235px',

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
                    transform: 'translateX(5px)',
                    boxShadow: '0 4px 8px rgba(190, 80, 30, 0.3)'
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
  )
}

export default OperationsSidePanel