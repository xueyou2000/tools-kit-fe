import prettier from 'prettier'
import { FormatOptions } from '../constants'
import { languageRegistry } from '../languages/registry'

export class FormatterService {
  static async format(code: string, options: FormatOptions): Promise<string> {
    const processor = languageRegistry.getProcessor(options.language)
    const { parser, plugins } = processor.formatterConfig

    return prettier.format(code, {
      parser,
      plugins: [...plugins],
      printWidth: options.maxLineLength === 'no' ? 9999 : Number(options.maxLineLength),
      useTabs: options.indent === 'tab',
      tabWidth: Number(options.indent.replace('space', '') || 2),
      bracketSameLine: options.braceStyle === 'collapse',
      semi: options.semi,
      singleQuote: options.singleQuote,
      trailingComma: options.trailingComma,
      arrowParens: options.arrowParens,
      jsxSingleQuote: options.jsxSingleQuote,
      quoteProps: options.quoteProps
    })
  }
}
