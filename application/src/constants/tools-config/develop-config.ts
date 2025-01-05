import { ToolConfig } from './types'

import jsFormatterIcon from '@/assets/images/tool-icons/js-formatter.png'

export const developConfig: ToolConfig[] = [
  {
    name: '代码格式化',
    category: 'develop',
    icon: jsFormatterIcon,
    url: '/develop/code-formatter'
  }
  // {
  //   name: 'JavaScript代码混淆/解析',
  //   category: 'develop',
  //   icon: jsFormatterIcon,
  //   url: '/develop/css-formatter'
  // },
]
