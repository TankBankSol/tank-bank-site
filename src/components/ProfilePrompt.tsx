import { type ReactElement, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import { ProfileService } from '../services/profileService'

interface ProfilePromptProps {
  isMobile?: boolean
}

const ProfilePrompt = ({ isMobile = false }: ProfilePromptProps): ReactElement | null => {
  const { connected, publicKey } = useWallet()
  const headerHeight = useHeaderHeight()
  const [, setHasProfile] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)
  const [commanderName, setCommanderName] = useState('')
  const [nameError, setNameError] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const checkProfile = async () => {
      if (connected && publicKey) {
        try {
          const profileExists = await ProfileService.checkProfileExists(publicKey.toString())

          if (profileExists) {
            setHasProfile(true)
            setShowPrompt(false)
          } else {
            setHasProfile(false)
            setShowPrompt(true)
          }
        } catch (error) {
          console.error('Error checking profile:', error)
          setHasProfile(false)
          setShowPrompt(false)
        }
      } else {
        setShowPrompt(false)
        setHasProfile(false)
      }
    }

    checkProfile()
  }, [connected, publicKey])

  const handleStartProfile = () => {
    setShowPrompt(false)
    setShowNameInput(true)
  }

  const handleNameSubmit = async () => {
    if (!commanderName.trim()) {
      setNameError('Commander name is required')
      return
    }

    if (commanderName.length < 3) {
      setNameError('Commander name must be at least 3 characters')
      return
    }

    if (commanderName.length > 20) {
      setNameError('Commander name must be 20 characters or less')
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(commanderName)) {
      setNameError('Commander name can only contain letters, numbers, hyphens, and underscores')
      return
    }

    setIsCreating(true)
    setNameError('')

    try {
      // Check if name is available
      const isAvailable = await ProfileService.isNameAvailable(commanderName.trim())

      if (!isAvailable) {
        setNameError('This commander name is already taken')
        setIsCreating(false)
        return
      }

      // Create profile with name
      if (publicKey) {
        const profile = await ProfileService.createProfile(publicKey.toString(), commanderName.trim())

        if (profile) {
          setHasProfile(true)
          setShowNameInput(false)
          // Profile created successfully - notify all ProfileCard components
          window.dispatchEvent(new CustomEvent('profileUpdated'))
        } else {
          setNameError('Failed to create commander profile. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      setNameError('Error creating commander profile. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  const handleBackToPrompt = () => {
    setShowNameInput(false)
    setShowPrompt(true)
    setCommanderName('')
    setNameError('')
  }

  if ((!showPrompt && !showNameInput) || !connected) {
    return null
  }


  return (
    <div
      className="animate-hidden animate-border-grow"
      data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
      css={{
        '--aug-border-all': '2px',
        '--aug-border-bg': '#BE501E',
        '--aug-clip-size': '8px',

        position: 'fixed',
        top: isMobile ? `${headerHeight + 20}px` : '25%',
        left: isMobile ? '3rem' : '40%',
        right: isMobile ? '1rem' : 'auto',
        transform: isMobile ? 'none' : 'translateX(-50%)',
        width: isMobile ? 'auto' : '400px',
        maxWidth: isMobile ? '380px' : 'none',
        background: 'rgba(0, 0, 0, 0.85)',
        padding: '1.5rem',
        zIndex: 100,
        textAlign: 'center',

        '@media (max-width: 768px)': {
          padding: '1.2rem'
        }
      }}
    >
      <div className="animate-hidden animate-content-delayed">
        {showPrompt && (
          <>
            <h3 css={{
              color: '#BE501E',
              fontFamily: 'Nemesys, serif',
              fontSize: isMobile ? '1.2rem' : '1.4rem',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              Commander Profile
            </h3>

            <p css={{
              color: 'rgba(190, 80, 30, 0.9)',
              fontFamily: 'FiraCode, monospace',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              lineHeight: 1.5,
              marginBottom: '1.5rem'
            }}>
              Would you like to start a commander profile to track your missions and rank progression?
            </p>

            <div css={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <button
                onClick={handleStartProfile}
                data-augmented-ui="tl-clip br-clip border"
                css={{
                  '--aug-border-all': '2px',
                  '--aug-border-bg': '#BE501E',
                  '--aug-clip-size': '6px',

                  padding: '0.8rem 1.5rem',
                  background: 'transparent',
                  color: '#BE501E',
                  fontFamily: 'FiraCode, monospace',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',

                  '&:hover': {
                    '--aug-border-bg': '#000000',
                    background: 'rgba(190, 80, 30, 0.1)',
                    color: '#000000',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Start Profile
              </button>

              <button
                onClick={handleDismiss}
                data-augmented-ui="tl-clip br-clip border"
                css={{
                  '--aug-border-all': '2px',
                  '--aug-border-bg': 'rgba(128, 128, 128, 0.6)',
                  '--aug-clip-size': '6px',

                  padding: '0.8rem 1.5rem',
                  background: 'transparent',
                  color: '#888888',
                  fontFamily: 'FiraCode, monospace',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',

                  '&:hover': {
                    '--aug-border-bg': '#000000',
                    background: 'rgba(128, 128, 128, 0.1)',
                    color: '#000000',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Later
              </button>
            </div>
          </>
        )}

        {showNameInput && (
          <>
            <h3 css={{
              color: '#BE501E',
              fontFamily: 'Nemesys, serif',
              fontSize: isMobile ? '1.2rem' : '1.4rem',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              Choose Commander Name
            </h3>

            <p css={{
              color: 'rgba(190, 80, 30, 0.9)',
              fontFamily: 'FiraCode, monospace',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              lineHeight: 1.5,
              marginBottom: '1.5rem'
            }}>
              Enter your commander name (3-20 characters, letters, numbers, hyphens, and underscores only):
            </p>

            <div css={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={commanderName}
                onChange={(e) => {
                  setCommanderName(e.target.value)
                  setNameError('')
                }}
                placeholder="Commander name..."
                maxLength={20}
                disabled={isCreating}
                css={{
                  width: '280px',
                  maxWidth: '100%',
                  padding: '0.8rem',
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: `2px solid ${nameError ? '#d32f2f' : '#BE501E'}`,
                  borderRadius: '4px',
                  color: '#BE501E',
                  fontFamily: 'FiraCode, monospace',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  outline: 'none',

                  '&:focus': {
                    borderColor: nameError ? '#d32f2f' : '#000000',
                    boxShadow: `0 0 8px ${nameError ? 'rgba(211, 47, 47, 0.3)' : 'rgba(190, 80, 30, 0.3)'}`,
                  },

                  '&::placeholder': {
                    color: 'rgba(190, 80, 30, 0.5)'
                  },

                  '&:disabled': {
                    opacity: 0.6,
                    cursor: 'not-allowed'
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isCreating) {
                    handleNameSubmit()
                  }
                }}
              />

              {nameError && (
                <p css={{
                  color: '#d32f2f',
                  fontFamily: 'FiraCode, monospace',
                  fontSize: '0.7rem',
                  marginTop: '0.5rem'
                }}>
                  {nameError}
                </p>
              )}
            </div>

            <div css={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <button
                onClick={handleNameSubmit}
                disabled={isCreating || !commanderName.trim()}
                data-augmented-ui="tl-clip br-clip border"
                css={{
                  '--aug-border-all': '2px',
                  '--aug-border-bg': '#BE501E',
                  '--aug-clip-size': '6px',

                  padding: '0.8rem 1.5rem',
                  background: 'transparent',
                  color: '#BE501E',
                  fontFamily: 'FiraCode, monospace',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: (isCreating || !commanderName.trim()) ? 0.6 : 1,

                  '&:hover': {
                    '--aug-border-bg': '#000000',
                    background: 'rgba(190, 80, 30, 0.1)',
                    color: '#000000',
                    transform: 'translateY(-2px)'
                  },

                  '&:disabled': {
                    cursor: 'not-allowed',
                    transform: 'none'
                  }
                }}
              >
                {isCreating ? 'Creating...' : 'Create Profile'}
              </button>

              <button
                onClick={handleBackToPrompt}
                disabled={isCreating}
                data-augmented-ui="tl-clip br-clip border"
                css={{
                  '--aug-border-all': '2px',
                  '--aug-border-bg': 'rgba(128, 128, 128, 0.6)',
                  '--aug-clip-size': '6px',

                  padding: '0.8rem 1.5rem',
                  background: 'transparent',
                  color: '#888888',
                  fontFamily: 'FiraCode, monospace',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',

                  '&:hover': {
                    '--aug-border-bg': '#000000',
                    background: 'rgba(128, 128, 128, 0.1)',
                    color: '#000000',
                    transform: 'translateY(-2px)'
                  },

                  '&:disabled': {
                    opacity: 0.6,
                    cursor: 'not-allowed',
                    transform: 'none'
                  }
                }}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfilePrompt