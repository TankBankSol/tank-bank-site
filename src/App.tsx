import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AnimatedBackground from './components/AnimatedBackground'
import TopBar from './components/TopBar'
import SocialMedia from './components/SocialMedia'
import LoadingPage from './components/LoadingPage'
import { WalletContextProvider } from './components/WalletProvider'
import { usePageLoading } from './hooks/usePageLoading'
import HomePage from './pages/HomePage'
import CommandPage from './pages/CommandPage'
import OperationsPage from './pages/OperationsPage'
import ArmoryPage from './pages/ArmoryPage'
import CommsPage from './pages/CommsPage'
import './App.css'
import './wallet-adapter.css'
import './styles/animations.css'

const MobileScrollController = () => {
  const location = useLocation()

  useEffect(() => {
    const isNoScrollPage = ['/', '/command'].includes(location.pathname)

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

const AppContent = () => {
  const { isLoading, completeLoading } = usePageLoading()

  return (
    <>
      <MobileScrollController />
      <AnimatedBackground />
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/command" element={<CommandPage />} />
        <Route path="/operations" element={<OperationsPage />} />
        <Route path="/armory" element={<ArmoryPage />} />
        <Route path="/comms" element={<CommsPage />} />
      </Routes>
      <SocialMedia />
      <LoadingPage isLoading={isLoading} onComplete={completeLoading} />
    </>
  )
}

function App() {
  return (
    <>
      <div className="crt-container"></div>
      <Router>
        <WalletContextProvider>
          <AppContent />
        </WalletContextProvider>
      </Router>

      {/* Disclaimer */}
      <div css={{
        position: 'fixed',
        bottom: '8px',
        right: '8px',
        color: 'rgba(190, 80, 30, 0.6)',
        fontFamily: 'FiraCode, monospace',
        fontSize: '0.7rem',
        zIndex: 1000,
        pointerEvents: 'none',
        userSelect: 'none',
        '@media (max-width: 768px)': {
          fontSize: '0.6rem',
          bottom: '6px',
          right: '6px'
        }
      }}>
        Experimental Platform - Use at your own risk
      </div>
    </>
  )
}

export default App
