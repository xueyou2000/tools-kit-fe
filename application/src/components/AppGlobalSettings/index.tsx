import { IconButton } from '@radix-ui/themes'
import * as Popover from '@radix-ui/react-popover'
import { MixerHorizontalIcon, ChevronUpIcon } from '@radix-ui/react-icons'

import { ThemeSwitch } from '../ThemeSwitch'

import './index.scss'

export function AppGlobalSettings() {
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
            <IconButton className='settings-item scroll-top' onClick={handleScrollToTop} title='返回顶部'>
              <ChevronUpIcon width='18' height='18' />
            </IconButton>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
