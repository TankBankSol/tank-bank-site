/** @jsx jsx */

import { type ReactElement, useRef } from 'react'
import { Animator } from '@arwes/react-animator'
import { FrameOctagon } from '@arwes/react-frames'

interface MenuButtonProps {
  children: string
  active?: boolean
}

const MenuButton = ({ children, active = true }: MenuButtonProps): ReactElement => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  return (
    <Animator active={active}>
      <div css={{
        position: 'relative',
        width: 180,
        height: 60,
        cursor: 'pointer',

        '[data-name=bg]': {
          color: 'hsla(36, 48%, 6%, 0.10)',
          filter: 'drop-shadow(0 0 4px hsla(38, 61%, 8%, 0.09))'
        },
        '[data-name=line]': {
          color: '#BE501E',
          filter: 'drop-shadow(0 0 2px #BE501E)'
        },

        '&:hover [data-name=line]': {
          color: '#ad2007ff',
          filter: 'drop-shadow(0 0 3px #ad2007ff)'
        }
      }}>
        <FrameOctagon
          elementRef={svgRef}
          padding={3}
          strokeWidth={2}
        />
        <div css={{
          position: 'absolute',
          inset: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#BE501E',
          fontFamily: 'FiraCode, monospace',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          zIndex: 1,
        }}>
          {children}
        </div>
      </div>
    </Animator>
  )
}

const MenuButtons = (): ReactElement => {
  return (
    <div css={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: '1rem',
      position: 'fixed',
      top: '2rem',
      left: '2rem',
      zIndex: 10
    }}>
      <MenuButton>Command</MenuButton>
      <MenuButton>Deployment</MenuButton>
      <MenuButton>Comm</MenuButton>
    </div>
  )
}

export default MenuButtons