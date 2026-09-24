/**
 * src/components/Toolbar.tsx — левая панель инструментов (каркас).
 * Кнопки собраны из TOOLS — единственного источника правды о инструментах.
 */
import type { ReactNode } from 'react'
import { TOOLS } from '../constants/tools'
import type { Tool } from '../types/shape'

export interface ToolbarProps {
  activeTool: Tool
  onSelectTool: (tool: Tool) => void
}

export function Toolbar({ activeTool, onSelectTool }: ToolbarProps) {
  return (
    <div className="relative z-10 flex w-14 shrink-0 flex-col items-center gap-1.5 border-r border-panel-border bg-panel py-3">
      <span className="mb-2 select-none text-xs font-bold tracking-widest text-text-muted">
        MF
      </span>
      {TOOLS.map((tool) => {
        const isActive = activeTool === tool.id
        return (
          <button
            key={tool.id}
            type="button"
            title={tool.hint}
            aria-pressed={isActive}
            onClick={() => onSelectTool(tool.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              isActive
                ? 'bg-accent/15 text-accent'
                : 'text-text-muted hover:bg-panel-2 hover:text-text-main'
            }`}
          >
            {TOOL_ICONS[tool.id]}
          </button>
        )
      })}
    </div>
  )
}

const TOOL_ICONS: Record<Tool, ReactNode> = {
  select: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 3l14 8-6.5 1.5L9 19z" />
    </svg>
  ),
  rectangle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
    </svg>
  ),
  ellipse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="12" rx="9" ry="6" />
    </svg>
  ),
}