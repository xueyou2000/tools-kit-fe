import { javascript } from '@codemirror/lang-javascript'
import * as babel from 'prettier/plugins/babel'
import * as estree from 'prettier/plugins/estree'
import { LanguageProcessor } from './base'

export class TypeScriptProcessor extends LanguageProcessor {
  private static instance: TypeScriptProcessor | null = null

  private constructor() {
    super()
  }

  static getInstance(): TypeScriptProcessor {
    if (!TypeScriptProcessor.instance) {
      TypeScriptProcessor.instance = new TypeScriptProcessor()
    }
    return TypeScriptProcessor.instance
  }

  readonly name = 'typescript'

  readonly config = {
    title: 'TypeScript 代码',
    showBraceStyle: true,
    showSemi: true,
    showQuoteStyle: true,
    showTrailingComma: true,
    showArrowParens: true,
    showJsxQuote: true,
    showQuoteProps: true
  }

  readonly formatterConfig = {
    parser: 'babel-ts',
    plugins: [babel, estree]
  }

  readonly detectionRules = [
    {
      priority: 100,
      test: (code: string) => /\.(tsx?)$/.test(code)
    },
    {
      priority: 90,
      test: (code: string) => /^(interface|type|enum)\s+\w+/.test(code)
    },
    {
      priority: 80,
      test: (code: string) =>
        code.includes('interface ') ||
        code.includes('type ') ||
        /:\s*(string|number|boolean|any|unknown|void|never)\b/.test(code) ||
        /import\s+{\s*[^}]+\s*}\s+from\s+['"]@types\//.test(code)
    }
  ]

  getCodeMirrorExtension() {
    return javascript({ jsx: true, typescript: true })
  }
}
