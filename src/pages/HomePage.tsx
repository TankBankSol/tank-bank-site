

import { type ReactElement, useState, useEffect } from 'react'
import TankContentBox from '../components/TankContentBox'
import ProfilePrompt from '../components/ProfilePrompt'
import ProfileCard from '../components/ProfileCard'

const HomePage = (): ReactElement => {
  const [isMobile, setIsMobile] = useState(false)

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
          top: '200px', // Align with content start
          left: '2rem',
          width: '255px', // Match operations/armory width
          zIndex: 50
        }}>
          <ProfileCard isMobile={false} />
        </div>
      )}

      <div>
        <TankContentBox />
        <ProfilePrompt isMobile={isMobile} />
      </div>
    </>
  )
}

export default HomePage