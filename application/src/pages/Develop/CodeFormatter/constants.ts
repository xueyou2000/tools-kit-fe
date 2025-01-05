export type SupportedLanguage = 'javascript' | 'typescript' | 'css' | 'scss' | 'json' | 'html'

export interface FormatOptions {
  language: SupportedLanguage
  indent: 'tab' | '2space' | '4space'
  maxLineLength: 'no' | '80' | '120' | '160'
  braceStyle: 'collapse' | 'expand' | 'end-expand'
  semi: boolean
  singleQuote: boolean
  trailingComma: 'none' | 'es5' | 'all'
  arrowParens: 'avoid' | 'always'
  jsxSingleQuote: boolean
  quoteProps: 'as-needed' | 'consistent' | 'preserve'
}

export const defaultOptions: FormatOptions = {
  language: 'javascript',
  indent: '2space',
  maxLineLength: '120',
  braceStyle: 'collapse',
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  jsxSingleQuote: false,
  quoteProps: 'as-needed'
}

// export const LANGUAGE_CONFIG = {
//   javascript: {
//     title: 'JavaScript 代码',
//     showBraceStyle: true,
//     showSemi: true,
//     showQuoteStyle: true,
//     showTrailingComma: true,
//     showArrowParens: true,
//     showJsxQuote: true,
//     showQuoteProps: true
//   },
//   typescript: {
//     title: 'TypeScript 代码',
//     showBraceStyle: true,
//     showSemi: true,
//     showQuoteStyle: true,
//     showTrailingComma: true,
//     showArrowParens: true,
//     showJsxQuote: true,
//     showQuoteProps: true
//   },
//   css: {
//     title: 'CSS 代码',
//     showBraceStyle: false,
//     showSemi: false,
//     showQuoteStyle: false,
//     showTrailingComma: false,
//     showArrowParens: false,
//     showJsxQuote: false,
//     showQuoteProps: false
//   },
//   scss: {
//     title: 'SCSS 代码',
//     showBraceStyle: false,
//     showSemi: false,
//     showQuoteStyle: false,
//     showTrailingComma: false,
//     showArrowParens: false,
//     showJsxQuote: false,
//     showQuoteProps: false
//   },
//   json: {
//     title: 'JSON 代码',
//     showBraceStyle: false,
//     showSemi: false,
//     showQuoteStyle: false,
//     showTrailingComma: false,
//     showArrowParens: false,
//     showJsxQuote: false,
//     showQuoteProps: false
//   },
//   html: {
//     title: 'HTML 代码',
//     showBraceStyle: false,
//     showSemi: false,
//     showQuoteStyle: true,
//     showTrailingComma: false,
//     showArrowParens: false,
//     showJsxQuote: false,
//     showQuoteProps: false
//   }
// } as const
