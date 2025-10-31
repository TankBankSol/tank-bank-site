import { useState, useEffect } from 'react'

export const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const calculateHeaderHeight = () => {
      // Look for the TopBar component or any fixed header elements
      const topBar = document.querySelector('[data-header="true"]') as HTMLElement
      const walletPanel = document.querySelector('[data-wallet-panel="true"]') as HTMLElement

      let totalHeight = 0

      if (topBar) {
        totalHeight += topBar.offsetHeight
      }

      // On mobile, account for wallet panel if it's visible and taking space
      if (window.innerWidth <= 768 && walletPanel) {
        const panelRect = walletPanel.getBoundingClientRect()
        if (panelRect.top < window.innerHeight / 2) {
          totalHeight += panelRect.height
        }
      }

      // Add some buffer space
      totalHeight += 40

      setHeaderHeight(totalHeight)
    }

    // Calculate initial height
    calculateHeaderHeight()

    // Recalculate on resize and orientation change
    window.addEventListener('resize', calculateHeaderHeight)
    window.addEventListener('orientationchange', calculateHeaderHeight)

    // Use a slight delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(calculateHeaderHeight, 100)

    return () => {
      window.removeEventListener('resize', calculateHeaderHeight)
      window.removeEventListener('orientationchange', calculateHeaderHeight)
      clearTimeout(timeoutId)
    }
  }, [])

  return headerHeight
}