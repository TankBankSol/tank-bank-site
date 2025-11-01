import { useState, useEffect } from 'react'

export const usePageLoading = () => {
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Only show loading on initial page load/reload
    if (!hasLoaded) {
      // Simulate loading time for initial load
      const timer = setTimeout(() => {
        setIsLoading(false)
        setHasLoaded(true)
      }, 2000) // 2 seconds loading time

      return () => clearTimeout(timer)
    }
  }, [hasLoaded])

  const completeLoading = () => {
    setIsLoading(false)
    setHasLoaded(true)
  }

  return { isLoading, completeLoading }
}