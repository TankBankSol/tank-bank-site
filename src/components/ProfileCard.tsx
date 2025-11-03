import { type ReactElement, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ProfileService } from '../services/profileService'
import { type CommanderProfile } from '../lib/supabase'

interface ProfileCardProps {
  isMobile?: boolean
}

const ProfileCard = ({ isMobile = false }: ProfileCardProps): ReactElement | null => {
  const { connected, publicKey } = useWallet()
  const [profile, setProfile] = useState<CommanderProfile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (connected && publicKey) {
        setLoading(true)
        try {
          const commanderProfile = await ProfileService.getProfile(publicKey.toString())
          setProfile(commanderProfile)
        } catch (error) {
          console.error('Error fetching profile:', error)
          setProfile(null)
        } finally {
          setLoading(false)
        }
      } else {
        setProfile(null)
      }
    }

    fetchProfile()
  }, [connected, publicKey])

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (connected && publicKey) {
        const fetchUpdatedProfile = async () => {
          try {
            const commanderProfile = await ProfileService.getProfile(publicKey.toString())
            setProfile(commanderProfile)
          } catch (error) {
            console.error('Error fetching updated profile:', error)
          }
        }
        fetchUpdatedProfile()
      }
    }

    // Listen for custom profile update events
    window.addEventListener('profileUpdated', handleProfileUpdate)

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [connected, publicKey])

  const calculateTimeServed = (createdAt: string): string => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMs = now.getTime() - created.getTime()

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const getRankIcon = (rank: string): string => {
    switch (rank.toLowerCase()) {
      case 'recruit': return ''
      case 'corporal': return '⭐'
      case 'sergeant': return '⭐⭐'
      case 'lieutenant': return '⭐⭐⭐'
      case 'captain': return '🏅'
      case 'major': return '🎯'
      case 'colonel': return '🔥'
      case 'general': return '👑'
      default: return ''
    }
  }

  if (!connected || !profile) {
    return null
  }

  if (loading) {
    return (
      <div
        className="animate-hidden animate-border-grow"
        data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
        css={{
          '--aug-border-all': '2px',
          '--aug-border-bg': '#BE501E',
          '--aug-clip-size': '8px',

          background: 'rgba(0, 0, 0, 0.65)',
          padding: isMobile ? '1rem' : '1.5rem',
          width: isMobile ? 'calc(100vw - 2rem)' : '100%',
          maxWidth: isMobile ? '380px' : 'none',
          textAlign: 'center'
        }}
      >
        <div css={{
          color: 'rgba(190, 80, 30, 0.9)',
          fontFamily: 'FiraCode, monospace',
          fontSize: '0.9rem'
        }}>
          Loading profile...
        </div>
      </div>
    )
  }

  return (
    <div
      className="animate-hidden animate-border-grow"
      data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
      css={{
        '--aug-border-all': '2px',
        '--aug-border-bg': '#BE501E',
        '--aug-clip-size': '8px',

        background: 'rgba(0, 0, 0, 0.85)',
        padding: isMobile ? '1rem' : '1.5rem',
        width: isMobile ? 'calc(100vw - 2rem)' : '100%',
        maxWidth: isMobile ? '380px' : 'none',
        zIndex: 50, // Lower than side panel (which is 100)

        '@media (max-width: 768px)': {
          padding: '1.2rem'
        }
      }}
    >
      <div className="animate-hidden animate-content-delayed">
        {/* Header */}
        <div css={{
          textAlign: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(190, 80, 30, 0.3)',
          paddingBottom: '0.75rem'
        }}>
          <h3 css={{
            color: '#BE501E',
            fontFamily: 'Nemesys, serif',
            fontSize: isMobile ? '1.1rem' : '1.3rem',
            marginBottom: '0.25rem',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(190, 80, 30, 0.3)'
          }}>
            Commander Profile
          </h3>
        </div>

        {/* Commander Info */}
        <div css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Name */}
          <div css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span css={{
              color: 'rgba(190, 80, 30, 0.8)',
              fontFamily: 'FiraCode, monospace',
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Name:
            </span>
            <span css={{
              color: '#BE501E',
              fontFamily: 'FiraCode, monospace',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: 'bold'
            }}>
              {profile.commander_name || 'Unknown'}
            </span>
          </div>

          {/* Rank */}
          <div css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span css={{
              color: 'rgba(190, 80, 30, 0.8)',
              fontFamily: 'FiraCode, monospace',
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Rank:
            </span>
            <div css={{
              display: 'flex',
              alignItems: 'center',
              gap: getRankIcon(profile.rank) ? '0.5rem' : '0'
            }}>
              {getRankIcon(profile.rank) && (
                <span css={{ fontSize: '1rem' }}>
                  {getRankIcon(profile.rank)}
                </span>
              )}
              <span css={{
                color: '#BE501E',
                fontFamily: 'FiraCode, monospace',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: 'bold'
              }}>
                {profile.rank}
              </span>
            </div>
          </div>

          {/* Time Served */}
          <div css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span css={{
              color: 'rgba(190, 80, 30, 0.8)',
              fontFamily: 'FiraCode, monospace',
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Time Served:
            </span>
            <span css={{
              color: '#BE501E',
              fontFamily: 'FiraCode, monospace',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: 'bold'
            }}>
              {calculateTimeServed(profile.created_at)}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfileCard