/**
 * src/editor/EditorApp.tsx — рабочая страница редактора «Мини Фигма».
 * Холст и панели уже живут в src/components; здесь они собираются в одно
 * приложение и получают тонкую верхнюю панель со ссылкой на лендинг.
 * Состояние фигур — в useShapes, горячие клавиши — в useHotkeys.
 */
import { useCallback } from 'react'
import { Canvas } from '../components/Canvas'
import { LayersPanel } from '../components/LayersPanel'
import { PropertiesPanel } from '../components/PropertiesPanel'
import { Toolbar } from '../components/Toolbar'
import { LogoMark } from '../components/ui/Logo'
import { useHotkeys } from '../hooks/useHotkeys'
import { useShapes } from '../hooks/useShapes'

/** Ссылка на лендинг: базовый путь '/lifigma/' задан в vite.config.ts. */
const HOME_URL = import.meta.env.BASE_URL

export function EditorApp() {
  const {
    shapes,
    activeTool,
    setActiveTool,
    selectedIds,
    updateShape,
    draft,
    selectShape,
    clearSelection,
    beginDraw,
    updateDraw,
    endDraw,
    cancelDraw,
    beginDrag,
    updateDrag,
    endDrag,
    cancelDrag,
    removeShapes,
    selectAll,
    undo,
    redo,
  } = useShapes()

  // Delete/Backspace — удалить выделенное; Escape — снять выделение и рисование.
  const handleDelete = useCallback(() => removeShapes(selectedIds), [removeShapes, selectedIds])
  const handleEscape = useCallback(() => {
    cancelDrag()
    cancelDraw()
    clearSelection()
  }, [cancelDrag, cancelDraw, clearSelection])

  useHotkeys({
    onSelectTool: setActiveTool,
    onUndo: undo,
    onRedo: redo,
    onDelete: handleDelete,
    onSelectAll: selectAll,
    onEscape: handleEscape,
  })

  const selectedShapes = shapes.filter((shape) => selectedIds.includes(shape.id))

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-canvas-bg text-text-main">
      {/* Верхняя панель сайта: подсказка по клавишам и возврат на лендинг */}
      <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-panel-border bg-panel px-3">
        <div className="inline-flex items-center gap-2 px-1.5 py-1 text-text-main">
          <LogoMark className="h-4 w-auto" />
          <span className="text-sm font-semibold tracking-tight">Мини Фигма</span>
        </div>

        <p className="hidden text-xs text-text-muted sm:block">
          Выбор — V · Прямоугольник — R · Эллипс — O · Отмена — Ctrl/Cmd+Z
        </p>

        <a
          href={HOME_URL}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-panel-2 hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ← На главную
        </a>
      </header>

      {/* На узких экранах честно предупреждаем: камера завязана на мышь */}
      <p className="border-b border-panel-border bg-panel-2 px-3 py-1.5 text-center text-xs text-text-muted sm:hidden">
        Редактор рассчитан на компьютер: рисовать и двигать фигуры можно, а панорама и зум —
        мышью.
      </p>

      <div className="flex min-h-0 flex-1">
        <Toolbar activeTool={activeTool} onSelectTool={setActiveTool} />

        {/* Холст занимает всё оставшееся пространство */}
        <main className="relative min-w-0 flex-1">
          <Canvas
            shapes={shapes}
            activeTool={activeTool}
            selectedIds={selectedIds}
            draft={draft}
            selectShape={selectShape}
            clearSelection={clearSelection}
            beginDraw={beginDraw}
            updateDraw={updateDraw}
            endDraw={endDraw}
            cancelDraw={cancelDraw}
            beginDrag={beginDrag}
            updateDrag={updateDrag}
            endDrag={endDrag}
            cancelDrag={cancelDrag}
          />
        </main>

        {/* Правая колонка: свойства выбранной фигуры и список слоёв */}
        <aside className="flex w-64 shrink-0 flex-col border-l border-panel-border bg-panel">
          <PropertiesPanel selectedShapes={selectedShapes} onUpdateShape={updateShape} />
          <LayersPanel shapes={shapes} selectedIds={selectedIds} onSelectShape={selectShape} />
        </aside>
      </div>
    </div>
  )
}
