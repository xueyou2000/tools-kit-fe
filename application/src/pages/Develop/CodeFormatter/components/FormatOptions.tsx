import { Flex, Text, Select } from '@radix-ui/themes'
import { FormatOptions, SupportedLanguage } from '../constants'
import { languageRegistry } from '../languages/registry'
import { useProcessor } from '../context/ProcessorContext'

interface FormatOptionsProps {
  options: FormatOptions
  onChange: (options: FormatOptions) => void
}

export function FormatOptionsPanel({ options, onChange }: FormatOptionsProps) {
  const { currentProcessor } = useProcessor()
  const currentLangConfig = currentProcessor.config

  const updateOption = <K extends keyof FormatOptions>(key: K, value: FormatOptions[K]) => {
    onChange({ ...options, [key]: value })
  }

  return (
    <Flex gap='4' wrap='wrap'>
      <OptionSelect
        label='语言'
        value={options.language}
        onChange={(value) => updateOption('language', value as SupportedLanguage)}
        options={languageRegistry.getAllLanguages()}
      />

      <OptionSelect
        label='缩进方式'
        value={options.indent}
        onChange={(value) => updateOption('indent', value as FormatOptions['indent'])}
        options={[
          { value: 'tab', label: 'Tab 缩进' },
          { value: '2space', label: '2 个空格' },
          { value: '4space', label: '4 个空格' }
        ]}
      />

      <OptionSelect
        label='换行长度'
        value={options.maxLineLength}
        onChange={(value) => updateOption('maxLineLength', value as FormatOptions['maxLineLength'])}
        options={[
          { value: 'no', label: '不换行' },
          { value: '80', label: '80 字符换行' },
          { value: '120', label: '120 字符换行' },
          { value: '160', label: '160 字符换行' }
        ]}
      />

      {currentLangConfig.showBraceStyle && (
        <OptionSelect
          label='大括号风格'
          value={options.braceStyle}
          onChange={(value) => updateOption('braceStyle', value as FormatOptions['braceStyle'])}
          options={[
            { value: 'collapse', label: '折叠' },
            { value: 'expand', label: '展开' },
            { value: 'end-expand', label: '混合风格' }
          ]}
        />
      )}

      {currentLangConfig.showSemi && (
        <OptionSelect
          label='分号'
          value={options.semi.toString()}
          onChange={(value) => updateOption('semi', value === 'true')}
          options={[
            { value: 'true', label: '添加分号' },
            { value: 'false', label: '不添加分号' }
          ]}
        />
      )}

      {currentLangConfig.showQuoteStyle && (
        <OptionSelect
          label='引号样式'
          value={options.singleQuote.toString()}
          onChange={(value) => updateOption('singleQuote', value === 'true')}
          options={[
            { value: 'true', label: '单引号' },
            { value: 'false', label: '双引号' }
          ]}
        />
      )}

      {currentLangConfig.showTrailingComma && (
        <OptionSelect
          label='尾随逗号'
          value={options.trailingComma}
          onChange={(value) => updateOption('trailingComma', value as FormatOptions['trailingComma'])}
          options={[
            { value: 'none', label: '不使用' },
            { value: 'es5', label: 'ES5 语法' },
            { value: 'all', label: '所有位置' }
          ]}
        />
      )}

      {currentLangConfig.showArrowParens && (
        <OptionSelect
          label='箭头函数参数'
          value={options.arrowParens}
          onChange={(value) => updateOption('arrowParens', value as FormatOptions['arrowParens'])}
          options={[
            { value: 'avoid', label: '单参数不加括号' },
            { value: 'always', label: '总是加括号' }
          ]}
        />
      )}

      {currentLangConfig.showJsxQuote && (
        <OptionSelect
          label='JSX 引号'
          value={options.jsxSingleQuote.toString()}
          onChange={(value) => updateOption('jsxSingleQuote', value === 'true')}
          options={[
            { value: 'true', label: '单引号' },
            { value: 'false', label: '双引号' }
          ]}
        />
      )}

      {currentLangConfig.showQuoteProps && (
        <OptionSelect
          label='对象属性引号'
          value={options.quoteProps}
          onChange={(value) => updateOption('quoteProps', value as FormatOptions['quoteProps'])}
          options={[
            { value: 'as-needed', label: '按需添加' },
            { value: 'consistent', label: '保持一致' },
            { value: 'preserve', label: '保持原样' }
          ]}
        />
      )}
    </Flex>
  )
}

interface OptionSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}

function OptionSelect({ label, value, onChange, options }: OptionSelectProps) {
  return (
    <Flex direction='column' gap='1'>
      <Text as='label' size='1' color='gray'>
        {label}
      </Text>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger />
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  )
}
