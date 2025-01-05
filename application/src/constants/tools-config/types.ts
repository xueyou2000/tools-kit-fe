export type ToolConfig = {
  name: string
  category: string
  icon: string
  url: string
}

export type ToolsMap = {
  [key: string]: {
    name: string
    list: ToolConfig[]
  }
}

export interface ToolItem {
  name: string
  url: string
  icon?: string // 可选的图标字段
}
