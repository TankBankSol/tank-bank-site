

import { type ReactElement } from 'react'

const TankContentBox = (): ReactElement => {
  return (
    <div css={{
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70.3125vw',
      height: '58.59375vh',
      maxWidth: '937.5px',
      maxHeight: '703.125px',
      backgroundImage: 'url(/src/assets/lowangleTankv2.png)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      zIndex: 1,
      pointerEvents: 'none',
      '@media (max-width: 768px)': {
        position: 'fixed',
        bottom: '5rem',
        left: '50%',
        right: 'auto',
        top: 'auto',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '180px',
        maxWidth: 'none',
        maxHeight: 'none'
      },
      '@media (max-width: 480px)': {
        bottom: '4rem',
        width: '240px',
        height: '150px'
      }
    }} />
  )
}

export default TankContentBox