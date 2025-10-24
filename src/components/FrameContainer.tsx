
import { type ReactElement, type ReactNode, useRef } from 'react'
import { FrameOctagon } from '@arwes/react-frames'

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
  const svgRef = useRef<SVGSVGElement | null>(null)

  return (
    <div css={{
      position: 'relative',
      width,
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '[data-name=bg]': {
        color: 'hsl(40, 60%, 8%)',
        filter: 'drop-shadow(0 0 4px hsl(40, 60%, 8%))'
      },
      '[data-name=line]': {
        color: '#BE501E',
        filter: 'drop-shadow(0 0 6px #BE501E)'
      }
    }}>
      <FrameOctagon
        elementRef={svgRef}
        padding={4}
        strokeWidth={3}
      />
      <div css={{
        position: 'absolute',
        inset: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 1,
        overflow: 'hidden',
        wordBreak: 'break-word',
        hyphens: 'auto'
      }}>
        {children}
      </div>
    </div>
  )
}

export default FrameContainer