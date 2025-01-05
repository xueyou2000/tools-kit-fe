import { RouteObject } from 'react-router'

import { LoadingFallback, ErrorBoundary } from '@/components'
import { Layout } from '@/components/Layout'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    HydrateFallback: LoadingFallback,
    children: [
      {
        index: true,
        lazy: () => import(/* webpackChunkName: "ToolsGallery" */ '../pages/ToolsGallery')
      },
      {
        path: 'develop',
        children: [
          {
            path: 'js-formatter',
            lazy: () => import(/* webpackChunkName: "JsFormatter" */ '../pages/Develop/JsFormatter')
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <ErrorBoundary pageNotFound />,
    HydrateFallback: LoadingFallback
  }
]
