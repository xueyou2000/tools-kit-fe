import { useCallback, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { placeholder, EditorView } from '@codemirror/view'
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: string, viewUpdate: any) => {
      // 检查是否是粘贴操作
      if (viewUpdate.changes.inserted.length >= 1) {
        const detectedLang = detectLanguage(value)

        // 将光标移到开始位置并滚动到顶部
        viewUpdate.view.dispatch({
          selection: { anchor: 0, head: 0 },
          effects: EditorView.scrollIntoView(0)
        })

        onChange(value, detectedLang)
      } else {
        onChange(value, language)
      }
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
