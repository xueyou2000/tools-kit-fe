import { css } from '@codemirror/lang-css'
import * as postcss from 'prettier/plugins/postcss'
import { LanguageProcessor } from './base'

export class CSSProcessor extends LanguageProcessor {
  private static instance: CSSProcessor | null = null

  private constructor() {
    super()
  }

  static getInstance(): CSSProcessor {
    if (!CSSProcessor.instance) {
      CSSProcessor.instance = new CSSProcessor()
    }
    return CSSProcessor.instance
  }

  readonly name = 'css'

  readonly config = {
    title: 'CSS 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: false,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  }

  readonly formatterConfig = {
    parser: 'css',
    plugins: [postcss]
  }

  readonly detectionRules = [
    {
      priority: 90,
      test: (code: string) => code.includes('.css')
    },
    {
      priority: 80,
      test: (code: string) => /^[.#]?[\w-]+\s*{/.test(code) || code.includes('@media') || code.includes('@keyframes')
    }
  ]

  getCodeMirrorExtension() {
    return css()
  }
}
