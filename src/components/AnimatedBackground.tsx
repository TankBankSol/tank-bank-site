import { type ReactElement, useState, useEffect } from 'react'
import { Animator } from '@arwes/react-animator'
import { Animated } from '@arwes/react-animated'
import { Dots } from '@arwes/react-bgs'

interface AnimatedBackgroundProps {
  backgroundColor?: string
  backgroundImage?: string
  dotColor?: string
  dotDistance?: number
  dotSize?: number
}

const AnimatedBackground = ({
  backgroundColor = '#2D312F',
  //backgroundImage = 'radial-gradient(85% 85% at 50% 50%, hsla(35, 38%, 9%, 0.25) 0%, hsla(39, 38%, 9%, 0.12) 50%, hsla(30, 46%, 5%, 0.00) 100%)',
  dotColor = 'hsla(40, 100%, 23%, 0.83)',
  dotDistance = 50,
  dotSize = 1
}: AnimatedBackgroundProps): ReactElement => {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(true)
  }, [])

  return (
    <Animator active={active} duration={{ enter: 2, exit: 0.5 }}>
      <Animated
        animated={{
          transitions: {
            entering: { opacity: [0, 1] },
            exiting: { opacity: [1, 0] }
          }
        }}
      >
        <div style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor,
          backgroundRepeat: 'repeat',
          zIndex: 0
        }}>
          <Dots
            color={dotColor}
            type='circle'
            distance={dotDistance}
            size={dotSize}
            origin={[0, 1]}
            originInverted
          />
        </div>
      </Animated>
    </Animator>
  )
}

export default AnimatedBackground