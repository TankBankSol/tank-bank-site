
import { type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import FrameContainer from '../components/FrameContainer'

const CommsPage = (): ReactElement => {
  return (
    <div css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '140px 2rem 2rem',
      color: '#A8540E',
      fontFamily: 'FiraCode, monospace',
      '@media (max-width: 768px)': {
        paddingTop: '280px'
      }
    }}>
      <h1 css={{
        fontSize: '3rem',
        marginBottom: '3rem',
        textAlign: 'center',
        fontFamily: 'Nemesys, serif'
      }}>
        Tank Communications
      </h1>

      <div css={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1000px',
        width: '100%',
        justifyItems: 'center',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
          justifyItems: 'center',
          placeItems: 'center',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      }}>
        <FrameContainer width={350} height={400}>
          <div css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            textAlign: 'center',
            padding: '1rem',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <h3 css={{
              color: '#BE501E',
              marginBottom: '0.8rem',
              fontSize: '1.2rem',
              fontFamily: 'Nemesys, serif',
              lineHeight: 1.2,
              wordBreak: 'break-word',
              hyphens: 'auto'
            }}>
              Tank Meme Generator
            </h3>
            <p css={{
              fontSize: '0.8rem',
              marginBottom: '1rem',
              opacity: 0.8,
              lineHeight: 1.3,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'FiraCode, monospace',
              wordBreak: 'break-word',
              hyphens: 'auto',
              textAlign: 'center',
              overflow: 'hidden'
            }}>
              Create and share tank memes with custom text, tank images, and clipart.
              Perfect for spreading Tank Bank culture!
            </p>
            <Link
              to="/meme-generator"
              css={{
                padding: '0.6rem 1.2rem',
                background: '#BE501E',
                border: 'none',
                borderRadius: '4px',
                color: '#000',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'FiraCode, monospace',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: '#A8540E',
                  color: '#fff',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Create Memes
            </Link>
          </div>
        </FrameContainer>

        <FrameContainer width={350} height={400}>
          <div css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            textAlign: 'center',
            padding: '1rem',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <h3 css={{
              color: '#BE501E',
              marginBottom: '0.8rem',
              fontSize: '1.2rem',
              fontFamily: 'Nemesys, serif',
              lineHeight: 1.2,
              wordBreak: 'break-word',
              hyphens: 'auto'
            }}>
              Community Hub
            </h3>
            <p css={{
              fontSize: '0.8rem',
              marginBottom: '1rem',
              opacity: 0.8,
              lineHeight: 1.3,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'FiraCode, monospace',
              wordBreak: 'break-word',
              hyphens: 'auto',
              textAlign: 'center',
              overflow: 'hidden'
            }}>
              Connect with other Tank Bank operators, share strategies,
              and stay updated on the latest developments.
            </p>
            <button
              css={{
                padding: '0.6rem 1.2rem',
                background: 'transparent',
                border: '2px solid #BE501E',
                borderRadius: '4px',
                color: '#A8540E',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'FiraCode, monospace',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: '#BE501E',
                  color: '#000',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Coming Soon
            </button>
          </div>
        </FrameContainer>
      </div>
    </div>
  )
}

export default CommsPage