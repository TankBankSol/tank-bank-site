import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AnimatedBackground from './components/AnimatedBackground'
import TopBar from './components/TopBar'
import { WalletContextProvider } from './components/WalletProvider'
import HomePage from './pages/HomePage'
import CommandPage from './pages/CommandPage'
import DeploymentPage from './pages/DeploymentPage'
import CommsPage from './pages/CommsPage'
import MemeGeneratorPage from './pages/MemeGeneratorPage'
import './App.css'
import './wallet-adapter.css'

const MobileScrollController = () => {
  const location = useLocation()

  useEffect(() => {
    const isNoScrollPage = ['/', '/command', '/comms'].includes(location.pathname)

    if (window.innerWidth <= 768 && isNoScrollPage) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.overflow = ''
    }
  }, [location.pathname])

  return null
}

function App() {

  return (
    <>
      <div className="crt-container"></div>
      <Router>
        <WalletContextProvider>
          <MobileScrollController />
          <AnimatedBackground
            dotDistance={50}
            dotSize={1}
          />
          <TopBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/command" element={<CommandPage />} />
            <Route path="/deployment" element={<DeploymentPage />} />
            <Route path="/comms" element={<CommsPage />} />
            <Route path="/meme-generator" element={<MemeGeneratorPage />} />
          </Routes>
        </WalletContextProvider>
      </Router>
    </>
  )
}

export default App
