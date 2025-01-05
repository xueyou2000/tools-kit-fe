import React, { createContext, useContext } from 'react'
import { LanguageProcessor } from '../languages/base'

interface ProcessorContextType {
  currentProcessor: LanguageProcessor
}

const ProcessorContext = createContext<ProcessorContextType | undefined>(undefined)

export const ProcessorProvider: React.FC<{ currentProcessor: LanguageProcessor; children: React.ReactNode }> = ({
  currentProcessor,
  children
}) => {
  return <ProcessorContext.Provider value={{ currentProcessor }}>{children}</ProcessorContext.Provider>
}

export const useProcessor = (): ProcessorContextType => {
  const context = useContext(ProcessorContext)
  if (!context) {
    throw new Error('useProcessor must be used within a ProcessorProvider')
  }
  return context
}
