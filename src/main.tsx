import { createRoot } from 'react-dom/client'
import './index.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import 'augmented-ui/augmented-ui.min.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />,
)
