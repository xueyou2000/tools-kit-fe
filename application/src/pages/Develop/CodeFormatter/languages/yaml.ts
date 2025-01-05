import { yaml } from '@codemirror/lang-yaml' // 确保你有这个包
import { LanguageProcessor } from './base'

export class YAMLProcessor extends LanguageProcessor {
  private static instance: YAMLProcessor | null = null

  private constructor() {
    super()
  }

  static getInstance(): YAMLProcessor {
    if (!YAMLProcessor.instance) {
      YAMLProcessor.instance = new YAMLProcessor()
    }
    return YAMLProcessor.instance
  }

  readonly name = 'yaml'

  readonly config = {
    title: 'YAML 代码',
    showBraceStyle: false,
    showSemi: false,
    showQuoteStyle: false,
    showTrailingComma: false,
    showArrowParens: false,
    showJsxQuote: false,
    showQuoteProps: false
  }

  readonly formatterConfig = {
    parser: 'yaml',
    plugins: [] // YAML 不需要额外的 Prettier 插件
  }

  readonly detectionRules = [
    {
      priority: 90,
      test: (code: string) => code.trim().startsWith('-') || code.includes(':') // 检测 YAML 特征
    }
  ]

  getCodeMirrorExtension() {
    return yaml()
  }
}
