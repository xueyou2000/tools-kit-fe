import { Suspense, memo } from 'react'
import { Outlet } from 'react-router'
import { LoadingFallback } from '@/components'

export const Layout = memo(function Layout() {
  return (
    <Suspense fallback={<LoadingFallback text="页面加载中..." />}>
      <Outlet />
    </Suspense>
  )
})
