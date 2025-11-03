

import { type ReactElement, useState } from 'react'

const ContractAddressFrame = (): ReactElement => {
  const [copied, setCopied] = useState(false)

  // Replace with your actual contract address
  const contractAddress = "Not Yet Launched"
  // const displayAddress = `${contractAddress.slice(0, 4)}...${contractAddress.slice(-4)}`


  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contractAddress)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Fallback for mobile/older browsers
        const textArea = document.createElement('textarea')
        textArea.value = contractAddress
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)

        if (successful) {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } else {
          // Final fallback - show alert with address
          alert(`Contract Address: ${contractAddress}`)
        }
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Fallback - show alert with address
      alert(`Contract Address: ${contractAddress}`)
    }
  }

  return (
    <div className="animate-hidden animate-tactical-fade">
        <div
          data-augmented-ui="tl-clip tr-clip border"
          css={{
            position: 'relative',
            width: 275,
            height: 40,
            lineHeight: '40px',
            textAlign: 'center',
            color: '#BE501E',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            padding: '0 12px',
            background: 'rgba(0, 0, 0, 0.65)',

            '--aug-border-all': '2px',
            '--aug-border-bg': '#BE501E',
            '--aug-clip-size': '6px',

            '@media (max-width: 768px)': {
              width: 'calc(100vw - 46px)',
              maxWidth: '380px',
              height: '35px',
              lineHeight: '35px',
              fontSize: '0.8rem'
            },

            '&:hover': {
              '--aug-border-bg': '#000000',
              color: '#000000',
              background: 'rgba(190, 80, 30, 0.1)',
            }
          }}
          onClick={handleCopy}
        >
          <div css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'FiraCode, monospace',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            height: '100%',
            position: 'relative'
          }}>
            <span>{contractAddress}</span>

            <div css={{
              position: 'absolute',
              right: '8px',
              fontSize: '0.6rem',
              opacity: 0.8
            }}>
              {copied ? '✓' : '📋'}
            </div>
          </div>
        </div>
    </div>
  )
}

export default ContractAddressFrame