import { html } from '@codemirror/lang-html'
import * as htmlParser from 'prettier/plugins/html'
import { LanguageProcessor } from './base'

export class HTMLProcessor extends LanguageProcessor {
  private static instance: HTMLProcessor | null = null

  private constructor() {
    super()
  }

  static getInstance(): HTMLProcessor {
    if (!HTMLProcessor.instance) {
      HTMLProcessor.instance = new HTMLProcessor()
    }
    return HTMLProcessor.instance
  }

  readonly name = 'html'

  readonly config = {
    title: 'HTML 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: true,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  }

  readonly formatterConfig = {
    parser: 'html',
    plugins: [htmlParser]
  }

  readonly detectionRules = [
    {
      priority: 100,
      test: (code: string) => code.startsWith('<!DOCTYPE') || code.startsWith('<html')
    },
    {
      priority: 90,
      test: (code: string) =>
        /<[a-z][\s\S]*>/i.test(code) &&
        /<(div|span|p|a|img|ul|li|table|form|input|html|head|body|meta)[\s>]/i.test(code) &&
        !code.includes('import ') &&
        !code.includes('export ') &&
        !code.includes('function ')
    }
  ]

  getCodeMirrorExtension() {
    return html()
  }
}
