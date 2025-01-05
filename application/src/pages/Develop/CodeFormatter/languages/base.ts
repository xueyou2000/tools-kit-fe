import { Plugin } from 'prettier'
import { Extension } from '@codemirror/state'

export interface LanguageConfig {
  title: string
  showBraceStyle: boolean
  showSemi: boolean
  showQuoteStyle: boolean
  showTrailingComma: boolean
  showArrowParens: boolean
  showJsxQuote: boolean
  showQuoteProps: boolean
}

export interface FormatterConfig {
  parser: string
  plugins: Plugin[]
}

export interface DetectionRule {
  priority: number
  test: (code: string) => boolean
}

export abstract class LanguageProcessor {
  abstract readonly name: string
  abstract readonly config: LanguageConfig
  abstract readonly formatterConfig: FormatterConfig
  abstract readonly detectionRules: DetectionRule[]
  abstract getCodeMirrorExtension(): Extension

  detect(code: string): boolean {
    return this.detectionRules.some((rule) => rule.test(code))
  }

  getPriority(code: string): number {
    const matchedRule = this.detectionRules.find((rule) => rule.test(code))
    return matchedRule?.priority ?? -1
  }
}
