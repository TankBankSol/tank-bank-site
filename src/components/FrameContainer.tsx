
import { type ReactElement, type ReactNode } from 'react'

interface FrameContainerProps {
  children: ReactNode
  width?: number
  height?: number
}

const FrameContainer = ({
  children,
  width = 300,
  height = 200
}: FrameContainerProps): ReactElement => {
  return (
    <div
      data-augmented-ui="tl-clip tr-clip bl-clip br-clip border"
      css={{
        '--aug-border-all': '2px',
        '--aug-border-bg': '#BE501E',
        '--aug-clip-size': '10px',

        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.65)',
        padding: 16
      }}>
        {children}
    </div>
  )
}

export default FrameContainer