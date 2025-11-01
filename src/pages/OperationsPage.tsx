

import { type ReactElement, useState, useEffect } from 'react'
// import { useWallet } from '@solana/wallet-adapter-react'
import { Animator } from '@arwes/react-animator'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import OperationCard from '../components/OperationCard'

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
    { name: "Night Forge", url: "#" },
    { name: "Black Phantom", url: "#" }
  ]

  return (
    <div css={{
      minHeight: '100vh',
      padding: `${isMobile ? headerHeight + 20 : 200}px 1rem 2rem`,
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
          <OperationCard operations={operations} isMobile={isMobile} />
        </Animator>
      </div>
    </div>
  )
}

export default OperationsPage