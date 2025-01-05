import { markdown } from '@codemirror/lang-markdown' // 确保你有这个包
import { LanguageProcessor } from './base'

export class MarkdownProcessor extends LanguageProcessor {
  private static instance: MarkdownProcessor | null = null

  private constructor() {
    super()
  }

  static getInstance(): MarkdownProcessor {
    if (!MarkdownProcessor.instance) {
      MarkdownProcessor.instance = new MarkdownProcessor()
    }
    return MarkdownProcessor.instance
  }

  readonly name = 'markdown'

  readonly config = {
    title: 'Markdown 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: false,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  }

  readonly formatterConfig = {
    parser: 'markdown',
    plugins: [] // Markdown 不需要额外的 Prettier 插件
  }

  readonly detectionRules = [
    {
      priority: 90,
      test: (code: string) => code.trim().startsWith('#') || code.includes('[') // 检测 Markdown 特征
    }
  ]

  getCodeMirrorExtension() {
    return markdown()
  }
}
