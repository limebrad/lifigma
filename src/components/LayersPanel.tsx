/**
 * src/components/LayersPanel.tsx — панель слоёв справа.
 * Список всех фигур в порядке «сверху вниз» (верхний слой — первый в списке,
 * как в Figma). Клик по слою выделяет фигуру на холсте; фигура, созданная
 * последней, оказывается в начале списка.
 */
import type { Shape } from '../types/shape'

export interface LayersPanelProps {
  shapes: Shape[]
  selectedIds: string[]
  onSelectShape: (id: string) => void
}

export function LayersPanel({ shapes, selectedIds, onSelectShape }: LayersPanelProps) {
  // В массиве shapes верхняя фигура — последняя (рисуется поверх остальных),
  // поэтому для «файлового» порядка списка переворачиваем массив.
  const orderedShapes = [...shapes].reverse()

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-panel">
      <header className="border-b border-panel-border px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Слои
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {shapes.length === 0 ? (
          <p className="px-2 py-1 text-sm text-text-muted">
            Холст пуст. Выберите инструмент — фигуры появятся здесь.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {orderedShapes.map((shape) => {
              const index = shapes.indexOf(shape) + 1
              const isSelected = selectedIds.includes(shape.id)
              const label = `${shape.type} ${index}`
              return (
                <li key={shape.id}>
                  <button
                    type="button"
                    onClick={() => onSelectShape(shape.id)}
                    aria-pressed={isSelected}
                    className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-accent/15 text-text-main'
                        : 'text-text-muted hover:bg-panel-2 hover:text-text-main'
                    }`}
                  >
                    {/* Живой цвет заливки фигуры */}
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-sm ring-1 ring-inset ring-panel-border"
                      style={{ backgroundColor: shape.fill }}
                    />
                    <span className="shrink-0 text-xs text-text-muted">
                      {shape.type === 'ellipse' ? '⬭' : '▭'}
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}