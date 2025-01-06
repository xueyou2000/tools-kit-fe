import { Grid, Card, Heading, Link, Text, Flex, Avatar, Box } from '@radix-ui/themes'
import { Link as RouterLink } from 'react-router'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { core } from '@tauri-apps/api'
import { open } from '@tauri-apps/plugin-shell'

import { toolsConfig } from '@/constants/tools-config'

import './index.scss'

export default function ToolsGallery() {
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()

    const x = ((clientX - left) / width) * 100
    const y = ((clientY - top) / height) * 100

    const el = currentTarget as HTMLElement
    el.style.setProperty('--mouse-x', `${x}%`)
    el.style.setProperty('--mouse-y', `${y}%`)
  }

  const handleLinkClick = async (url: string) => {
    open(url)
  }

  return (
    <div className='tools-gallery-page' onMouseMove={handleMouseMove}>
      <Heading size='8' mb='4' className='page-title'>
        ToolsKit 工具大全
      </Heading>
      <Text size='3' mb='6' color='gray' as='div'>
        <div>
          ToolsKit 是一个开源的在线工具集合平台，集成了常用的开发工具、文本处理、格式转换等实用功能。 项目完全开源，欢迎在{' '}
          {core.isTauri() ? (
            <span
              onClick={() => handleLinkClick('https://github.com/xueyou2000/tools-kit-fe')}
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
              GitHub
            </span>
          ) : (
            <Link href='https://github.com/xueyou2000/tools-kit-fe' target='_blank'>
              GitHub
            </Link>
          )}
          上查看源码、提出建议或贡献代码。
        </div>
        <div style={{ marginTop: '1rem' }}>主要功能包括：</div>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>代码格式化（支持 JSON、JavaScript、HTML 等）</li>
          <li>文本编码转换</li>
          <li>时间戳转换</li>
          <li>更多工具持续添加中...</li>
        </ul>
      </Text>
      <Box>
        {Object.entries(toolsConfig).map(([key, value]) => (
          <Card key={key} className='tools-gallery-card' size='4'>
            <Heading as='h2' size='5' mb='3'>
              {value.name}
            </Heading>
            <Grid columns='repeat(auto-fit, minmax(min(100%, 400px), 1fr))' gap='4' className='tools-list'>
              {value.list.map((tool) => (
                <Link key={tool.name} asChild className='tool-link'>
                  <RouterLink to={tool.url} viewTransition>
                    <Card className='tool-item'>
                      <Flex align='center' justify='between'>
                        <Flex gap='2' align='center'>
                          <Avatar size='2' src={tool.icon} fallback='🛠️' className='tool-icon' />
                          <Text size='2'>{tool.name}</Text>
                        </Flex>
                        <ArrowRightIcon className='arrow-icon' />
                      </Flex>
                    </Card>
                  </RouterLink>
                </Link>
              ))}
            </Grid>
          </Card>
        ))}
      </Box>
    </div>
  )
}

export const element = <ToolsGallery />
