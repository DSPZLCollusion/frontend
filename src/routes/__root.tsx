import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import appCss from '../styles.css?url'
import Navbar from '../components/Navbar'
import MobileNavbar from '#/components/MobileNavbar'
import { queryClient } from '../util/http'
import { AuthProvider } from '#/util/auth'

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}

function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 – Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'DSPZL Collusion',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  const isMobile = useIsMobile()

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <Outlet />
      </QueryClientProvider>
    </AuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="modal" />
        {children}
        {/* <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  )
}
