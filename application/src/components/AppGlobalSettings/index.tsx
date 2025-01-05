import { IconButton } from '@radix-ui/themes'
import * as Popover from '@radix-ui/react-popover'
import { MixerHorizontalIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

import { ThemeSwitch } from '../ThemeSwitch'

import './index.scss'

export function AppGlobalSettings() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className='app-global-settings'>
      <Popover.Root>
        <Popover.Trigger asChild>
          <IconButton className='settings-trigger settings-item' title='设置'>
            <MixerHorizontalIcon width='18' height='18' />
          </IconButton>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className='settings-content' side='top' sideOffset={2}>
            <ThemeSwitch />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <IconButton className='settings-item scroll-top' onClick={handleScrollToTop} title='返回顶部' data-show={showScrollTop}>
        <ChevronUpIcon width='18' height='18' />
      </IconButton>
    </div>
  )
}
