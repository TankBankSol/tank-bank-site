import { type ReactElement, useState, useEffect } from 'react'

interface LoadingPageProps {
  isLoading: boolean
  onComplete?: () => void
}

const LoadingPage = ({ isLoading, onComplete }: LoadingPageProps): ReactElement | null => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('INITIALIZING TANK BANK SYSTEMS')

  useEffect(() => {
    if (!isLoading) return

    const loadingMessages = [
      'INITIALIZING TANK BANK SYSTEMS',
      'ESTABLISHING SECURE CONNECTION',
      'LOADING TACTICAL INTERFACE',
      'SYNCHRONIZING OPERATIONS DATA',
      'PREPARING COMBAT READINESS',
      'SYSTEM READY FOR DEPLOYMENT'
    ]

    let messageIndex = 0
    let progressValue = 0

    const interval = setInterval(() => {
      progressValue += Math.random() * 15 + 5 // Random increment between 5-20

      if (progressValue >= 100) {
        progressValue = 100
        setProgress(100)
        setLoadingText('SYSTEM READY FOR DEPLOYMENT')

        setTimeout(() => {
          onComplete?.()
        }, 500)

        clearInterval(interval)
        return
      }

      setProgress(progressValue)

      // Change message every ~20% progress
      const newMessageIndex = Math.floor(progressValue / 20)
      if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
        messageIndex = newMessageIndex
        setLoadingText(loadingMessages[messageIndex])
      }
    }, 150)

    return () => clearInterval(interval)
  }, [isLoading, onComplete])

  if (!isLoading) return null

  return (
    <div css={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#191A19',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'FiraCode, monospace'
    }}>
      {/* Tank Bank Logo */}
        <div css={{
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h1 css={{
            color: '#BE501E',
            fontFamily: 'Nemesys, serif',
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(190, 80, 30, 0.5)',
            '@media (max-width: 768px)': {
              fontSize: '2rem'
            }
          }}>
            TANK BANK
          </h1>
          <div css={{
            color: 'rgba(190, 80, 30, 0.8)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            letterSpacing: '0.2em',
            '@media (max-width: 768px)': {
              fontSize: '1rem'
            }
          }}>
            TACTICAL OPERATIONS INTERFACE
          </div>
        </div>

      {/* Loading Container */}
        <div
          data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
          css={{
            '--aug-tl': '15px',
            '--aug-tr': '15px',
            '--aug-bl': '15px',
            '--aug-br': '15px',
            '--aug-border-all': '2px',
            '--aug-border-bg': '#BE501E',

            background: 'rgba(0, 0, 0, 0.7)',
            padding: '2rem',
            width: '500px',
            maxWidth: '90vw',
            '@media (max-width: 768px)': {
              padding: '1.5rem',
              width: '85vw',
              maxWidth: '350px'
            },
            '@media (max-width: 480px)': {
              padding: '1rem',
              width: '90vw',
              maxWidth: '320px'
            }
          }}
        >
          {/* Status Text */}
          <div css={{
            color: '#BE501E',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1.5rem',
            letterSpacing: '0.1em',
            height: '1.2rem',
            '@media (max-width: 768px)': {
              fontSize: '0.8rem'
            }
          }}>
            {loadingText}
          </div>

          {/* Progress Bar Container */}
          <div
            data-augmented-ui="border"
            css={{
              '--aug-border-all': '1px',
              '--aug-border-bg': '#BE501E',

              background: 'rgba(0, 0, 0, 0.5)',
              height: '20px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Progress Bar Fill */}
            <div css={{
              background: 'linear-gradient(90deg, #BE501E 0%, #FF6600 50%, #BE501E 100%)',
              height: '100%',
              width: `${progress}%`,
              transition: 'width 0.3s ease-out',
              position: 'relative',
              boxShadow: '0 0 10px rgba(190, 80, 30, 0.5)',

              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                animation: 'loading-shimmer 2s infinite',
              }
            }} />
          </div>

          {/* Progress Percentage */}
          <div css={{
            color: 'rgba(190, 80, 30, 0.9)',
            fontSize: '0.8rem',
            textAlign: 'center',
            marginTop: '1rem',
            fontWeight: 'bold'
          }}>
            {Math.round(progress)}% COMPLETE
          </div>

          {/* Loading Dots Animation */}
          <div css={{
            textAlign: 'center',
            marginTop: '1rem',
            color: '#BE501E',
            fontSize: '1.5rem',

            '& .dot': {
              animation: 'loading-dots 1.5s infinite',
            },

            '& .dot:nth-of-type(2)': {
              animationDelay: '0.3s'
            },

            '& .dot:nth-of-type(3)': {
              animationDelay: '0.6s'
            }
          }}>
            <span className="dot">●</span>
            <span className="dot">●</span>
            <span className="dot">●</span>
          </div>
        </div>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes loading-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes loading-dots {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default LoadingPage