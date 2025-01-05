import { LanguageDescription } from '@codemirror/language'
import { SupportedLanguage } from '../constants'

export const detectLanguage = (code: string): SupportedLanguage => {
  const trimmedCode = code.trim()

  // HTML 检测 - 优先检测完整的 HTML 文档
  if (
    trimmedCode.startsWith('<!DOCTYPE') ||
    trimmedCode.startsWith('<html') ||
    (/<[a-z][\s\S]*>/i.test(trimmedCode) &&
      /<(div|span|p|a|img|ul|li|table|form|input|html|head|body|meta)[\s>]/i.test(trimmedCode) &&
      !trimmedCode.includes('import ') &&
      !trimmedCode.includes('export ') &&
      !trimmedCode.includes('function '))
  ) {
    return 'html'
  }

  // TypeScript 检测 - 调整规则，避免误判
  if (
    /\.(tsx?)$/.test(trimmedCode) ||
    trimmedCode.includes('interface ') ||
    trimmedCode.includes('type ') ||
    /^(interface|type|enum)\s+\w+/.test(trimmedCode) ||
    /:\s*(string|number|boolean|any|unknown|void|never)\b/.test(trimmedCode) ||
    /import\s+{\s*[^}]+\s*}\s+from\s+['"]@types\//.test(trimmedCode)
  ) {
    return 'typescript'
  }

  // JavaScript/TypeScript 检测
  if (
    trimmedCode.includes('import ') ||
    trimmedCode.includes('export ') ||
    trimmedCode.includes('function ') ||
    trimmedCode.includes('const ') ||
    trimmedCode.includes('let ') ||
    /^(class|async|await)/.test(trimmedCode) ||
    /\.(jsx?)$/.test(trimmedCode)
  ) {
    return 'javascript'
  }

  // SCSS 检测
  if (
    trimmedCode.includes('@use') ||
    trimmedCode.includes('@mixin') ||
    trimmedCode.includes('@include') ||
    /^\$[\w-]+:/.test(trimmedCode) ||
    trimmedCode.includes('.scss')
  ) {
    return 'scss'
  }

  // CSS 检测
  if (
    /^[.#]?[\w-]+\s*{/.test(trimmedCode) ||
    trimmedCode.includes('@media') ||
    trimmedCode.includes('@keyframes') ||
    trimmedCode.includes('.css')
  ) {
    return 'css'
  }

  // JSON 检测
  if (
    (trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) ||
    (trimmedCode.startsWith('[') && trimmedCode.endsWith(']')) ||
    /\.json$/.test(trimmedCode)
  ) {
    try {
      JSON.parse(trimmedCode)
      return 'json'
    } catch {
      // 如果解析失败，继续检测其他类型
    }
  }

  // 使用 CodeMirror 的语言检测作为后备
  const languages = [
    LanguageDescription.of({
      name: 'typescript',
      extensions: ['ts', 'tsx'],
      load: () => import('@codemirror/lang-javascript').then((m) => m.javascript({ typescript: true }))
    }),
    LanguageDescription.of({
      name: 'javascript',
      extensions: ['js', 'jsx'],
      load: () => import('@codemirror/lang-javascript').then((m) => m.javascript())
    }),
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
    })
  ]
  const detected = LanguageDescription.matchLanguageName(languages, trimmedCode, true)
  return (detected?.name || 'javascript') as SupportedLanguage
}
