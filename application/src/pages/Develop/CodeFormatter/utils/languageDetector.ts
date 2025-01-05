import { LanguageDescription } from '@codemirror/language'
import { SupportedLanguage } from '../constants'

function isLikelyYAML(text: string) {
  // 清除所有空白行和注释行
  const cleanedText = text.replace(/^[ \t]*#.*(?:\r\n|\r|\n|$)|^\s*$/gm, '')

  // 如果清理后没有内容，则不是有效的YAML
  if (!cleanedText.trim()) return false

  // 定义严格的YAML模式匹配规则
  const strictYamlPatterns = [
    /^\s*[^:\s]+\s*:/m, // 键值对：键名后面跟着冒号
    /^\s*-/, // 列表项：行首有连字符
    /^\s*\|/, // 多行字符串：行首有竖线
    /^\s*>/, // 折叠多行字符串：行首有大于号
    /^\s{2,}/ // 嵌套：行首有两个或更多空格表示缩进
  ]

  // 检查是否存在至少一个严格的YAML模式
  const hasStrictYamlPattern = strictYamlPatterns.some((pattern) => pattern.test(cleanedText))

  // 尝试排除非YAML的可能性
  const notLikelyOtherFormat = !/<[^>]+>|^function\s+|\b(class|interface|type|extends|implements)\b/i.test(cleanedText)

  // 排除非YAML特性的多行字符串标记
  const notMultiLineStringMarker = !/^\s*(?:'|")/.test(cleanedText) // 排除以单引号或双引号开头的行

  // YAML特有的语义特性
  const yamlSemanticFeatures = /(&[a-zA-Z0-9_-]+|[*][a-zA-Z0-9_-]+|![a-zA-Z0-9_-]+)/

  // 结合多种因素进行判断
  return hasStrictYamlPattern && notLikelyOtherFormat && notMultiLineStringMarker && yamlSemanticFeatures.test(cleanedText)
}
export const detectLanguage = (code: string): SupportedLanguage => {
  const trimmedCode = code.trim()

  // YAML 检测
  if (isLikelyYAML(trimmedCode)) {
    return 'yaml'
  }

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
    /(?:^|\s)import\s+.*\s+from\s+['"].*['"]/.test(trimmedCode) || // TypeScript 导入
    /(?:^|\s)export\s+/.test(trimmedCode) || // TypeScript 导出
    /(?:^|\s)interface\s+\w+/.test(trimmedCode) || // TypeScript 接口
    /(?:^|\s)type\s+\w+/.test(trimmedCode) || // TypeScript 类型
    /:\s*(string|number|boolean|any|unknown|void|never)\b/.test(trimmedCode) || // TypeScript 类型注解
    /\.(tsx?)$/.test(trimmedCode) // 文件扩展名
  ) {
    return 'typescript'
  }

  // JavaScript/TypeScript 检测
  if (
    /(?:^|\s)import\s+.*\s+from\s+['"].*['"]/.test(trimmedCode) || // JavaScript 导入
    /(?:^|\s)export\s+/.test(trimmedCode) || // JavaScript 导出
    /(?:^|\s)function\s+\w+\s*\(/.test(trimmedCode) || // JavaScript 函数定义
    /(?:^|\s)const\s+\w+\s*=/.test(trimmedCode) || // JavaScript 常量定义
    /(?:^|\s)let\s+\w+\s*=/.test(trimmedCode) || // JavaScript 变量定义
    /(?:^|\s)class\s+\w+/.test(trimmedCode) || // JavaScript 类定义
    /\.(jsx?)$/.test(trimmedCode) // 文件扩展名
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
    }),
    LanguageDescription.of({
      name: 'yaml',
      extensions: ['yaml'],
      load: () => import('@codemirror/lang-yaml').then((m) => m.yaml())
    }),
    LanguageDescription.of({
      name: 'markdown',
      extensions: ['md'],
      load: () => import('@codemirror/lang-markdown').then((m) => m.markdown())
    })
  ]

  const detected = LanguageDescription.matchLanguageName(languages, trimmedCode, true)
  if (detected) {
    return detected.name as SupportedLanguage
  }

  // Markdown 检测
  if (
    trimmedCode.startsWith('#') || // Markdown 标题
    /!\[.*\]\(.*\)/.test(trimmedCode) || // Markdown 图片
    /\[.*\]\(.*\)/.test(trimmedCode) || // Markdown 链接
    /`.*`/.test(trimmedCode) || // Markdown 行内代码
    /^\s*[-*]\s+/.test(trimmedCode) // Markdown 列表项
  ) {
    return 'markdown'
  }

  return 'javascript'
}
