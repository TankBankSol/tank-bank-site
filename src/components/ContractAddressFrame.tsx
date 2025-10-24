

import { type ReactElement, useState } from 'react'
import { Animator } from '@arwes/react-animator'

const ContractAddressFrame = (): ReactElement => {
  const [copied, setCopied] = useState(false)

  // Replace with your actual contract address
  const contractAddress = "TANK123456789ABCDEF"
  const displayAddress = `${contractAddress.slice(0, 4)}...${contractAddress.slice(-4)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <Animator active={true}>
        <div
          css={{
            position: 'relative',
            width: 275,
            height: 40,
            lineHeight: '40px',
            textAlign: 'left',
            color: '#BE501E',
            transition: 'color 0.3s ease',
            cursor: 'pointer',
            padding: '0 12px',
            border: '2px solid #BE501E',
            borderRadius: '4px',
            backgroundColor: 'rgba(190, 80, 30, 0.1)',

            '&:hover': {
              color: '#000000',
              borderColor: '#000000',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }
          }}
          onClick={handleCopy}
        >
          <div css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'FiraCode, monospace',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            height: '100%'
          }}>
            <div css={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>Contact Address:</span>
              <span>{displayAddress}</span>
            </div>

            <div css={{
              fontSize: '0.6rem',
              opacity: 0.8
            }}>
              {copied ? '✓' : '📋'}
            </div>
          </div>
        </div>
      </Animator>
  )
}

export default ContractAddressFrame