import { type ReactElement, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHeaderHeight } from '../hooks/useHeaderHeight'
import { ProfileService } from '../services/profileService'
import { type CommanderProfile } from '../lib/supabase'
import ProfileCard from '../components/ProfileCard'

const SettingsPage = (): ReactElement => {
  const { connected, publicKey } = useWallet()
  const headerHeight = useHeaderHeight()
  const [isMobile, setIsMobile] = useState(false)
  const [profile, setProfile] = useState<CommanderProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState('')
  const [nameError, setNameError] = useState('')
  const [nameSuccess, setNameSuccess] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (connected && publicKey) {
        setLoading(true)
        try {
          const commanderProfile = await ProfileService.getProfile(publicKey.toString())
          setProfile(commanderProfile)
          if (commanderProfile) {
            setNewName(commanderProfile.commander_name || '')
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setProfile(null)
      }
    }

    fetchProfile()
  }, [connected, publicKey])

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setNameError('Commander name is required')
      return
    }

    if (newName.length < 3) {
      setNameError('Commander name must be at least 3 characters')
      return
    }

    if (newName.length > 20) {
      setNameError('Commander name must be 20 characters or less')
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(newName)) {
      setNameError('Commander name can only contain letters, numbers, hyphens, and underscores')
      return
    }

    if (newName === profile?.commander_name) {
      setNameError('New name must be different from current name')
      return
    }

    setIsUpdating(true)
    setNameError('')
    setNameSuccess('')

    try {
      // Check if name is available
      const isAvailable = await ProfileService.isNameAvailable(newName.trim())

      if (!isAvailable) {
        setNameError('This commander name is already taken')
        setIsUpdating(false)
        return
      }

      // Update profile name
      if (publicKey && profile) {
        const updatedProfile = await ProfileService.updateProfile(publicKey.toString(), {
          commander_name: newName.trim()
        })

        if (updatedProfile) {
          setProfile(updatedProfile)
          setNameError('')
          setNameSuccess(`Commander name successfully updated to "${newName.trim()}"`)
          // Notify ProfileCard components to refresh
          window.dispatchEvent(new CustomEvent('profileUpdated'))
        } else {
          setNameError('Failed to update commander name. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setNameError('Error updating commander name. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }


  if (!connected) {
    return (
      <>
        {/* Desktop Profile Card - Left side */}
        {!isMobile && (
          <div css={{
            position: 'fixed',
            top: '200px',
            left: '2rem',
            width: '255px',
            zIndex: 50
          }}>
            <ProfileCard isMobile={false} />
          </div>
        )}

        <div css={{
          minHeight: '100vh',
          padding: `${isMobile ? headerHeight + 20 : 200}px 1rem 2rem`,
          paddingLeft: isMobile ? '1rem' : '300px',
          paddingRight: isMobile ? '1rem' : '165px',
          color: '#BE501E',
          fontFamily: 'FiraCode, monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div css={{
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 css={{
              color: '#BE501E',
              fontFamily: 'Nemesys, serif',
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              marginBottom: '2rem',
              textShadow: '0 0 15px rgba(190, 80, 30, 0.5)'
            }}>
              Settings
            </h2>
            <p css={{
              color: 'rgba(190, 80, 30, 0.9)',
              fontSize: '1.1rem'
            }}>
              Connect your wallet to access settings
            </p>
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        {/* Desktop Profile Card - Left side */}
        {!isMobile && (
          <div css={{
            position: 'fixed',
            top: '200px',
            left: '2rem',
            width: '255px',
            zIndex: 50
          }}>
            <ProfileCard isMobile={false} />
          </div>
        )}

        <div css={{
          minHeight: '100vh',
          padding: `${isMobile ? headerHeight + 20 : 200}px 1rem 2rem`,
          paddingLeft: isMobile ? '1rem' : '300px',
          paddingRight: isMobile ? '1rem' : '165px',
          color: '#BE501E',
          fontFamily: 'FiraCode, monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div css={{ textAlign: 'center', fontSize: '1.1rem' }}>
            Loading settings...
          </div>
        </div>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        {/* Desktop Profile Card - Left side */}
        {!isMobile && (
          <div css={{
            position: 'fixed',
            top: '200px',
            left: '2rem',
            width: '255px',
            zIndex: 50
          }}>
            <ProfileCard isMobile={false} />
          </div>
        )}

        <div css={{
          minHeight: '100vh',
          padding: `${isMobile ? headerHeight + 20 : 200}px 1rem 2rem`,
          paddingLeft: isMobile ? '1rem' : '300px',
          paddingRight: isMobile ? '1rem' : '165px',
          color: '#BE501E',
          fontFamily: 'FiraCode, monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div css={{
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 css={{
              color: '#BE501E',
              fontFamily: 'Nemesys, serif',
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              marginBottom: '2rem',
              textShadow: '0 0 15px rgba(190, 80, 30, 0.5)'
            }}>
              Settings
            </h2>
            <p css={{
              color: 'rgba(190, 80, 30, 0.9)',
              fontSize: '1.1rem'
            }}>
              No commander profile found. Create a profile first to access settings.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Desktop Profile Card - Left side */}
      {!isMobile && (
        <div css={{
          position: 'fixed',
          top: '200px',
          left: '2rem',
          width: '255px',
          zIndex: 50
        }}>
          <ProfileCard isMobile={false} />
        </div>
      )}

      <div css={{
        minHeight: '100vh',
        padding: `${isMobile ? headerHeight + 20 : 200}px 1rem 2rem`,
        paddingLeft: isMobile ? '1rem' : '165px',
        paddingRight: isMobile ? '1rem' : '165px',
        color: '#BE501E',
        fontFamily: 'FiraCode, monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>

        <div css={{
          maxWidth: '600px',
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
              padding: '2rem',
              marginBottom: '2rem'
            }}
          >
            <div className="animate-hidden animate-content-delayed">
              <h2 css={{
                color: '#BE501E',
                fontFamily: 'Nemesys, serif',
                fontSize: isMobile ? '1.8rem' : '2.2rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                textAlign: 'center',
                textShadow: '0 0 15px rgba(190, 80, 30, 0.5)'
              }}>
                Commander Settings
              </h2>

              {/* Edit Name Section */}
              <div css={{
                marginBottom: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(190, 80, 30, 0.3)',
                borderRadius: '8px'
              }}>
                <h3 css={{
                  color: '#BE501E',
                  fontFamily: 'FiraCode, monospace',
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  Edit Commander Name
                </h3>

                <div css={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value)
                        setNameError('')
                        setNameSuccess('')
                      }}
                      placeholder="Commander name..."
                      maxLength={20}
                      disabled={isUpdating}
                      css={{
                        width: isMobile ? '280px' : '400px',
                        maxWidth: '100%',
                        padding: '0.8rem',
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: `2px solid ${nameError ? '#d32f2f' : '#BE501E'}`,
                        borderRadius: '4px',
                        color: '#BE501E',
                        fontFamily: 'FiraCode, monospace',
                        fontSize: '0.9rem',
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
                    />
                  </div>

                  {nameError && (
                    <p css={{
                      color: '#d32f2f',
                      fontFamily: 'FiraCode, monospace',
                      fontSize: '0.8rem'
                    }}>
                      {nameError}
                    </p>
                  )}

                  {nameSuccess && (
                    <p css={{
                      color: '#2ECC71',
                      fontFamily: 'FiraCode, monospace',
                      fontSize: '0.8rem'
                    }}>
                      {nameSuccess}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleUpdateName}
                  disabled={isUpdating || !newName.trim() || newName === profile.commander_name}
                  data-augmented-ui="tl-clip br-clip border"
                  css={{
                    '--aug-border-all': '2px',
                    '--aug-border-bg': '#BE501E',
                    '--aug-clip-size': '6px',

                    width: isMobile ? '100%' : '425px',
                    padding: '1rem',
                    background: 'transparent',
                    color: '#BE501E',
                    fontFamily: 'FiraCode, monospace',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: (isUpdating || !newName.trim() || newName === profile.commander_name) ? 0.6 : 1,

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
                  {isUpdating ? 'Updating...' : 'Update Name'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsPage