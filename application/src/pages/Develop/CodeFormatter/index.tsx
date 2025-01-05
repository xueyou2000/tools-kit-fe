/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'
import { sass } from '@codemirror/lang-sass'
import { Flex, Card, Text, IconButton, Box, Tooltip, Select, Blockquote } from '@radix-ui/themes'
import { toast } from 'sonner'
import { CopyIcon, CodeIcon, EraserIcon } from '@radix-ui/react-icons'
import { placeholder, EditorView } from '@codemirror/view'
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode'
import { useAppContext } from '@/context/AppContext'
import prettier from 'prettier'
import * as babel from 'prettier/plugins/babel'
import * as estree from 'prettier/plugins/estree'
import * as postcss from 'prettier/plugins/postcss'
import * as typescript from 'prettier/plugins/typescript'
import { LanguageDescription } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import * as htmlParser from 'prettier/plugins/html'

import PageHeader from '@/components/PageHeader'

import './index.scss'

type SupportedLanguage = 'javascript' | 'typescript' | 'css' | 'scss' | 'json' | 'html'

interface FormatOptions {
  language: SupportedLanguage
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
  language: 'javascript',
  indent: '2space',
  maxLineLength: '120',
  braceStyle: 'collapse',
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  jsxSingleQuote: false,
  quoteProps: 'as-needed'
}

const LANGUAGE_CONFIG = {
  javascript: {
    title: 'JavaScript 代码',
    showBraceStyle: true,
    showSemi: true,
    showQuoteStyle: true,
    showTrailingComma: true,
    showArrowParens: true,
    showJsxQuote: true,
    showQuoteProps: true
  },
  typescript: {
    title: 'TypeScript 代码',
    showBraceStyle: true,
    showSemi: true,
    showQuoteStyle: true,
    showTrailingComma: true,
    showArrowParens: true,
    showJsxQuote: true,
    showQuoteProps: true
  },
  css: {
    title: 'CSS 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: false,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  },
  scss: {
    title: 'SCSS 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: false,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  },
  json: {
    title: 'JSON 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: false,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  },
  html: {
    title: 'HTML 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: true,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  }
} as const

// 修改语言检测函数
const detectLanguage = (code: string): SupportedLanguage => {
  const trimmedCode = code.trim()

  // 添加 HTML 检测逻辑
  if (
    /<[a-z][\s\S]*>/i.test(trimmedCode) &&
    (trimmedCode.startsWith('<!DOCTYPE') ||
      trimmedCode.startsWith('<html') ||
      /<(div|span|p|a|img|ul|li|table|form|input)[\s>]/i.test(trimmedCode))
  ) {
    return 'html'
  }

  // 检测 TypeScript 特征
  if (
    trimmedCode.includes('interface ') ||
    trimmedCode.includes('type ') ||
    /:\s*(string|number|boolean|any|unknown|void|never)\b/.test(trimmedCode) ||
    /<[A-Z][A-Za-z]+>/.test(trimmedCode)
  ) {
    return 'typescript'
  }

  // 先检测 JS/TS 特征
  if (
    trimmedCode.includes('import ') ||
    trimmedCode.includes('export ') ||
    trimmedCode.includes('function ') ||
    trimmedCode.includes('const ') ||
    trimmedCode.includes('let ') ||
    trimmedCode.includes('interface ') ||
    trimmedCode.includes('type ') ||
    /^(class|async|await)/.test(trimmedCode)
  ) {
    return 'javascript'
  }

  // 再检测 SCSS 特征
  if (
    trimmedCode.includes('@use') ||
    trimmedCode.includes('@mixin') ||
    trimmedCode.includes('@include') ||
    /^\$[\w-]+:/.test(trimmedCode)
  ) {
    return 'scss'
  }

  // 最后检测 CSS 特征
  if (/^[.#]?[\w-]+\s*{/.test(trimmedCode) || trimmedCode.includes('@media') || trimmedCode.includes('@keyframes')) {
    return trimmedCode.includes('$') ? 'scss' : 'css'
  }

  // 如果上述都无法判断，再使用 CodeMirror 的检测
  const languages = [
    LanguageDescription.of({
      name: 'json',
      extensions: ['json'],
      load: () => import('@codemirror/lang-json').then((m) => m.json())
    }),
    LanguageDescription.of({
      name: 'scss',
      extensions: ['scss'],
      load: () => import('@codemirror/lang-sass').then((m) => m.sass())
    }),
    LanguageDescription.of({
      name: 'css',
      extensions: ['css'],
      load: () => import('@codemirror/lang-css').then((m) => m.css())
    }),
    LanguageDescription.of({
      name: 'javascript',
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      load: () => import('@codemirror/lang-javascript').then((m) => m.javascript())
    })
  ]
  const detected = LanguageDescription.matchLanguageName(languages, trimmedCode, true)
  return (detected?.name || 'javascript') as SupportedLanguage
}

export default function CodeFormatter() {
  const [code, setCode] = useState('')
  const [options, setOptions] = useState<FormatOptions>(defaultOptions)
  const { theme } = useAppContext()

  const editorExtensions = useMemo(() => {
    const languageExtension = {
      javascript: javascript({ jsx: true }),
      typescript: javascript({ jsx: true, typescript: true }),
      css: css(),
      scss: sass(),
      json: json(),
      html: html()
    }[options.language]

    return [languageExtension, placeholder('在这里输入要格式化的代码')]
  }, [options.language])

  const handleCodeChange = useCallback(
    (value: string, viewUpdate: any) => {
      setCode(value)
      // 检查是否是粘贴操作
      if (viewUpdate.changes.inserted.length >= 1) {
        const detectedLang = detectLanguage(value)
        if (detectedLang !== options.language) {
          setOptions((prev) => ({ ...prev, language: detectedLang }))
          toast.success(`已自动切换到 ${LANGUAGE_CONFIG[detectedLang].title}`)
        }
        // 将光标移到开始位置并滚动到顶部
        viewUpdate.view.dispatch({
          selection: { anchor: 0, head: 0 },
          effects: EditorView.scrollIntoView(0)
        })
      }
    },
    [options.language]
  )

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
      const formatConfig = {
        javascript: {
          parser: 'babel',
          plugins: [babel, estree]
        },
        typescript: {
          parser: 'babel-ts',
          plugins: [babel, estree, typescript]
        },
        css: {
          parser: 'css',
          plugins: [postcss]
        },
        scss: {
          parser: 'scss',
          plugins: [postcss]
        },
        json: {
          parser: 'json',
          plugins: [babel, estree]
        },
        html: {
          parser: 'html',
          plugins: [htmlParser]
        }
      }[options.language]

      const formatted = await prettier.format(code, {
        ...formatConfig,
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

  const handleClear = useCallback(() => {
    if (!code) {
      return
    }
    setCode('')
    toast.success('已清空')
  }, [code])

  const currentLangConfig = LANGUAGE_CONFIG[options.language]

  return (
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
            <Flex gap='4' wrap='wrap'>
              <Flex direction='column' gap='1'>
                <Text as='label' size='1' color='gray'>
                  语言
                </Text>
                <Select.Root
                  value={options.language}
                  onValueChange={(value: SupportedLanguage) => setOptions((prev) => ({ ...prev, language: value }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value='javascript'>JavaScript</Select.Item>
                    <Select.Item value='typescript'>TypeScript</Select.Item>
                    <Select.Item value='css'>CSS</Select.Item>
                    <Select.Item value='scss'>SCSS</Select.Item>
                    <Select.Item value='json'>JSON</Select.Item>
                    <Select.Item value='html'>HTML</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

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
                    <Select.Item value='160'>160 字符换行</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              {currentLangConfig.showBraceStyle && (
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
              )}

              {currentLangConfig.showSemi && (
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
              )}

              {currentLangConfig.showQuoteStyle && (
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
              )}

              {currentLangConfig.showTrailingComma && (
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
              )}

              {currentLangConfig.showArrowParens && (
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
              )}

              {currentLangConfig.showJsxQuote && (
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
              )}

              {currentLangConfig.showQuoteProps && (
                <Flex direction='column' gap='1'>
                  <Text as='label' size='1' color='gray'>
                    对象属性引号
                  </Text>
                  <Select.Root
                    value={options.quoteProps}
                    onValueChange={(value: 'as-needed' | 'consistent' | 'preserve') =>
                      setOptions((prev) => ({ ...prev, quoteProps: value }))
                    }
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value='as-needed'>按需添加</Select.Item>
                      <Select.Item value='consistent'>保持一致</Select.Item>
                      <Select.Item value='preserve'>保持原样</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
              )}
            </Flex>
          </Box>
        </Card>

        <Card size='2'>
          <Flex justify='between' align='center' mb='4' className='editor-header'>
            <Text size='3' weight='medium'>
              请输入{currentLangConfig.title}
            </Text>
            <Flex gap='4'>
              <Tooltip content='清空编辑器'>
                <IconButton size='2' variant='ghost' onClick={handleClear} aria-label='清空编辑器'>
                  <EraserIcon width={18} height={18} />
                </IconButton>
              </Tooltip>
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

export const element = <CodeFormatter />
