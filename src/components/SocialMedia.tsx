

import { type ReactElement, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

const SocialMedia = (): ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  // Determine if this page should have scrolling SocialMedia on mobile
  const isScrollingPage = ['/comms', '/operations', '/settings'].includes(location.pathname)
  const mobilePosition = isMobile && isScrollingPage ? 'static' : 'fixed'

  return (
    <ul css={{
      position: mobilePosition,
      '@media (min-width: 769px)': {
        position: 'fixed', // Always fixed on desktop
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
      },
      ...(mobilePosition === 'static' ? {
        // When static, center it normally and add margin
        marginTop: '2rem',
        marginBottom: '4rem',
        justifyContent: 'center',
      } : {
        // When fixed, use viewport positioning
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
      }),
      margin: 0,
      padding: 0,
      display: 'flex',
      zIndex: 20,
      '@media (max-width: 768px)': {
        bottom: '1rem',
        gap: '0.5rem'
      },

      '& li': {
        listStyle: 'none',

        '& a': {
          display: 'block',
          position: 'relative',
          width: '60px',
          height: '60px',
          lineHeight: '60px',
          fontSize: '24px',
          textAlign: 'center',
          textDecoration: 'none',
          color: '#BE501E',
          margin: '0 15px',
          transition: '.5s',
          '@media (max-width: 768px)': {
            width: '48px',
            height: '48px',
            lineHeight: '48px',
            fontSize: '20px',
            margin: '0 8px'
          },

          '& span': {
            position: 'absolute',
            transition: 'transform .5s',
          },

          '& span:nth-of-type(1), & span:nth-of-type(3)': {
            width: '100%',
            height: '2px',
            background: '#BE501E',
          },

          '& span:nth-of-type(1)': {
            top: 0,
            left: 0,
            transformOrigin: 'right',
          },

          '&:hover span:nth-of-type(1)': {
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform .5s',
          },

          '& span:nth-of-type(3)': {
            bottom: 0,
            left: 0,
            transformOrigin: 'left',
          },

          '&:hover span:nth-of-type(3)': {
            transform: 'scaleX(0)',
            transformOrigin: 'right',
            transition: 'transform .5s',
          },

          '& span:nth-of-type(2), & span:nth-of-type(4)': {
            width: '2px',
            height: '100%',
            background: '#BE501E',
          },

          '& span:nth-of-type(2)': {
            top: 0,
            left: 0,
            transform: 'scale(0)',
            transformOrigin: 'bottom',
          },

          '&:hover span:nth-of-type(2)': {
            transform: 'scale(1)',
            transformOrigin: 'top',
            transition: 'transform .5s',
          },

          '& span:nth-of-type(4)': {
            top: 0,
            right: 0,
            transform: 'scale(0)',
            transformOrigin: 'top',
          },

          '&:hover span:nth-of-type(4)': {
            transform: 'scale(1)',
            transformOrigin: 'bottom',
            transition: 'transform .5s',
          },
        },


        '&.x a:hover': {
          color: '#000000',
          '& span': {
            background: '#000000',
          },
        },

        '&.pumpfun a': {
          color: '#BE501E', // Amber color to match X
          '& span': {
            background: '#BE501E', // Amber border color
          },
        },

        '&.pumpfun a:hover': {
          color: '#000000',
          '& span': {
            background: '#000000',
          },
        },

        '&.whitepaper a': {
          color: '#BE501E',
          '& span': {
            background: '#BE501E',
          },
        },

        '&.whitepaper a:hover': {
          color: '#000000',
          '& span': {
            background: '#000000',
          },
        },

        /* '&.instagram a:hover': {
          color: '#c32aa3',
          '& span': {
            background: '#c32aa3',
          },
        },

        '&.discord a:hover': {
          color: '#7289da',
          '& span': {
            background: '#7289da',
          },
        }, */
      },
    }}>
      <li className="x">
        <a href="https://x.com/TankBankSol">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            css={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </li>
      <li className="pumpfun">
        <a href="https://pump.fun/coin/5Z1urJyhqPNnrJA63M8bTUmL2ghXxNGgnB7n7FRpump" target="_blank" rel="noopener noreferrer">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 1200 617"
            fill="currentColor"
            css={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          >
            <g transform="matrix(1,0,0,1,-150,-441.847)">
              <g transform="matrix(0.85503,0,0,0.85503,96.4439,391.031)">
                <g transform="matrix(1.10354,0,0,1.19597,-99.4781,-100.479)">
                  <path d="m 548.17227,226.32319 -215.0213,198.40345 c -127.1711,117.34267 -127.1706,307.87787 7e-4,425.22082 127.1713,117.34296 333.66455,117.34264 460.83558,-4e-5 L 1009.0085,651.54397 c 1.682,-0.93257 3.2677,-2.06756 4.7172,-3.4051 1.4489,-1.33689 2.6789,-2.79998 3.6896,-4.35198 l 215.0248,-198.40671 c 127.1661,-117.33811 127.1643,-307.87064 -0.01,-425.213587 -127.1713,-117.34296 -333.6632,-117.34531 -460.82928,-0.007 L 556.57897,218.56611 c -1.6819,0.93257 -3.2676,2.06756 -4.7164,3.40445 -1.4496,1.33754 -2.6797,2.80063 -3.6903,4.35263 z m 412.97752,405.32963 -201.8705,186.26903 c -108.0148,99.66693 -283.40392,99.6671 -391.41932,-3e-4 -108.0161,-99.66812 -108.0159,-261.50241 0,-361.16934 L 569.72941,270.48318 Z M 604.43774,238.45726 806.31178,52.184973 c 108.01056,-99.66302 283.40042,-99.66384 391.41652,0.004 108.0153,99.667407 108.0144,261.502347 0,361.165367 L 995.85813,599.6269 Z"/>
                </g>
              </g>
            </g>
          </svg>
        </a>
      </li>
      <li className="whitepaper">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/whitepaper')
          }}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            css={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </a>
      </li>

      {/* Settings Gear - Only on Mobile */}
      {isMobile && (
        <li className="settings">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate('/settings')
            }}
            css={{
              '& span': {
                display: 'none !important', // Hide all border spans
              },
              '&:hover': {
                color: '#000000 !important',
              }
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              css={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                transition: 'all 0.3s ease',
                'a:hover &': {
                  transform: 'translate(-50%, -50%) rotate(90deg)',
                }
              }}
            >
              <path
                d="M12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5Z"
                fill="currentColor"
              />
              <path
                d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.72 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98ZM12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </li>
      )}
    </ul>
  )
}

export default SocialMedia