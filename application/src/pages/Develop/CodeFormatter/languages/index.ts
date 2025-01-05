import { languageRegistry } from './registry'
import { TypeScriptProcessor } from './typescript'
import { JavaScriptProcessor } from './javascript'
import { CSSProcessor } from './css'
import { SCSSProcessor } from './scss'
import { JSONProcessor } from './json'
import { HTMLProcessor } from './html'

export { languageRegistry }

// 注册所有语言处理器
export function registerAll() {
  languageRegistry.register('typescript', TypeScriptProcessor.getInstance())
  languageRegistry.register('javascript', JavaScriptProcessor.getInstance())
  languageRegistry.register('css', CSSProcessor.getInstance())
  languageRegistry.register('scss', SCSSProcessor.getInstance())
  languageRegistry.register('json', JSONProcessor.getInstance())
  languageRegistry.register('html', HTMLProcessor.getInstance())
}
