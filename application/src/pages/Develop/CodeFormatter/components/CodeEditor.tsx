import { useCallback, useMemo } from 'react'
import CodeMirror, { Transaction } from '@uiw/react-codemirror'
import { placeholder, EditorView, ViewUpdate } from '@codemirror/view'
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode'
import { SupportedLanguage } from '../constants'
import { detectLanguage } from '../utils/languageDetector'
import { useProcessor } from '../context/ProcessorContext'

interface CodeEditorProps {
  code: string
  language: SupportedLanguage
  theme: 'dark' | 'light'
  onChange: (code: string, language: SupportedLanguage) => void
}

export function CodeEditor({ code, language, theme, onChange }: CodeEditorProps) {
  const { currentProcessor } = useProcessor()
  const editorExtensions = useMemo(() => {
    return [currentProcessor.getCodeMirrorExtension(), placeholder(`在这里输入要格式化的${currentProcessor.name}代码`)]
  }, [currentProcessor])

  const handleChange = useCallback(
    (value: string, viewUpdate: ViewUpdate) => {
      let detectedLang = language

      // 查找所有来自用户的事务，并检查是否有"input.paste"注解
      for (const tr of viewUpdate.transactions) {
        if (tr.annotation(Transaction.userEvent) === 'input.paste') {
          detectedLang = detectLanguage(value)
          // 将光标移到开始位置并滚动到顶部
          const newState = viewUpdate.state.update({
            selection: { anchor: 0, head: 0 },
            effects: EditorView.scrollIntoView(0)
          })
          viewUpdate.view.dispatch(newState)
        }
      }

      onChange(value, detectedLang)
    },
    [language, onChange]
  )

  return (
    <CodeMirror
      value={code}
      height='100%'
      width='100%'
      theme={theme === 'dark' ? vscodeDark : vscodeLight}
      extensions={editorExtensions}
      onChange={handleChange}
    />
  )
}
