import { useState, useCallback, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { Flex, Card, Text, IconButton, Box, Tooltip, Select } from '@radix-ui/themes'
import { toast } from 'sonner'
import { CopyIcon, CodeIcon } from '@radix-ui/react-icons'
import { placeholder } from '@codemirror/view'
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode'
import { useAppContext } from '@/context/AppContext'
import prettier from 'prettier'
import * as babel from 'prettier/plugins/babel'
import * as estree from 'prettier/plugins/estree'

import PageHeader from '@/components/PageHeader'

import './index.scss'

interface FormatOptions {
  indent: string
  maxLineLength: string
  braceStyle: 'collapse' | 'expand' | 'end-expand'
  semi: boolean
  singleQuote: boolean
  trailingComma: 'none' | 'es5' | 'all'
  arrowParens: 'avoid' | 'always'
  jsxSingleQuote: boolean
  quoteProps: 'as-needed' | 'consistent' | 'preserve'
}

const defaultOptions: FormatOptions = {
  indent: '2space',
  maxLineLength: '80',
  braceStyle: 'collapse',
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  jsxSingleQuote: false,
  quoteProps: 'as-needed'
}

export default function JsFormatter() {
  const [code, setCode] = useState('')
  const [options, setOptions] = useState<FormatOptions>(defaultOptions)
  const { theme } = useAppContext()

  const editorExtensions = useMemo(() => [javascript({ jsx: true }), placeholder('在这里输入要格式化的代码')], [])

  const handleCodeChange = useCallback((value: string) => {
    setCode(value)
  }, [])

  const handleCopy = useCallback(() => {
    try {
      if (navigator.clipboard && code) {
        navigator.clipboard.writeText(code)
        toast.success('代码已复制到剪贴板')
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = code
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        toast.success('代码已复制到剪贴板')
      }
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('复制失败，请手动复制代码')
    }
  }, [code])

  const handleFormat = useCallback(async () => {
    try {
      const formatted = await prettier.format(code, {
        parser: 'babel',
        plugins: [babel, estree],
        printWidth: options.maxLineLength === 'no' ? 9999 : Number(options.maxLineLength),
        useTabs: options.indent === 'tab',
        tabWidth: Number(options.indent.replace('space', '') || 2),
        bracketSameLine: options.braceStyle === 'collapse',
        semi: options.semi,
        singleQuote: options.singleQuote,
        trailingComma: options.trailingComma,
        arrowParens: options.arrowParens,
        jsxSingleQuote: options.jsxSingleQuote,
        quoteProps: options.quoteProps
      })
      setCode(formatted)
      toast.success('格式化成功')
    } catch (error) {
      console.error('Format failed:', error)
      toast.error('格式化失败', {
        description: error instanceof Error ? error.message : '未知错误'
      })
    }
  }, [code, options])

  return (
    <Flex direction='column' className='js-formatter-page'>
      <PageHeader title='JS 格式化工具' />
      <Flex p='4' direction='column' gap='4' className='js-formatter-content'>
        <Card size='2'>
          <Box className='format-options'>
            <Text as='p' size='2' weight='medium' mb='2'>
              JavaScript 格式化选项
            </Text>
            <Flex gap='4' wrap='wrap'>
              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  缩进方式
                </Text>
                <Select.Root value={options.indent} onValueChange={(value) => setOptions((prev) => ({ ...prev, indent: value }))}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='tab'>Tab 缩进</Select.Item>
                    <Select.Item value='2space'>2 个空格</Select.Item>
                    <Select.Item value='4space'>4 个空格</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  换行长度
                </Text>
                <Select.Root
                  value={options.maxLineLength}
                  onValueChange={(value) => setOptions((prev) => ({ ...prev, maxLineLength: value }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='no'>不换行</Select.Item>
                    <Select.Item value='80'>80 字符换行</Select.Item>
                    <Select.Item value='120'>120 字符换行</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  大括号位置
                </Text>
                <Select.Root
                  value={options.braceStyle}
                  onValueChange={(value: 'collapse' | 'expand' | 'end-expand') => setOptions((prev) => ({ ...prev, braceStyle: value }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='collapse'>同一行</Select.Item>
                    <Select.Item value='expand'>新起一行</Select.Item>
                    <Select.Item value='end-expand'>混合风格</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  分号
                </Text>
                <Select.Root
                  value={options.semi.toString()}
                  onValueChange={(value) => setOptions((prev) => ({ ...prev, semi: value === 'true' }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='true'>添加分号</Select.Item>
                    <Select.Item value='false'>不添加分号</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  引号样式
                </Text>
                <Select.Root
                  value={options.singleQuote.toString()}
                  onValueChange={(value) => setOptions((prev) => ({ ...prev, singleQuote: value === 'true' }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='true'>单引号</Select.Item>
                    <Select.Item value='false'>双引号</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  尾随逗号
                </Text>
                <Select.Root
                  value={options.trailingComma}
                  onValueChange={(value: 'none' | 'es5' | 'all') => setOptions((prev) => ({ ...prev, trailingComma: value }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='none'>不使用</Select.Item>
                    <Select.Item value='es5'>ES5 语法</Select.Item>
                    <Select.Item value='all'>所有位置</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  箭头函数参数
                </Text>
                <Select.Root
                  value={options.arrowParens}
                  onValueChange={(value: 'avoid' | 'always') => setOptions((prev) => ({ ...prev, arrowParens: value }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='avoid'>单参数不加括号</Select.Item>
                    <Select.Item value='always'>总是加括号</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  JSX 引号
                </Text>
                <Select.Root
                  value={options.jsxSingleQuote.toString()}
                  onValueChange={(value) => setOptions((prev) => ({ ...prev, jsxSingleQuote: value === 'true' }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='true'>单引号</Select.Item>
                    <Select.Item value='false'>双引号</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  对象属性引号
                </Text>
                <Select.Root
                  value={options.quoteProps}
                  onValueChange={(value: 'as-needed' | 'consistent' | 'preserve') => setOptions((prev) => ({ ...prev, quoteProps: value }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='as-needed'>按需添加</Select.Item>
                    <Select.Item value='consistent'>保持一致</Select.Item>
                    <Select.Item value='preserve'>保持原样</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>
          </Box>
        </Card>

        <Card size='2'>
          <Flex justify='between' align='center' mb='4' className='editor-header'>
            <Text size='3' weight='medium'>
              请输入 JS 代码
            </Text>
            <Flex gap='4'>
              <Tooltip content='格式化代码'>
                <IconButton size='2' variant='ghost' onClick={handleFormat} aria-label='格式化代码'>
                  <CodeIcon width={18} height={18} />
                </IconButton>
              </Tooltip>
              <Tooltip content='复制代码'>
                <IconButton size='2' variant='ghost' onClick={handleCopy} aria-label='复制代码'>
                  <CopyIcon width={18} height={18} />
                </IconButton>
              </Tooltip>
            </Flex>
          </Flex>
          <div className='editor-wrapper'>
            <CodeMirror
              value={code}
              height='100%'
              width='100%'
              theme={theme === 'dark' ? vscodeDark : vscodeLight}
              extensions={editorExtensions}
              onChange={handleCodeChange}
            />
          </div>
        </Card>
      </Flex>
    </Flex>
  )
}

export const element = <JsFormatter />
