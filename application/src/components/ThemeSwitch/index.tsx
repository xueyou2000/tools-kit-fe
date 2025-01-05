import { useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'

import './style.scss'

export function ThemeSwitch() {
  const { theme, setTheme } = useAppContext()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return (
    <button className="theme-switch settings-item" onClick={toggleTheme} title="切换主题">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
