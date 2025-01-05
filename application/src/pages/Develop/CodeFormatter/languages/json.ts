import { json } from '@codemirror/lang-json'
import * as babel from 'prettier/plugins/babel'
import * as estree from 'prettier/plugins/estree'
import { LanguageProcessor } from './base'

export class JSONProcessor extends LanguageProcessor {
  private static instance: JSONProcessor | null = null

  private constructor() {
    super()
  }

  static getInstance(): JSONProcessor {
    if (!JSONProcessor.instance) {
      JSONProcessor.instance = new JSONProcessor()
    }
    return JSONProcessor.instance
  }

  readonly name = 'json'

  readonly config = {
    title: 'JSON 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: false,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  }

  readonly formatterConfig = {
    parser: 'json',
    plugins: [babel, estree]
  }

  readonly detectionRules = [
    {
      priority: 90,
      test: (code: string) => code.includes('.json')
    },
    {
      priority: 80,
      test: (code: string) => {
        if ((code.startsWith('{') && code.endsWith('}')) || (code.startsWith('[') && code.endsWith(']'))) {
          try {
            JSON.parse(code)
            return true
          } catch {
            return false
          }
        }
        return false
      }
    }
  ]

  getCodeMirrorExtension() {
    return json()
  }
}
