/**
 * src/components/PropertiesPanel.tsx — панель свойств справа.
 * Показывает атрибуты выделенной фигуры и позволяет менять её цвет тремя
 * способами: нативный пикер, ввод hex/CSS-цвета текстом или палитра пресетов.
 */
import { useState } from 'react'
import type { Shape } from '../types/shape'

export interface PropertiesPanelProps {
  selectedShapes: Shape[]
  /** Обновить свойство фигуры (меняет цвет заливки). */
  onUpdateShape?: (id: string, patch: Partial<Omit<Shape, 'id'>>) => void
}

/** Быстрая палитра: один клик — и цвет применён (без системного пикера). */
const PRESET_COLORS = [
  '#7c6cff', '#3fd8f0', '#f66fc8', '#4ade80',
  '#f5a623', '#ff5d5d', '#ece9f8', '#1b1727',
]

/** Проверяет, что строка — валидный CSS-цвет (hex, named, rgb(), okhsl() …). */
function isValidColor(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  // Быстрая проверка hex, не полагаясь на CSS.supports.
  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return true
  try {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      return CSS.supports('color', trimmed)
    }
  } catch {
    return false
  }
  return false
}

interface ColorEditorProps {
  shape: Shape
  onUpdateShape?: PropertiesPanelProps['onUpdateShape']
}

function ColorEditor({ shape, onUpdateShape }: ColorEditorProps) {
  const [text, setText] = useState(shape.fill)

  // Синхронизируем текстовое поле, когда цвет меняется извне (пресет, пикер).
  // Официальный паттерн «хранение значения прошлого рендера» — без эффектов.
  const [lastFill, setLastFill] = useState(shape.fill)
  if (lastFill !== shape.fill) {
    setLastFill(shape.fill)
    setText(shape.fill)
  }

  const apply = (fill: string) => onUpdateShape?.(shape.id, { fill })

  const commitText = () => {
    if (isValidColor(text)) {
      apply(text.trim())
    } else {
      // Невалидный ввод — возвращаем текущий цвет фигуры.
      setText(shape.fill)
    }
  }

  return (
    <div>
      <dt className="text-text-muted">Цвет</dt>
      <dd className="mt-1 space-y-1.5">
        {/* Строка: нативный пикер + текстовый ввод цвета */}
        <div className="flex items-center gap-1.5">
          <label
            className={`relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-panel-2 ring-1 ring-inset ring-panel-border ${
              onUpdateShape ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
            title="Открыть палитру"
          >
            <span
              className="pointer-events-none h-3.5 w-3.5 rounded-sm"
              style={{ backgroundColor: shape.fill }}
            />
            <input
              type="color"
              value={shape.fill}
              disabled={!onUpdateShape}
              onChange={(event) => apply(event.target.value)}
              aria-label="Цвет заливки"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
          </label>
          <input
            type="text"
            value={text}
            disabled={!onUpdateShape}
            onChange={(event) => setText(event.target.value)}
            onBlur={commitText}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitText()
            }}
            spellCheck={false}
            aria-label="Цвет: hex или CSS-формат"
            className="w-24 rounded bg-panel-2 px-1.5 py-0.5 font-mono text-xs text-text-main outline-none ring-1 ring-inset ring-panel-border focus:ring-accent disabled:opacity-50"
          />
        </div>
        {/* Палитра пресетов */}
        <div className="flex items-center gap-1">
          {PRESET_COLORS.map((color) => {
            const isCurrent = shape.fill.toLowerCase() === color
            return (
              <button
                key={color}
                type="button"
                disabled={!onUpdateShape}
                onClick={() => apply(color)}
                title={color}
                aria-label={`Залить цветом ${color}`}
                aria-pressed={isCurrent}
                className={`h-5 w-5 rounded-sm ring-1 ring-inset transition-transform hover:scale-110 disabled:opacity-50 ${
                  isCurrent ? 'ring-2 ring-text-main' : 'ring-panel-border'
                }`}
                style={{ backgroundColor: color }}
              />
            )
          })}
        </div>
      </dd>
    </div>
  )
}

export function PropertiesPanel({ selectedShapes, onUpdateShape }: PropertiesPanelProps) {
  const shape = selectedShapes[0]

  return (
    <section className="flex h-64 shrink-0 flex-col border-b border-panel-border bg-panel">
      <header className="border-b border-panel-border px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Свойства
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {shape ? (
          <dl className="space-y-1.5 text-sm">
            <PropertyRow label="Тип" value={shape.type} />
            <PropertyRow label="X" value={Math.round(shape.x)} />
            <PropertyRow label="Y" value={Math.round(shape.y)} />
            <PropertyRow label="W" value={Math.round(shape.width)} />
            <PropertyRow label="H" value={Math.round(shape.height)} />
            <ColorEditor shape={shape} onUpdateShape={onUpdateShape} />
          </dl>
        ) : (
          <p className="text-sm text-text-muted">Ничего не выбрано</p>
        )}
      </div>
    </section>
  )
}

function PropertyRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-text-muted">{label}</dt>
      <dd className="rounded bg-panel-2 px-1.5 font-mono text-xs text-text-main">
        {value}
      </dd>
    </div>
  )
}