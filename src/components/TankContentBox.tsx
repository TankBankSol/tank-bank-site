

import { type ReactElement } from 'react'

const TankContentBox = (): ReactElement => {
  return (
    <div css={{
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-40%, -45%)',
      width: '93.75vw',
      height: '78.125vh',
      maxWidth: '1250px',
      maxHeight: '937.5px',
      backgroundImage: 'url(/src/assets/TankBankM1AbramsOutline.png)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      zIndex: 1,
      pointerEvents: 'none',
      '@media (max-width: 768px)': {
        transform: 'translate(-50%, -50%)',
        width: '95vw',
        height: '50vh',
        top: '65%',
        position: 'fixed'
      },
      '@media (max-width: 480px)': {
        width: '98vw',
        height: '45vh',
        top: '70%',
        position: 'fixed'
      }
    }} />
  )
}

export default TankContentBox