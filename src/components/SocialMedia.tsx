

import { type ReactElement } from 'react'

const SocialMedia = (): ReactElement => {
  return (
    <ul css={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
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
          color: '#A8540E',
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
            background: '#A8540E',
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
            background: '#A8540E',
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

        '&.github a:hover': {
          color: '#000000',
          '& span': {
            background: '#000000',
          },
        },

        '&.x a:hover': {
          color: '#000000',
          '& span': {
            background: '#000000',
          },
        },

        '&.pumpfun a:hover': {
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
      <li className="github">
        <a href="#">
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
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </li>
      <li className="x">
        <a href="#">
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
        <a href="#">
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
      {/* <li className="instagram">
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <i className="fa fa-instagram" aria-hidden="true">I</i>
        </a>
      </li>
      <li className="discord">
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <i className="fa fa-discord" aria-hidden="true">D</i>
        </a>
      </li> */}
    </ul>
  )
}

export default SocialMedia