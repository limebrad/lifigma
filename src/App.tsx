/**
 * src/App.tsx — собирает холст и три панели.
 * Само состояние (фигуры, инструмент, выделение) живёт в useShapes;
 * компоненты — тонкие и получают всё через пропсы.
 */
import { Canvas } from './components/Canvas'
import { LayersPanel } from './components/LayersPanel'
import { PropertiesPanel } from './components/PropertiesPanel'
import { Toolbar } from './components/Toolbar'
import { useHotkeys } from './hooks/useHotkeys'
import { useShapes } from './hooks/useShapes'

export function App() {
  const {
    shapes,
    activeTool,
    setActiveTool,
    selectedIds,
    selectShape,
    clearSelection,
    updateShape,
    draft,
    beginDraw,
    updateDraw,
    endDraw,
    cancelDraw,
    beginDrag,
    updateDrag,
    endDrag,
    undo,
    redo,
  } = useShapes()

  // V / R / O — инструменты, Ctrl/Cmd+Z и Ctrl/Cmd+Shift+Z — отмена/повтор.
  useHotkeys({ onSelectTool: setActiveTool, onUndo: undo, onRedo: redo })

  const selectedShapes = shapes.filter((shape) => selectedIds.includes(shape.id))

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas-bg text-text-main">
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
        />
      </main>

      {/* Правая колонка: свойства сверху, слои снизу */}
      <aside className="flex w-64 shrink-0 flex-col border-l border-panel-border bg-panel">
        <PropertiesPanel selectedShapes={selectedShapes} onUpdateShape={updateShape} />
        <LayersPanel
          shapes={shapes}
          selectedIds={selectedIds}
          onSelectShape={(id) => selectShape(id)}
        />
      </aside>
    </div>
  )
}