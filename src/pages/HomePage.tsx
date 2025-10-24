

import { type ReactElement } from 'react'
import TankContentBox from '../components/TankContentBox'
import WalletSidePanel from '../components/WalletSidePanel'
import SocialMedia from '../components/SocialMedia'

const HomePage = (): ReactElement => {
  return (
    <div>
      <TankContentBox />
      <WalletSidePanel />
      <SocialMedia />
    </div>
  )
}

export default HomePage