import { StrictMode, useLayoutEffect, memo } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Theme } from '@radix-ui/themes'

import { assetPrefix } from '@/constants/env'
import { routes } from '@/routes/routes'
import { useAppContext } from '@/context/AppContext'
import { AppGlobalSettings } from '@/components'

import '@radix-ui/themes/styles.css'
import '@/assets/styles/reset.scss'
import '@/assets/styles/themes/index.scss'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useAppContext()
  return (
    <Theme appearance={theme} accentColor="cyan" grayColor="gray" scaling="100%">
      {children}
    </Theme>
  )
}

// 使用 memo 包裹路由组件，避免主题变化导致路由重新渲染
const MemoizedRouter = memo(function MemoizedRouter({ basename }: { basename: string }) {
  const router = createBrowserRouter(routes, { basename })
  return <RouterProvider router={router} />
})

export function App() {
  const { initializeTheme } = useAppContext()

  useLayoutEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return (
    <StrictMode>
      <AppGlobalSettings />
      <ThemeProvider>
        <MemoizedRouter basename={assetPrefix} />
      </ThemeProvider>
    </StrictMode>
  )
}
