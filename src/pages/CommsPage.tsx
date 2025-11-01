
import { type ReactElement, useState, useEffect } from 'react'
import { Animator } from '@arwes/react-animator'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import CommunicationCard from '../components/CommunicationCard'

const CommsPage = (): ReactElement => {
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

  const features = [
    { name: "Official X", url: "https://x.com/TankBankSol" },
    { name: "X Community", url: "#" },
    { name: "Telegram", url: "#" },
    { name: "Discord", url: "#" }
  ]

  return (
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
          <CommunicationCard features={features} isMobile={isMobile} />
        </Animator>
      </div>
    </div>
  )
}

export default CommsPage