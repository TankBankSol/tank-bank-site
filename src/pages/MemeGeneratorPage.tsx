

import React from 'react'
import { type ReactElement, useState, useCallback, useEffect } from 'react'
import FrameContainer from '../components/FrameContainer'

interface MemeTemplate {
  id: string
  name: string
  blank: string
  lines: number
  overlays: number
  styles: string[]
  example: {
    text: string[]
    url: string
  }
  source?: string
  keywords?: string[]
  _self: string
}

const MemeGeneratorPage = (): ReactElement => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([])
  const [currentImageSet, setCurrentImageSet] = useState<MemeTemplate[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [memeTexts, setMemeTexts] = useState<string[]>(['', ''])
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [generating, setGenerating] = useState<boolean>(false)
  const [textFont, setTextFont] = useState<string>('impact')
  const [textColor, setTextColor] = useState<string>('white')
  const [textOutlineColor, setTextOutlineColor] = useState<string>('black')
  const [textSize, setTextSize] = useState<number>(50)
  const [textPositions, setTextPositions] = useState<{ x: number; y: number }[]>([
    { x: 50, y: 10 }, // Top text - center horizontally, 10% from top
    { x: 50, y: 85 }  // Bottom text - center horizontally, 85% from top
  ])
  const [textRotations, setTextRotations] = useState<number[]>([0, 0])
  const [isDragging, setIsDragging] = useState<number | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [useUploadedImage, setUseUploadedImage] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [urlImage, setUrlImage] = useState<string | null>(null)
  const [useUrlImage, setUseUrlImage] = useState<boolean>(false)
  const [urlLoading, setUrlLoading] = useState<boolean>(false)
  const [showFontPicker, setShowFontPicker] = useState<boolean>(false)
  const [windowSize, setWindowSize] = useState({ width: 1400, height: 800 })

  // Close font picker when clicking outside modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFontPicker) {
        setShowFontPicker(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showFontPicker])




  // Load memegen templates
  const loadTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/templates')
      if (response.ok) {
        const memes: MemeTemplate[] = await response.json()
        console.log('Fetched memegen templates:', memes.length)

        setTemplates(memes)
        const initialSet = memes.slice(0, 5)
        setCurrentImageSet(initialSet)
        console.log('Initial template set:', initialSet.map(img => img.name))
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Navigate carousel
  const navigateCarousel = useCallback((direction: 'next' | 'prev') => {
    const itemsPerPage = 5
    const totalPages = Math.ceil(templates.length / itemsPerPage)

    let newPage = currentPage

    if (direction === 'next') {
      newPage = Math.min(currentPage + 1, totalPages - 1)
    } else {
      newPage = Math.max(currentPage - 1, 0)
    }

    if (newPage !== currentPage) {
      const startIndex = newPage * itemsPerPage
      const endIndex = Math.min(startIndex + itemsPerPage, templates.length)
      const newImageSet = templates.slice(startIndex, endIndex)

      console.log(`Navigating to page ${newPage + 1}/${totalPages}:`, newImageSet.map(img => img.name))

      setSelectedTemplate(null)
      setMemeTexts(['', ''])
      setGeneratedMemeUrl('')
      setCurrentPage(newPage)
      setCurrentImageSet([...newImageSet])
    }
  }, [currentPage, templates])


  // Generate meme
  const generateMeme = useCallback(async () => {
    if (!selectedTemplate && !uploadedImage) {
      alert('Please select an image first')
      return
    }

    const hasText = memeTexts.some(text => text.trim() !== '')
    if (!hasText) {
      alert('Please add some text to your meme')
      return
    }

    setGenerating(true)
    try {
      if (uploadedImage || urlImage) {
        const currentImage = uploadedImage || urlImage!

        // Check if the image is a GIF
        if (isGif(currentImage)) {
          // For GIFs, we need to preserve animation while showing text overlays
          console.log('Detected GIF, preserving animation and text overlays...')

          // Since we can't easily composite text onto animated GIFs with web APIs,
          // we'll provide the original GIF but with instructions
          setGeneratedMemeUrl(currentImage)
          setGenerating(false)

          // Show user message about GIF limitations
          setTimeout(() => {
            alert('🎬 GIF Generated!\n\nFor animated GIFs, the text overlays you see in the preview show the positioning, but the downloaded file will be the original animated GIF.\n\nThis preserves the animation quality. To add permanent text to animated GIFs, specialized video editing software is recommended.')
          }, 500)

          return
        }

        // For static images, use canvas-based approach
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = async () => {
          if (!ctx) return

          canvas.width = img.width
          canvas.height = img.height

          // Draw the uploaded image
          ctx.drawImage(img, 0, 0)

          // Add text overlays
          memeTexts.forEach((text, index) => {
            if (text.trim()) {
              const position = textPositions[index] || { x: 50, y: index === 0 ? 10 : 85 }
              const rotation = textRotations[index] || 0
              const x = (position.x / 100) * canvas.width
              const y = (position.y / 100) * canvas.height

              ctx.save() // Save current context

              // Move to text position and rotate
              ctx.translate(x, y)
              ctx.rotate((rotation * Math.PI) / 180)

              ctx.font = `bold ${textSize}px ${(() => {
                switch (textFont) {
                  case 'impact': return 'Impact'
                  case 'arial': return 'Arial'
                  case 'comic': return 'Comic Sans MS'
                  case 'times': return 'Times New Roman'
                  case 'helvetica': return 'Helvetica'
                  case 'kalam': return 'Kalam'
                  default: return 'Impact'
                }
              })()}`
              ctx.fillStyle = textColor
              ctx.strokeStyle = textOutlineColor
              ctx.lineWidth = 2
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'

              // Add text with stroke for outline effect
              ctx.strokeText(text, 0, 0)
              ctx.fillText(text, 0, 0)

              ctx.restore() // Restore context to previous state
            }
          })

          // Add watermark
          await addWatermark(canvas, ctx)

          // Convert canvas to data URL (preserve format for non-GIFs)
          const format = currentImage.includes('.png') ? 'image/png' : 'image/jpeg'
          const dataURL = canvas.toDataURL(format, 0.9)
          setGeneratedMemeUrl(dataURL)
          setGenerating(false)
        }

        img.src = currentImage
        return
      }

      // Use local memegen API for meme generation
      const templateId = selectedTemplate!.id
      const textLines = memeTexts.filter(text => text.trim()).map(text => text.trim())

      // Create the URL for memegen: /images/{template}/{text1}/{text2}.png
      let memeUrl = `http://localhost:5000/images/${templateId}`

      if (textLines.length > 0) {
        // URL encode each text line and join with /
        const encodedTexts = textLines.map(text => encodeURIComponent(text))
        memeUrl += '/' + encodedTexts.join('/')
      } else {
        // If no text, use underscore placeholders
        const placeholders = Array(selectedTemplate!.lines).fill('_')
        memeUrl += '/' + placeholders.join('/')
      }

      memeUrl += '.png'

      // Add query parameters for customization
      const params = new URLSearchParams()
      if (textFont && textFont !== 'impact') {
        params.append('font', textFont)
      }
      if (textSize !== 50) {
        params.append('size', textSize.toString())
      }

      if (params.toString()) {
        memeUrl += '?' + params.toString()
      }

      console.log('Generated memegen URL:', memeUrl)

      // For template-based memes, we need to add our watermark post-generation
      // since we disabled the memegen default watermark
      try {
        // Load the generated meme image
        const response = await fetch(memeUrl)
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)

        // Create canvas to add watermark
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = async () => {
          if (!ctx) return

          canvas.width = img.width
          canvas.height = img.height

          // Draw the meme image
          ctx.drawImage(img, 0, 0)

          // Add watermark
          await addWatermark(canvas, ctx)

          // Convert to data URL
          const watermarkedDataURL = canvas.toDataURL('image/png', 0.9)
          setGeneratedMemeUrl(watermarkedDataURL)

          // Clean up
          URL.revokeObjectURL(imageUrl)
        }

        img.src = imageUrl
      } catch (error) {
        console.error('Error adding watermark to template meme:', error)
        // Fallback to original meme without watermark
        setGeneratedMemeUrl(memeUrl)
      }
    } catch (error) {
      console.error('Error generating meme:', error)
      alert('Failed to generate meme. Please try again.')
    } finally {
      setGenerating(false)
    }
  }, [selectedTemplate, memeTexts, textFont, textColor, textSize, textOutlineColor, textPositions, textRotations, uploadedImage, urlImage])

  // Download meme
  const downloadMeme = useCallback(async () => {
    if (!generatedMemeUrl) return

    try {
      // Determine file extension based on the image type
      let fileExtension = '.jpg'
      const currentImage = uploadedImage || urlImage

      if (currentImage && (currentImage.toLowerCase().includes('.gif') || currentImage.toLowerCase().includes('gif') || (uploadedImage && uploadedImage.startsWith('data:image/gif')))) {
        fileExtension = '.gif'
      } else if (currentImage && currentImage.includes('.png')) {
        fileExtension = '.png'
      } else if (generatedMemeUrl.startsWith('data:image/png')) {
        fileExtension = '.png'
      } else if (generatedMemeUrl.startsWith('data:image/gif')) {
        fileExtension = '.gif'
      }

      const response = await fetch(generatedMemeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tank_bank_meme_${selectedTemplate?.id || (uploadedImage ? 'custom' : urlImage ? 'url' : 'meme')}${fileExtension}`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading meme:', error)
    }
  }, [generatedMemeUrl, selectedTemplate, uploadedImage, urlImage])

  // Share meme
  const shareMeme = useCallback(async () => {
    if (!generatedMemeUrl) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tank Bank Meme',
          text: 'Check out this Tank Bank meme!',
          url: generatedMemeUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard?.writeText(generatedMemeUrl)
      alert('Meme URL copied to clipboard!')
    }
  }, [generatedMemeUrl])

  // Share to X.com
  const shareToX = useCallback(() => {
    if (!generatedMemeUrl) return

    const text = encodeURIComponent('Check out this Tank Bank meme! 🚀💰 #TankBank #Meme')
    const url = encodeURIComponent(generatedMemeUrl)
    const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`

    window.open(xUrl, '_blank', 'width=550,height=420')
  }, [generatedMemeUrl])

  // Update meme text
  const updateMemeText = useCallback((index: number, value: string) => {
    setMemeTexts(prev => {
      const newTexts = [...prev]
      newTexts[index] = value
      return newTexts
    })
  }, [])

  // Handle text drag functionality
  const handleMouseDown = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(index)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging === null) return

    const previewElement = e.currentTarget as HTMLElement
    const rect = previewElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Constrain to preview bounds
    const constrainedX = Math.max(5, Math.min(95, x))
    const constrainedY = Math.max(5, Math.min(95, y))

    setTextPositions(prev => {
      const newPositions = [...prev]
      newPositions[isDragging] = { x: constrainedX, y: constrainedY }
      return newPositions
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setUseUploadedImage(true)
        setSelectedTemplate(null) // Clear template selection
        setGeneratedMemeUrl('')
        // Reset text positions for uploaded image
        setTextPositions([
          { x: 50, y: 10 },
          { x: 50, y: 85 }
        ])
        setMemeTexts(['', ''])
        // Reset text rotations
        setTextRotations([0, 0])
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Handle URL image loading
  const handleUrlImageLoad = useCallback(async () => {
    if (!imageUrl.trim()) {
      alert('Please enter a valid image URL')
      return
    }

    // Basic URL validation
    try {
      new URL(imageUrl)
    } catch {
      alert('Please enter a valid URL')
      return
    }

    setUrlLoading(true)

    try {
      // Try multiple strategies to load the image
      let imageLoaded = false

      // Strategy 1: Try with crossOrigin = 'anonymous'
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout')), 10000)
          img.onload = () => {
            clearTimeout(timeout)
            resolve(img)
          }
          img.onerror = () => {
            clearTimeout(timeout)
            reject(new Error('Failed to load with CORS'))
          }
          img.src = imageUrl
        })

        imageLoaded = true
      } catch (corsError) {
        console.log('CORS failed, trying without:', (corsError as Error).message)

        // Strategy 2: Try without crossOrigin (for same-origin or permissive hosts)
        try {
          const img = new Image()

          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 10000)
            img.onload = () => {
              clearTimeout(timeout)
              resolve(img)
            }
            img.onerror = () => {
              clearTimeout(timeout)
              reject(new Error('Failed to load'))
            }
            img.src = imageUrl
          })

          imageLoaded = true
        } catch (normalError) {
          console.log('Normal loading failed:', (normalError as Error).message)

          // Strategy 3: Just accept the URL if it looks like an image
          const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i
          if (imageExtensions.test(imageUrl) || imageUrl.includes('imgur') || imageUrl.includes('giphy') || imageUrl.includes('tenor')) {
            console.log('Accepting URL based on pattern match')
            imageLoaded = true
          }
        }
      }

      if (imageLoaded) {
        // If successful, set it as the URL image
        setUrlImage(imageUrl)
        setUseUrlImage(true)
        setUseUploadedImage(false)
        setSelectedTemplate(null)
        setGeneratedMemeUrl('')

        // Reset text positions for URL image
        setTextPositions([
          { x: 50, y: 10 },
          { x: 50, y: 85 }
        ])
        setMemeTexts(['', ''])
        setTextRotations([0, 0])
      } else {
        throw new Error('Unable to load image from URL')
      }

    } catch (error) {
      console.error('Error loading image from URL:', error)
      alert('Failed to load image from URL. The image may not be publicly accessible or may have CORS restrictions. Try:\n\n• Direct image links (ending in .jpg, .png, etc.)\n• Images from imgur.com, i.redd.it, or other image hosts\n• Make sure the URL is correct and publicly accessible')
    } finally {
      setUrlLoading(false)
    }
  }, [imageUrl])

  // Update text rotation for a specific line
  const updateTextRotation = useCallback((index: number, rotation: number) => {
    setTextRotations(prev => {
      const newRotations = [...prev]
      newRotations[index] = rotation
      return newRotations
    })
  }, [])

  // Check if image is a GIF
  const isGif = useCallback((imageUrl: string): boolean => {
    return imageUrl.toLowerCase().includes('.gif') ||
           imageUrl.toLowerCase().includes('gif') ||
           (uploadedImage ? uploadedImage.startsWith('data:image/gif') : false)
  }, [uploadedImage])

  // Add watermark to canvas
  const addWatermark = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> => {
    return new Promise((resolve) => {
      const watermarkImg = new Image()
      watermarkImg.crossOrigin = 'anonymous'

      watermarkImg.onload = () => {
        // Calculate watermark size (5% of canvas width, maintaining aspect ratio)
        const watermarkWidth = canvas.width * 0.15
        const aspectRatio = watermarkImg.height / watermarkImg.width
        const watermarkHeight = watermarkWidth * aspectRatio

        // Position watermark at bottom right with 10px padding
        const x = canvas.width - watermarkWidth - 10
        const y = canvas.height - watermarkHeight - 10

        // Draw watermark with reduced opacity
        ctx.save()
        ctx.globalAlpha = 0.8
        ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight)
        ctx.restore()

        resolve()
      }

      watermarkImg.onerror = () => {
        console.warn('Failed to load watermark, continuing without it')
        resolve() // Continue even if watermark fails to load
      }

      watermarkImg.src = '/watermark.png'
    })
  }, [])


  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  // Debug effect to track font changes
  useEffect(() => {
    console.log('Font state changed to:', textFont)
  }, [textFont])

  // Handle window resize for responsive sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleResize() // Set initial size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalPages = Math.ceil(templates.length / 5)
  const hasNextPage = currentPage < totalPages - 1
  const hasPrevPage = currentPage > 0

  return (
    <div css={{
      minHeight: '100vh',
      color: '#A8540E',
      fontFamily: 'FiraCode, monospace',
      background: 'transparent',
      paddingTop: '145px'
    }}>
      <h1 css={{
        fontSize: '2rem',
        marginBottom: '0.5rem',
        textAlign: 'center',
        textShadow: '0 0 10px #BE501E',
        fontFamily: 'Nemesys, serif'
      }}>
        Tank Meme Generator
      </h1>

      {/* Single Container for Everything */}
      <div css={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0 1rem'
      }}>
        <FrameContainer width={Math.min(1400, windowSize.width - 100)} height={1000}>
          <div css={{
            width: '100%',
            height: '100%',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            overflow: 'visible',
            '@media (max-width: 1200px)': {
              gridTemplateColumns: '1fr',
              gap: '0.5rem'
            }
          }}>

            {/* Left Column - Image Selection & Text Input */}
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>

              {/* Image Upload Section */}
              <div>
                <div css={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <label css={{
                    color: '#BE501E',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    fontFamily: 'Nemesys, serif'
                  }}>
                    Image Source
                  </label>
                </div>

                <div css={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <button
                    onClick={() => {
                      setUseUploadedImage(false)
                      setUseUrlImage(false)
                      setUploadedImage(null)
                      setUrlImage(null)
                      setImageUrl('')
                      setSelectedTemplate(null)
                      setGeneratedMemeUrl('')
                      setTextRotations([0, 0])
                    }}
                    css={{
                      flex: 1,
                      padding: '0.75rem',
                      background: !useUploadedImage && !useUrlImage ? '#BE501E' : 'transparent',
                      border: '2px solid #BE501E',
                      borderRadius: '4px',
                      color: !useUploadedImage && !useUrlImage ? '#000' : '#A8540E',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#BE501E',
                        color: '#000'
                      }
                    }}
                  >
                    Browse Templates
                  </button>

                  <label css={{
                    flex: 1,
                    padding: '0.75rem',
                    background: useUploadedImage ? '#BE501E' : 'transparent',
                    border: '2px solid #BE501E',
                    borderRadius: '4px',
                    color: useUploadedImage ? '#000' : '#A8540E',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      background: '#BE501E',
                      color: '#000'
                    }
                  }}>
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      css={{ display: 'none' }}
                    />
                  </label>
                </div>

                {uploadedImage && (
                  <div css={{
                    padding: '0.5rem',
                    background: 'rgba(190, 80, 30, 0.1)',
                    border: '1px solid #BE501E',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: '#BE501E',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    ✓ Custom image uploaded successfully
                  </div>
                )}

                {/* URL Image Input Section */}
                <div css={{ marginBottom: '1rem' }}>
                  <h3 css={{
                    margin: '0 0 0.5rem 0',
                    color: '#BE501E',
                    fontSize: '1rem',
                    fontFamily: 'Nemesys, serif'
                  }}>
                    Or use an image from the web:
                  </h3>

                  <div css={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'stretch'
                  }}>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      css={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'rgba(190, 80, 30, 0.1)',
                        border: '1px solid #BE501E',
                        borderRadius: '4px',
                        color: '#A8540E',
                        fontSize: '0.9rem',
                        '&::placeholder': {
                          color: '#A8540E',
                          opacity: 0.6
                        },
                        '&:focus': {
                          outline: 'none',
                          borderColor: '#BE501E',
                          background: 'rgba(190, 80, 30, 0.15)'
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUrlImageLoad()
                        }
                      }}
                    />

                    <button
                      onClick={handleUrlImageLoad}
                      disabled={!imageUrl.trim() || urlLoading}
                      css={{
                        padding: '0.75rem 1.5rem',
                        background: imageUrl.trim() && !urlLoading ? '#BE501E' : 'transparent',
                        border: '2px solid #BE501E',
                        borderRadius: '4px',
                        color: imageUrl.trim() && !urlLoading ? '#000' : '#A8540E',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: imageUrl.trim() && !urlLoading ? 'pointer' : 'not-allowed',
                        opacity: imageUrl.trim() && !urlLoading ? 1 : 0.5,
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        '&:hover': imageUrl.trim() && !urlLoading ? {
                          background: '#A8540E',
                          color: '#fff'
                        } : {}
                      }}
                    >
                      {urlLoading ? 'Loading...' : 'Load Image'}
                    </button>
                  </div>

                  {urlImage && (
                    <div css={{
                      padding: '0.5rem',
                      background: 'rgba(190, 80, 30, 0.1)',
                      border: '1px solid #BE501E',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: '#BE501E',
                      textAlign: 'center',
                      marginTop: '0.5rem'
                    }}>
                      ✓ Image loaded from URL successfully
                    </div>
                  )}
                </div>
              </div>

              {/* Template Carousel - only show when not using uploaded image or URL image */}
              {!useUploadedImage && !useUrlImage && (
              <div>
                <div css={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <label css={{
                    color: '#BE501E',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    fontFamily: 'Nemesys, serif'
                  }}>
                    All Images ({templates.length} available)
                  </label>
                  <div css={{
                    fontSize: '0.8rem',
                    opacity: 0.7
                  }}>
                    Page {currentPage + 1} of {totalPages}
                  </div>
                </div>

                {loading ? (
                  <div css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    color: '#A8540E'
                  }}>
                    Loading all images...
                  </div>
                ) : (
                  <div css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {/* Carousel Navigation */}
                    <div css={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1rem'
                    }}>
                      <button
                        onClick={() => navigateCarousel('prev')}
                        disabled={!hasPrevPage}
                        css={{
                          padding: '0.5rem 1rem',
                          background: hasPrevPage ? '#BE501E' : 'transparent',
                          border: '2px solid #BE501E',
                          borderRadius: '4px',
                          color: hasPrevPage ? '#000' : '#A8540E',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: hasPrevPage ? 'pointer' : 'not-allowed',
                          opacity: hasPrevPage ? 1 : 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': hasPrevPage ? {
                            background: '#A8540E',
                            color: '#fff'
                          } : {}
                        }}
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => navigateCarousel('next')}
                        disabled={!hasNextPage}
                        css={{
                          padding: '0.5rem 1rem',
                          background: hasNextPage ? '#BE501E' : 'transparent',
                          border: '2px solid #BE501E',
                          borderRadius: '4px',
                          color: hasNextPage ? '#000' : '#A8540E',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: hasNextPage ? 'pointer' : 'not-allowed',
                          opacity: hasNextPage ? 1 : 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': hasNextPage ? {
                            background: '#A8540E',
                            color: '#fff'
                          } : {}
                        }}
                      >
                        Next →
                      </button>
                    </div>

                    {/* Image Grid - 5 images */}
                    <div css={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '0.5rem',
                      maxHeight: '150px'
                    }}>
                      {currentImageSet.map((template, index) => {
                        // Debug logging
                        if (index === 0) console.log('Rendering images:', currentImageSet.length, currentImageSet.map(t => t.name))
                        return (
                        <button
                          key={`${template.id}_${currentPage}_${index}`} // Ensure unique keys across pages
                          onClick={() => {
                            setSelectedTemplate(template)
                            setMemeTexts(new Array(template.lines).fill(''))
                            setGeneratedMemeUrl('')
                            // Reset text positions for new template
                            setTextPositions(
                              Array.from({ length: template.lines }, (_, index) => ({
                                x: 50,
                                y: index === 0 ? 10 : index === template.lines - 1 ? 85 : 30 + (index * 20)
                              }))
                            )
                            // Reset text rotations
                            setTextRotations(new Array(template.lines).fill(0))
                          }}
                          css={{
                            padding: '0.5rem',
                            background: selectedTemplate?.id === template.id ? '#BE501E' : 'transparent',
                            border: '2px solid #BE501E',
                            borderRadius: '4px',
                            color: selectedTemplate?.id === template.id ? '#000' : '#A8540E',
                            cursor: 'pointer',
                            fontSize: '0.6rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: '#BE501E',
                              color: '#000'
                            }
                          }}
                        >
                          <img
                            src={template.blank}
                            alt={template.name}
                            css={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                          <div css={{
                            textAlign: 'center',
                            lineHeight: 1.1,
                            fontSize: '0.55rem',
                            maxHeight: '2.2em',
                            overflow: 'hidden'
                          }}>
                            {template.name}
                          </div>
                        </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              )}


              {/* Text Inputs */}
              <div>
                <h3 css={{
                  margin: '0 0 1rem 0',
                  color: '#BE501E',
                  fontSize: '1.1rem',
                  fontFamily: 'Nemesys, serif'
                }}>
                  Meme Text {(selectedTemplate || uploadedImage || urlImage) && `(${selectedTemplate?.lines || 2} lines)`}
                </h3>

                {(selectedTemplate || uploadedImage || urlImage) ? (
                  <div css={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {Array.from({ length: selectedTemplate?.lines || 2 }, (_, index) => (
                      <div key={index}>
                        <label css={{
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontSize: '0.9rem'
                        }}>
                          Line {index + 1}:
                        </label>
                        <input
                          type="text"
                          value={memeTexts[index] || ''}
                          onChange={(e) => updateMemeText(index, e.target.value)}
                          placeholder={`Enter text for line ${index + 1}...`}
                          css={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'rgba(190, 80, 30, 0.1)',
                            border: '1px solid #BE501E',
                            borderRadius: '4px',
                            color: '#A8540E',
                            fontSize: '0.9rem',
                            '&::placeholder': {
                              color: '#A8540E',
                              opacity: 0.6
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div css={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#A8540E',
                    opacity: 0.6,
                    fontSize: '0.9rem'
                  }}>
                    Select an image to add text
                  </div>
                )}
              </div>


            </div>

            {/* Right Column - Preview & Actions */}
            <div css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              height: '100%',
              overflow: 'hidden'
            }}>

              {/* Meme Preview */}
              <div css={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h3 css={{
                  margin: '0 0 1rem 0',
                  color: '#BE501E',
                  fontSize: '1.1rem',
                  fontFamily: 'Nemesys, serif'
                }}>
                  Meme Preview
                </h3>

                <div css={{
                  width: '100%',
                  maxWidth: '400px',
                  minHeight: '250px',
                  border: '2px dashed #BE501E',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(190, 80, 30, 0.05)'
                }}>
                  {generating ? (
                    <div css={{
                      textAlign: 'center',
                      color: '#A8540E'
                    }}>
                      <div css={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                        🚀 Generating your tank meme...
                      </div>
                    </div>
                  ) : generatedMemeUrl ? (
                    <img
                      src={generatedMemeUrl}
                      alt="Generated Meme"
                      css={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '4px'
                      }}
                      onLoad={() => {
                        console.log('Meme loaded successfully:', generatedMemeUrl)
                      }}
                      onError={(e) => {
                        console.error('Error loading generated meme:', generatedMemeUrl)
                        // Try to reload the image after a short delay
                        setTimeout(() => {
                          const img = e.target as HTMLImageElement
                          if (img.src === generatedMemeUrl) {
                            img.src = generatedMemeUrl + '?t=' + Date.now()
                          }
                        }, 1000)
                      }}
                    />
                  ) : (selectedTemplate || uploadedImage || urlImage) ? (
                    <div
                      css={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isDragging !== null ? 'grabbing' : 'default',
                        userSelect: 'none'
                      }}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {/* Template, Uploaded Image, or URL Image */}
                      <img
                        src={uploadedImage || urlImage || selectedTemplate?.blank}
                        alt={uploadedImage ? 'Uploaded Image' : urlImage ? 'URL Image' : selectedTemplate?.name}
                        css={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '4px',
                          pointerEvents: 'none'
                        }}
                        onLoad={() => {
                          console.log('Preview image loaded successfully:', uploadedImage || urlImage || selectedTemplate?.blank)
                        }}
                        onError={(e) => {
                          console.error('Preview image failed to load:', uploadedImage || urlImage || selectedTemplate?.blank)
                          console.error('Error details:', e)

                          // If it's a URL image that fails, try to reload without CORS
                          if (urlImage) {
                            const img = e.target as HTMLImageElement
                            if (img.crossOrigin) {
                              console.log('Retrying without CORS...')
                              img.crossOrigin = ''
                              img.src = urlImage + '?retry=' + Date.now()
                            }
                          }
                        }}
                        crossOrigin={urlImage ? 'anonymous' : undefined}
                      />

                      {/* Text Overlays */}
                      {memeTexts.map((text, index) => {
                        if (!text.trim()) return null

                        const position = textPositions[index] || { x: 50, y: index === 0 ? 10 : 85 }
                        const rotation = textRotations[index] || 0

                        return (
                          <div
                            key={index}
                            css={{
                              position: 'absolute',
                              left: `${position.x}%`,
                              top: `${position.y}%`,
                              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                              color: textColor,
                              fontSize: `${Math.max(textSize * 0.4, 12)}px`,
                              fontFamily: (() => {
                                switch (textFont) {
                                  case 'impact': return 'Impact, Arial Black, sans-serif'
                                  case 'arial': return 'Arial, sans-serif'
                                  case 'comic': return 'Comic Sans MS, cursive'
                                  case 'times': return 'Times New Roman, serif'
                                  case 'helvetica': return 'Helvetica, Arial, sans-serif'
                                  case 'kalam': return 'Kalam, cursive'
                                  default: return 'Impact, Arial Black, sans-serif'
                                }
                              })(),
                              fontWeight: 'bold',
                              textAlign: 'center',
                              textShadow: `2px 2px 0px ${textOutlineColor}, -1px -1px 0px ${textOutlineColor}, 1px -1px 0px ${textOutlineColor}, -1px 1px 0px ${textOutlineColor}`,
                              lineHeight: 1.1,
                              maxWidth: '90%',
                              wordWrap: 'break-word',
                              letterSpacing: '1px',
                              padding: '4px 8px',
                              zIndex: 2,
                              cursor: 'grab',
                              borderRadius: '2px',
                              transition: isDragging === index ? 'none' : 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(190, 80, 30, 0.2)',
                                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(1.05)`
                              },
                              '&:active': {
                                cursor: 'grabbing'
                              }
                            }}
                            onMouseDown={(e) => handleMouseDown(index, e)}
                          >
                            {text}
                          </div>
                        )
                      })}

                      {/* Template Info */}
                      <div css={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        zIndex: 3,
                        pointerEvents: 'none'
                      }}>
                        {uploadedImage ? 'Uploaded Image' : urlImage ? 'URL Image' : selectedTemplate?.name}
                      </div>

                      {/* Drag Instructions */}
                      {memeTexts.some(text => text.trim()) && (
                        <div css={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(190, 80, 30, 0.9)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '0.6rem',
                          zIndex: 3,
                          pointerEvents: 'none'
                        }}>
                          Click & drag text to move
                        </div>
                      )}
                    </div>
                  ) : (
                    <div css={{
                      textAlign: 'center',
                      padding: '1.5rem',
                      color: '#A8540E',
                      opacity: 0.7
                    }}>
                      <div css={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                        🎯 Select an image to get started
                      </div>
                      <div css={{ fontSize: '0.85rem' }}>
                        Choose from {templates.length} available images
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Customization Controls */}
              {(selectedTemplate || uploadedImage) && (
                <div css={{
                  padding: '1.5rem'
                }}>
                  <h3 css={{
                    margin: '0 0 1rem 0',
                    color: '#BE501E',
                    fontSize: '1.1rem',
                    fontFamily: 'Nemesys, serif'
                  }}>
                    Text Customization
                  </h3>

                  <div css={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    '@media (max-width: 768px)': {
                      gridTemplateColumns: '1fr'
                    }
                  }}>
                    {/* Font Selection */}
                    <div>
                      <label css={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#A8540E'
                      }}>
                        Font:
                      </label>
                      <button
                        onClick={() => setShowFontPicker(!showFontPicker)}
                        css={{
                          width: '100%',
                          padding: '0.5rem',
                          background: 'rgba(190, 80, 30, 0.1)',
                          border: '1px solid #BE501E',
                          borderRadius: '4px',
                          color: '#A8540E',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          '&:hover': {
                            background: 'rgba(190, 80, 30, 0.2)'
                          }
                        }}
                      >
                        <span css={{
                          fontFamily: (() => {
                            switch (textFont) {
                              case 'impact': return 'Impact, Arial Black, sans-serif'
                              case 'arial': return 'Arial, sans-serif'
                              case 'comic': return 'Comic Sans MS, cursive'
                              case 'times': return 'Times New Roman, serif'
                              case 'helvetica': return 'Helvetica, Arial, sans-serif'
                              case 'kalam': return 'Kalam, cursive'
                              default: return 'Impact, Arial Black, sans-serif'
                            }
                          })()
                        }}>
                          {textFont.charAt(0).toUpperCase() + textFont.slice(1)}
                        </span>
                        <span>{showFontPicker ? '▲' : '▼'}</span>
                      </button>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label css={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#A8540E'
                      }}>
                        Text Color:
                      </label>
                      <div css={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          css={{
                            width: '40px',
                            height: '32px',
                            border: '1px solid #BE501E',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: 'none'
                          }}
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          css={{
                            flex: 1,
                            padding: '0.5rem',
                            background: 'rgba(190, 80, 30, 0.1)',
                            border: '1px solid #BE501E',
                            borderRadius: '4px',
                            color: '#A8540E',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Outline Color */}
                    <div>
                      <label css={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#A8540E'
                      }}>
                        Outline Color:
                      </label>
                      <div css={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={textOutlineColor}
                          onChange={(e) => setTextOutlineColor(e.target.value)}
                          css={{
                            width: '40px',
                            height: '32px',
                            border: '1px solid #BE501E',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: 'none'
                          }}
                        />
                        <input
                          type="text"
                          value={textOutlineColor}
                          onChange={(e) => setTextOutlineColor(e.target.value)}
                          css={{
                            flex: 1,
                            padding: '0.5rem',
                            background: 'rgba(190, 80, 30, 0.1)',
                            border: '1px solid #BE501E',
                            borderRadius: '4px',
                            color: '#A8540E',
                            fontSize: '0.8rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Text Size */}
                    <div>
                      <label css={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#A8540E'
                      }}>
                        Text Size: {textSize}px
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        css={{
                          width: '100%',
                          height: '4px',
                          background: 'rgba(190, 80, 30, 0.3)',
                          borderRadius: '2px',
                          outline: 'none',
                          cursor: 'pointer',
                          '&::-webkit-slider-thumb': {
                            appearance: 'none',
                            width: '16px',
                            height: '16px',
                            background: '#BE501E',
                            borderRadius: '50%',
                            cursor: 'pointer'
                          },
                          '&::-moz-range-thumb': {
                            width: '16px',
                            height: '16px',
                            background: '#BE501E',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: 'none'
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Text Rotation Controls */}
                  <div css={{ marginTop: '1rem' }}>
                    <label css={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#A8540E'
                    }}>
                      Text Rotation:
                    </label>

                    <div css={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(selectedTemplate?.lines || 2, 4)}, 1fr)`,
                      gap: '0.5rem'
                    }}>
                      {Array.from({ length: selectedTemplate?.lines || 2 }, (_, index) => (
                        <div key={index}>
                          <label css={{
                            display: 'block',
                            marginBottom: '0.25rem',
                            fontSize: '0.8rem',
                            color: '#A8540E'
                          }}>
                            Line {index + 1}: {textRotations[index] || 0}°
                          </label>
                          <input
                            type="range"
                            min="-45"
                            max="45"
                            value={textRotations[index] || 0}
                            onChange={(e) => updateTextRotation(index, Number(e.target.value))}
                            css={{
                              width: '100%',
                              height: '3px',
                              background: 'rgba(190, 80, 30, 0.3)',
                              borderRadius: '2px',
                              outline: 'none',
                              cursor: 'pointer',
                              '&::-webkit-slider-thumb': {
                                appearance: 'none',
                                width: '12px',
                                height: '12px',
                                background: '#BE501E',
                                borderRadius: '50%',
                                cursor: 'pointer'
                              },
                              '&::-moz-range-thumb': {
                                width: '12px',
                                height: '12px',
                                background: '#BE501E',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                border: 'none'
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div css={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <button
                  onClick={generateMeme}
                  disabled={(!selectedTemplate && !uploadedImage && !urlImage) || generating}
                  css={{
                    padding: '0.75rem 1.5rem',
                    background: '#BE501E',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#000',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: (selectedTemplate || uploadedImage || urlImage) && !generating ? 'pointer' : 'not-allowed',
                    opacity: (selectedTemplate || uploadedImage || urlImage) && !generating ? 1 : 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': (selectedTemplate || uploadedImage || urlImage) && !generating ? {
                      background: '#A8540E',
                      color: '#fff',
                      transform: 'translateY(-2px)'
                    } : {}
                  }}
                >
                  {generating ? 'Generating...' : 'Generate Tank Meme'}
                </button>

                {generatedMemeUrl && (
                  <>
                    <button
                      onClick={downloadMeme}
                      css={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: '2px solid #BE501E',
                        borderRadius: '4px',
                        color: '#A8540E',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: '#BE501E',
                          color: '#000',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Download
                    </button>

                    <button
                      onClick={shareToX}
                      css={{
                        padding: '0.75rem 1.5rem',
                        background: '#000000',
                        border: '2px solid #000000',
                        borderRadius: '4px',
                        color: '#FFFFFF',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        '&:hover': {
                          background: '#333333',
                          borderColor: '#333333',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Share to X
                    </button>

                    <button
                      onClick={shareMeme}
                      css={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: '2px solid #BE501E',
                        borderRadius: '4px',
                        color: '#A8540E',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: '#BE501E',
                          color: '#000',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Share
                    </button>
                  </>
                )}
              </div>

              {/* Status Info */}
              {(selectedTemplate || uploadedImage || urlImage) && (
                <div css={{
                  padding: '1rem',
                  background: 'rgba(190, 80, 30, 0.1)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: '#A8540E'
                }}>
                  <div><strong>Selected Image:</strong> {uploadedImage ? 'Custom Upload' : urlImage ? 'URL Image' : selectedTemplate?.name}</div>
                  {urlImage && <div><strong>URL:</strong> {urlImage}</div>}
                  <div><strong>Lines:</strong> {selectedTemplate?.lines || 2}</div>
                  <div><strong>Current Text:</strong> {memeTexts.join(' | ') || 'None'}</div>
                </div>
              )}
            </div>
          </div>
        </FrameContainer>
      </div>

      {/* Font Picker Popup Modal */}
      {showFontPicker && (
        <div
          css={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFontPicker(false)
            }
          }}
        >
          <div css={{
            background: 'rgba(20, 20, 20, 0.95)',
            border: '3px solid #BE501E',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 10px 40px rgba(190, 80, 30, 0.5)',
            backdropFilter: 'blur(10px)'
          }}>
            <div css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 css={{
                color: '#BE501E',
                fontSize: '1.5rem',
                fontFamily: 'Nemesys, serif',
                margin: 0
              }}>
                Choose Font
              </h3>
              <button
                onClick={() => setShowFontPicker(false)}
                css={{
                  background: 'transparent',
                  border: '2px solid #BE501E',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: '#BE501E',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: '#BE501E',
                    color: '#000'
                  }
                }}
              >
                ×
              </button>
            </div>

            <div css={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {[
                { value: 'impact', name: 'Impact', fontFamily: 'Impact, Arial Black, sans-serif', example: 'Tank Bank Meme' },
                { value: 'arial', name: 'Arial', fontFamily: 'Arial, sans-serif', example: 'Tank Bank Meme' },
                { value: 'comic', name: 'Comic Sans', fontFamily: 'Comic Sans MS, cursive', example: 'Tank Bank Meme' },
                { value: 'times', name: 'Times New Roman', fontFamily: 'Times New Roman, serif', example: 'Tank Bank Meme' },
                { value: 'helvetica', name: 'Helvetica', fontFamily: 'Helvetica, Arial, sans-serif', example: 'Tank Bank Meme' },
                { value: 'kalam', name: 'Kalam', fontFamily: 'Kalam, cursive', example: 'Tank Bank Meme' }
              ].map((font) => (
                <button
                  key={font.value}
                  onClick={() => {
                    console.log('Font changed to:', font.value)
                    setTextFont(font.value)
                    setShowFontPicker(false)
                  }}
                  css={{
                    padding: '1.5rem',
                    background: textFont === font.value ? '#BE501E' : 'rgba(190, 80, 30, 0.1)',
                    border: '2px solid #BE501E',
                    borderRadius: '8px',
                    color: textFont === font.value ? '#000' : '#A8540E',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    minHeight: '120px',
                    justifyContent: 'center',
                    '&:hover': {
                      background: '#BE501E',
                      color: '#000',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(190, 80, 30, 0.4)'
                    }
                  }}
                >
                  <div css={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    opacity: 0.8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {font.name}
                  </div>
                  <div css={{
                    fontSize: '1.3rem',
                    fontFamily: font.fontFamily,
                    fontWeight: 'bold',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                    lineHeight: 1.2
                  }}>
                    {font.example}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemeGeneratorPage