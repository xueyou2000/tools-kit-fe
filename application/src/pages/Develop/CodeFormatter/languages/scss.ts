import { sass } from '@codemirror/lang-sass'
import * as postcss from 'prettier/plugins/postcss'
import { LanguageProcessor } from './base'

export class SCSSProcessor extends LanguageProcessor {
  private static instance: SCSSProcessor | null = null

  private constructor() {
    super()
  }

  static getInstance(): SCSSProcessor {
    if (!SCSSProcessor.instance) {
      SCSSProcessor.instance = new SCSSProcessor()
    }
    return SCSSProcessor.instance
  }

  readonly name = 'scss'

  readonly config = {
    title: 'SCSS 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: false,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  }

  readonly formatterConfig = {
    parser: 'scss',
    plugins: [postcss]
  }

  readonly detectionRules = [
    {
      priority: 90,
      test: (code: string) => code.includes('.scss')
    },
    {
      priority: 80,
      test: (code: string) => code.includes('@use') || code.includes('@mixin') || code.includes('@include') || /^\$[\w-]+:/.test(code)
    }
  ]

  getCodeMirrorExtension() {
    return sass()
  }
}
