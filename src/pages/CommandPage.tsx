

import { type ReactElement } from 'react'

const CommandPage = (): ReactElement => {
  return (
    <div css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '120px 2rem 2rem',
      color: '#A8540E',
      fontFamily: 'FiraCode, monospace'
    }}>
      <h1 css={{
        fontSize: '3rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Tank Bank Command Center
      </h1>
      <p css={{
        fontSize: '1.2rem',
        textAlign: 'center',
        maxWidth: '800px',
        lineHeight: 1.6,
        opacity: 0.9
      }}>
        Welcome to Tank Bank Command Center - Your central hub for all Tank Bank operations.
        Monitor your portfolio, manage your assets, and stay connected with the Tank Bank ecosystem.
      </p>
    </div>
  )
}

export default CommandPage