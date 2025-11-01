import { type ReactElement } from 'react'

interface CommunicationCardProps {
  features: { name: string; url: string }[]
  isMobile: boolean
}

const CommunicationCard = ({ features, isMobile }: CommunicationCardProps): ReactElement => {
  return (
    <div
      data-augmented-ui="tl-clip tr-clip b-clip-x bl-2-clip-x br-2-clip-x border"
      css={{
        '--aug-border-all': '3px',
        '--aug-border-bg': '#BE501E',
        '--aug-clip-size': '15px',

        background: 'rgba(0, 0, 0, 0.65)',
        padding: '2rem',
        boxShadow: '0 0 30px rgba(190, 80, 30, 0.3)',

        '@media (max-width: 768px)': {
          padding: '1.5rem',
          '--aug-clip-size': '10px'
        }
      }}
    >
      <h2 css={{
        color: '#BE501E',
        fontFamily: 'Nemesys, serif',
        fontSize: isMobile ? '1.4rem' : '2.2rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center',
        textShadow: '0 0 15px rgba(190, 80, 30, 0.5)',
        '@media (max-width: 480px)': {
          fontSize: '1.2rem'
        }
      }}>
        Communications Center
      </h2>

      <p css={{
        color: 'rgba(190, 80, 30, 0.9)',
        fontFamily: 'FiraCode, monospace',
        fontSize: isMobile ? '0.9rem' : '1rem',
        lineHeight: 1.6,
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Avaliable Communications Setup
      </p>

      <div css={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {features.map((feature, index) => {
          const isLinked = feature.url !== "#"
          const Component = isLinked ? 'a' : 'div'

          return (
            <Component
              key={index}
              {...(isLinked ? {
                href: feature.url,
                target: "_blank",
                rel: "noopener noreferrer"
              } : {})}
              data-augmented-ui="tl-clip br-clip border"
              css={{
                '--aug-border-all': '1px',
                '--aug-border-bg': isLinked ? 'rgba(190, 80, 30, 0.6)' : 'rgba(128, 128, 128, 0.4)',
                '--aug-clip-size': '6px',

                background: isLinked ? 'rgba(190, 80, 30, 0.1)' : 'rgba(128, 128, 128, 0.05)',
                padding: '0.8rem 1rem',
                color: isLinked ? '#BE501E' : '#888888',
                fontFamily: 'FiraCode, monospace',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                cursor: isLinked ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                opacity: isLinked ? 1 : 0.6,

                ...(isLinked ? {
                  '&:hover': {
                    '--aug-border-bg': '#BE501E',
                    background: 'rgba(190, 80, 30, 0.2)',
                    color: '#000000',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(190, 80, 30, 0.3)'
                  }
                } : {})
              }}
            >
              {feature.name}
            </Component>
          )
        })}
      </div>

      <div css={{
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: 'FiraCode, monospace',
        fontSize: isMobile ? '0.8rem' : '0.9rem',
        fontStyle: 'italic'
      }}>
        Coordinate with Commanders.
      </div>
    </div>
  )
}

export default CommunicationCard