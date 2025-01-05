import { javascript } from '@codemirror/lang-javascript'
import * as babel from 'prettier/plugins/babel'
import * as estree from 'prettier/plugins/estree'
import { LanguageProcessor } from './base'

export class JavaScriptProcessor extends LanguageProcessor {
  private static instance: JavaScriptProcessor | null = null

  private constructor() {
    super()
  }

  static getInstance(): JavaScriptProcessor {
    if (!JavaScriptProcessor.instance) {
      JavaScriptProcessor.instance = new JavaScriptProcessor()
    }
    return JavaScriptProcessor.instance
  }

  readonly name = 'javascript'

  readonly config = {
    title: 'JavaScript 代码',
    showBraceStyle: true,
    showSemi: true,
    showQuoteStyle: true,
    showTrailingComma: true,
    showArrowParens: true,
    showJsxQuote: true,
    showQuoteProps: true
  }

  readonly formatterConfig = {
    parser: 'babel',
    plugins: [babel, estree]
  }

  readonly detectionRules = [
    {
      priority: 90,
      test: (code: string) => /\.(jsx?)$/.test(code)
    },
    {
      priority: 80,
      test: (code: string) =>
        code.includes('import ') ||
        code.includes('export ') ||
        code.includes('function ') ||
        code.includes('const ') ||
        code.includes('let ') ||
        /^(class|async|await)/.test(code)
    }
  ]

  getCodeMirrorExtension() {
    return javascript({ jsx: true })
  }
}
