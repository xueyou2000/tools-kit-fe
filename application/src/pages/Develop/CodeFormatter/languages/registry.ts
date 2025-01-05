import { LanguageProcessor } from './base'
import { SupportedLanguage } from '../constants'
import { Extension } from '@uiw/react-codemirror'

class LanguageRegistry {
  private processors = new Map<SupportedLanguage, LanguageProcessor>()

  register(language: SupportedLanguage, processor: LanguageProcessor) {
    if (!this.processors.has(language)) {
      this.processors.set(language, processor)
    }
  }

  getProcessor(language: SupportedLanguage): LanguageProcessor {
    const processor = this.processors.get(language)
    if (!processor) {
      throw new Error(`No processor registered for language: ${language}`)
    }
    return processor
  }

  detectLanguage(code: string): SupportedLanguage {
    const bestMatch = Array.from(this.processors.entries()).reduce<{ language: SupportedLanguage; priority: number } | null>(
      (best, [language, processor]) => {
        if (processor.detect(code)) {
          const priority = processor.getPriority(code)
          if (!best || priority > best.priority) {
            return { language, priority }
          }
        }
        return best
      },
      null
    )

    return bestMatch?.language ?? 'javascript'
  }

  getAllLanguages(): Array<{ value: SupportedLanguage; label: string }> {
    return Array.from(this.processors.entries()).map(([value, processor]) => ({
      value,
      label: processor.config.title
    }))
  }

  getAllCodeMirrorExtension(): Array<Extension> {
    return Array.from(this.processors.values()).map((processor) => processor.getCodeMirrorExtension())
  }
}

export const languageRegistry = new LanguageRegistry()
