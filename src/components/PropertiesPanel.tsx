/**
 * src/components/PropertiesPanel.tsx — панель свойств справа.
 * Показывает атрибуты выделенной фигуры и позволяет менять её цвет заливки
 * тремя способами: нативный пикер, ввод hex/CSS-цвета текстом или палитра
 * пресетов.
 */
import { useState } from 'react'
import { DEFAULT_FILL, PRESET_COLORS } from '../constants/colors'
import { SHAPE_LABELS } from '../constants/shapes'
import type { Shape } from '../types/shape'

export interface PropertiesPanelProps {
  selectedShapes: Shape[]
  /** Обновить свойство фигуры (меняет цвет заливки). */
  onUpdateShape: (id: string, patch: Partial<Omit<Shape, 'id'>>) => void
}

/** Цвет, который показываем, если заливку вообще не удалось разобрать. */
const FALLBACK_HEX = DEFAULT_FILL

/** Проверяет, что строка — непустой CSS-цвет (hex, named, rgb(), okhsl() …). */
function isValidColor(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  // Быстрая проверка hex, не полагаясь на CSS.supports.
  if (/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return true
  try {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      return CSS.supports('color', trimmed)
    }
  } catch {
    return false
  }
  return false
}

/** Приводит #rgb / #rgba / #rrggbb к #rrggbb; остальное возвращает как есть. */
function normalizeHex(value: string): string | null {
  const match = /^#([0-9a-f]{3,8})$/i.exec(value.trim())
  if (!match) return null
  const digits = match[1]
  if (digits.length === 3 || digits.length === 4) {
    // #abc -> #aabbcc, полупрозрачность у короткой формы теряем.
    return `#${digits
      .slice(0, 3)
      .split('')
      .map((char) => char + char)
      .join('')}`
  }
  return `#${digits}`
}

/**
 * Один пиксельный контекст на весь модуль: он нужен, чтобы узнать, во что
 * браузер превращает произвольный CSS-цвет.
 */
let scratchContext: CanvasRenderingContext2D | null | undefined
function getScratchContext(): CanvasRenderingContext2D | null {
  if (scratchContext === undefined) {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      scratchContext = canvas.getContext('2d', { willReadFrequently: true })
    } catch {
      scratchContext = null
    }
  }
  return scratchContext
}

/**
 * Любой CSS-цвет -> hex, который понимает <input type="color">.
 * Нативный пикер умеет хранить только #rgb/#rrggbb(+alpha) и молча
 * превращает всё остальное в чёрный: если заливка фигуры задана как `red`
 * или `rgb(1 2 3)`, пикер открывался бы на чёрном фоне. Поэтому не-hex
 * раскрываем сами: рисуем цвет в пиксель и читаем его обратно.
 */
function toHexColor(value: string): string {
  const direct = normalizeHex(value)
  if (direct) return direct
  const context = getScratchContext()
  if (!context) return FALLBACK_HEX
  try {
    context.clearRect(0, 0, 1, 1)
    context.fillStyle = '#000000'
    context.fillStyle = value
    // Неразбираемый цвет оставит предыдущий (#000000) — это не страшно,
    // мы всё равно получим валидный hex и просто покажем чёрный.
    context.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
    const hex = [r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')
    return a === 255 ? `#${hex}` : `#${hex}${a.toString(16).padStart(2, '0')}`
  } catch {
    return FALLBACK_HEX
  }
}

interface ColorEditorProps {
  shape: Shape
  onUpdateShape: PropertiesPanelProps['onUpdateShape']
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

  const apply = (fill: string) => onUpdateShape(shape.id, { fill })

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
            className="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded bg-panel-2 ring-1 ring-inset ring-panel-border"
            title="Открыть палитру"
          >
            <span
              className="pointer-events-none h-3.5 w-3.5 rounded-sm"
              style={{ backgroundColor: shape.fill }}
            />
            <input
              type="color"
              value={toHexColor(shape.fill)}
              onChange={(event) => apply(event.target.value)}
              aria-label="Цвет заливки"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onBlur={commitText}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitText()
            }}
            spellCheck={false}
            aria-label="Цвет: hex или CSS-формат"
            className="w-24 rounded bg-panel-2 px-1.5 py-0.5 font-mono text-xs text-text-main outline-none ring-1 ring-inset ring-panel-border focus:ring-accent"
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
                onClick={() => apply(color)}
                title={color}
                aria-label={`Залить цветом ${color}`}
                aria-pressed={isCurrent}
                className={`h-5 w-5 rounded-sm ring-1 ring-inset transition-transform hover:scale-110 ${
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
            <PropertyRow label="Тип" value={SHAPE_LABELS[shape.type]} />
            <PropertyRow label="X" value={Math.round(shape.x)} />
            <PropertyRow label="Y" value={Math.round(shape.y)} />
            <PropertyRow label="W" value={Math.round(shape.width)} />
            <PropertyRow label="H" value={Math.round(shape.height)} />
            {/* key={shape.id}: при смене выделения редактор цвета пересоздаётся,
                иначе недопечатанный текст одной фигуры применялся бы к другой. */}
            <ColorEditor key={shape.id} shape={shape} onUpdateShape={onUpdateShape} />
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
