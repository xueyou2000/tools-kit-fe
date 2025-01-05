import PageHeader from '@/components/PageHeader'
import { useAppContext } from '@/context/AppContext'
import { CodeIcon, CopyIcon, EraserIcon } from '@radix-ui/react-icons'
import { Blockquote, Box, Card, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CodeEditor } from './components/CodeEditor'
import { FormatOptionsPanel } from './components/FormatOptions'
import { defaultOptions, FormatOptions, SupportedLanguage } from './constants'
import { languageRegistry, registerAll } from './languages'
import { FormatterService } from './services/FormatterService'
import { ProcessorProvider } from './context/ProcessorContext'

registerAll()

import './index.scss'

export default function CodeFormatter() {
  const [code, setCode] = useState('')
  const [options, setOptions] = useState<FormatOptions>(defaultOptions)
  const { theme } = useAppContext()

  const currentProcessor = useMemo(() => {
    return languageRegistry.getProcessor(options.language)
  }, [options.language])

  const handleCodeChange = useCallback(
    (newCode: string, detectedLanguage: SupportedLanguage) => {
      setCode(newCode)
      if (detectedLanguage !== options.language) {
        setOptions((prev) => ({ ...prev, language: detectedLanguage }))
        toast.success(`已自动切换到 ${detectedLanguage} 代码`)
      }
    },
    [options.language]
  )

  const handleCopy = useCallback(() => {
    if (!code) return

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
    if (!code) return

    try {
      const formatted = await FormatterService.format(code, options)
      setCode(formatted)
      toast.success('格式化成功')
    } catch (error) {
      console.error('Format failed:', error)
      toast.error('格式化失败', {
        description: error instanceof Error ? error.message : '未知错误'
      })
    }
  }, [code, options])

  const handleClear = useCallback(() => {
    if (!code) return
    setCode('')
    toast.success('已清空')
  }, [code])

  return (
    <ProcessorProvider currentProcessor={currentProcessor}>
      <Flex direction='column' className='js-formatter-page'>
        <PageHeader title='代码格式化工具' />
        <Flex p='4' direction='column' gap='4' className='js-formatter-content'>
          <Box>
            <Blockquote size='1'>你可以黏贴代码，会自动识别语言</Blockquote>
          </Box>

          <Card size='2'>
            <Box className='format-options'>
              <Text as='p' size='2' weight='medium' mb='2'>
                格式化选项
              </Text>
              <FormatOptionsPanel options={options} onChange={setOptions} />
            </Box>
          </Card>

          <Card size='2'>
            <Flex justify='between' align='center' mb='4' className='editor-header'>
              <Text size='3' weight='medium'>
                请输入{currentProcessor?.name}代码
              </Text>
              <Flex gap='4'>
                <Tooltip content='清空编辑器'>
                  <IconButton size='2' variant='ghost' onClick={handleClear}>
                    <EraserIcon width={18} height={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip content='格式化代码'>
                  <IconButton size='2' variant='ghost' onClick={handleFormat}>
                    <CodeIcon width={18} height={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip content='复制代码'>
                  <IconButton size='2' variant='ghost' onClick={handleCopy}>
                    <CopyIcon width={18} height={18} />
                  </IconButton>
                </Tooltip>
              </Flex>
            </Flex>
            <div className='editor-wrapper'>
              <CodeEditor code={code} language={options.language} theme={theme} onChange={handleCodeChange} />
            </div>
          </Card>
        </Flex>
      </Flex>
    </ProcessorProvider>
  )
}

export const element = <CodeFormatter />
