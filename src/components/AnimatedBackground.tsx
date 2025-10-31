import { type ReactElement, useEffect, useRef } from 'react'

// Declare global VANTA
declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

interface AnimatedBackgroundProps {
  backgroundColor?: string
}

const AnimatedBackground = ({
  backgroundColor = '#191A19'
}: AnimatedBackgroundProps): ReactElement => {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    const getVantaSettings = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isPortrait = window.innerHeight > window.innerWidth

      if (isMobile) {
        return {
          minHeight: window.innerHeight,
          minWidth: window.innerWidth,
          scale: isPortrait ? 0.7 : 0.5,
          scaleMobile: isPortrait ? 0.7 : 0.5,
          size: isPortrait ? 1.5 : 1.0,
          spacing: isPortrait ? 25 : 35
        }
      } else {
        // Desktop settings - keep original values
        return {
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          size: 2.00
        }
      }
    }

    const initVanta = () => {
      if (!vantaEffect.current && vantaRef.current && window.VANTA && window.THREE) {
        const settings = getVantaSettings()
        vantaEffect.current = window.VANTA.DOTS({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          ...settings,
          showLines: false,
          backgroundColor: backgroundColor,
          color: 0xff6600
        })
      } else if (!window.VANTA || !window.THREE) {
        setTimeout(initVanta, 100)
      }
    }

    const updateVantaSettings = () => {
      if (vantaEffect.current) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        if (isMobile) {
          // Only update settings on mobile for orientation changes
          const settings = getVantaSettings()
          vantaEffect.current.setOptions(settings)
        }

        // Always resize to fit container
        vantaEffect.current.resize()
      }
    }

    const handleResize = () => {
      // Update settings for new orientation
      updateVantaSettings()
      // Additional delayed resize for mobile orientation changes
      setTimeout(() => {
        updateVantaSettings()
      }, 500)
    }

    initVanta()

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
      }
    }
  }, [backgroundColor])

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1
      }}
    />
  )
}

export default AnimatedBackground