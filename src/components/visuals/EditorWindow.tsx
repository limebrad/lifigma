/**
 * src/components/visuals/EditorWindow.tsx — векторный макет интерфейса
 * редактора «Мини Фигма». Это достоверная иллюстрация (панель инструментов,
 * холст с фигурами, панели свойств и слоёв), нарисованная в SVG: масштабируется
 * без потерь и весит мало. Палитра совпадает с настоящим редактором.
 */

const BG = '#0e0c16'
const PANEL = '#14111f'
const PANEL2 = '#1b1727'
const PANEL3 = '#241f3d'
const BORDER = '#2b2540'
const TEXT = '#ece9f8'
const MUTED = '#9c97b8'
const ACCENT = '#7c6cff'
const CYAN = '#3fd8f0'

const GRID_MINOR = 'rgba(236, 233, 248, 0.10)'
const AXIS = 'rgba(124, 108, 255, 0.35)'

/** Поля панели свойств: координаты и размер выделенной фигуры. */
const FIELDS = [
  { label: 'X', value: '180', cx: 820, cy: 106 },
  { label: 'Y', value: '140', cx: 930, cy: 106 },
  { label: 'W', value: '280', cx: 820, cy: 146 },
  { label: 'H', value: '180', cx: 930, cy: 146 },
]

/** Палитра пресетов — те же цвета, что в PropertiesPanel редактора. */
const PRESETS = ['#7c6cff', '#3fd8f0', '#f66fc8', '#4ade80', '#f5a623', '#ff5d5d', '#ece9f8', '#1b1727']

/** Маркеры выделения: 4 угла + середины сторон рамки. */
const HANDLES = [
  [176, 136],
  [320, 136],
  [464, 136],
  [176, 230],
  [464, 230],
  [176, 324],
  [320, 324],
  [464, 324],
]

export function EditorWindow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1040 660"
      className={`font-sans h-auto w-full ${className}`}
      role="img"
      aria-label="Макет интерфейса редактора Мини Фигма: панель инструментов, холст с фигурами и панели свойств и слоёв"
    >
      <defs>
        <clipPath id="editor-window">
          <rect x="0" y="0" width="1040" height="660" rx="18" />
        </clipPath>
        <clipPath id="editor-canvas">
          <rect x="64" y="48" width="736" height="612" />
        </clipPath>
        <pattern id="editor-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#241f36" />
        </pattern>
        <linearGradient id="editor-logo-grad" x1="22" y1="12" x2="46" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a259ff" />
          <stop offset="1" stopColor="#1abcfe" />
        </linearGradient>
      </defs>

      <g clipPath="url(#editor-window)">
        <rect x="0" y="0" width="1040" height="660" fill={BG} />

        {/* ---------------------------- Верхняя панель --------------------------- */}
        <rect x="0" y="0" width="1040" height="48" fill={PANEL} />
        <line x1="0" y1="48" x2="1040" y2="48" stroke={BORDER} strokeWidth="1.5" />

        <rect x="22" y="12" width="24" height="24" rx="7" fill="url(#editor-logo-grad)" />
        <rect x="27" y="17" width="6.5" height="6.5" rx="1.6" fill="#ffffff" />
        <circle cx="38" cy="28" r="3.6" fill="#ffffff" fillOpacity="0.9" />
        <text x="52" y="31" fontSize="15" fontWeight="700" fill={TEXT}>
          Мини Фигма
        </text>
        <text x="520" y="30" textAnchor="middle" fontSize="12" fill={MUTED}>
          Выбор — V · Прямоугольник — R · Эллипс — O
        </text>
        <text x="1010" y="30" textAnchor="end" fontSize="12" fill={MUTED}>
          На главную
        </text>

        {/* ------------------------- Панель инструментов ------------------------- */}
        <rect x="0" y="48" width="64" height="612" fill={PANEL} />
        <line x1="64" y1="48" x2="64" y2="660" stroke={BORDER} strokeWidth="1.5" />
        <text x="32" y="78" textAnchor="middle" fontSize="12" fontWeight="700" fill={MUTED}>
          MF
        </text>

        <rect x="12" y="96" width="40" height="40" rx="10" fill="rgba(124,108,255,0.18)" />
        <path
          d="M25 106l13 9-6 1.2-2.6 6z"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <rect x="25" y="157" width="14" height="14" rx="2" fill="none" stroke={MUTED} strokeWidth="1.6" />
        <circle cx="32" cy="205" r="7.5" fill="none" stroke={MUTED} strokeWidth="1.6" />

        {/* -------------------------------- Холст -------------------------------- */}
        <rect x="64" y="48" width="736" height="612" fill={BG} />
        <g clipPath="url(#editor-canvas)">
          <rect x="64" y="48" width="736" height="612" fill="url(#editor-grid)" />
          {[64, 224, 384, 544, 704].map((x) => (
            <line key={`gv-${x}`} x1={x} y1="48" x2={x} y2="660" stroke={GRID_MINOR} strokeWidth="1" />
          ))}
          {[48, 208, 368, 528].map((y) => (
            <line key={`gh-${y}`} x1="64" y1={y} x2="800" y2={y} stroke={GRID_MINOR} strokeWidth="1" />
          ))}
          <line x1="384" y1="48" x2="384" y2="660" stroke={AXIS} strokeWidth="1.5" />
          <line x1="64" y1="368" x2="800" y2="368" stroke={AXIS} strokeWidth="1.5" />

          {/* Эллипс (не выделен) */}
          <ellipse cx="620" cy="440" rx="110" ry="80" fill={CYAN} />

          {/* Выделенный прямоугольник */}
          <rect x="180" y="140" width="280" height="180" rx="4" fill={ACCENT} />
          <rect x="176" y="136" width="288" height="188" fill="none" stroke={ACCENT} strokeWidth="2" />
          {HANDLES.map(([hx, hy]) => (
            <rect
              key={`${hx}-${hy}`}
              x={hx - 4}
              y={hy - 4}
              width="8"
              height="8"
              fill="#ffffff"
              stroke={ACCENT}
              strokeWidth="2"
            />
          ))}
          <rect x="176" y="108" width="128" height="22" rx="6" fill={ACCENT} />
          <text x="186" y="123" fontSize="12" fontWeight="600" fill="#ffffff">
            Прямоугольник
          </text>

          {/* Масштаб */}
          <rect x="84" y="606" width="70" height="30" rx="8" fill={PANEL2} stroke={BORDER} />
          <text x="119" y="626" textAnchor="middle" fontSize="12" fontWeight="600" fill={TEXT}>
            100%
          </text>
        </g>

        {/* --------------------------- Панель свойств ---------------------------- */}
        <rect x="800" y="48" width="240" height="612" fill={PANEL} />
        <line x1="800" y1="48" x2="800" y2="660" stroke={BORDER} strokeWidth="1.5" />
        <text x="820" y="80" fontSize="12" fontWeight="700" fill={TEXT}>
          Свойства
        </text>
        <line x1="820" y1="94" x2="1020" y2="94" stroke={BORDER} strokeWidth="1" />

        {FIELDS.map((field) => (
          <g key={field.label}>
            <rect x={field.cx} y={field.cy} width="92" height="30" rx="7" fill={PANEL2} />
            <text x={field.cx + 11} y={field.cy + 20} fontSize="11" fill={MUTED}>
              {field.label}
            </text>
            <text x={field.cx + 30} y={field.cy + 20} fontSize="11.5" fill={TEXT}>
              {field.value}
            </text>
          </g>
        ))}

        <text x="820" y="204" fontSize="10.5" fontWeight="600" fill={MUTED}>
          Заливка
        </text>
        <rect x="820" y="212" width="200" height="32" rx="7" fill={PANEL2} />
        <rect x="828" y="218" width="20" height="20" rx="5" fill={ACCENT} />
        <text x="858" y="232" fontSize="11.5" fill={TEXT}>
          7C6CFF
        </text>
        <text x="1012" y="232" textAnchor="end" fontSize="10.5" fill={MUTED}>
          100%
        </text>

        {PRESETS.map((color, i) => (
          <circle key={color} cx={832 + i * 24} cy={272} r="9" fill={color} stroke={BORDER} strokeWidth="1" />
        ))}

        {/* ---------------------------- Панель слоёв ----------------------------- */}
        <text x="820" y="330" fontSize="12" fontWeight="700" fill={TEXT}>
          Слои
        </text>
        <line x1="820" y1="344" x2="1020" y2="344" stroke={BORDER} strokeWidth="1" />

        <rect x="812" y="354" width="216" height="34" rx="7" fill={PANEL3} />
        <rect x="824" y="364" width="13" height="13" rx="2" fill="none" stroke={TEXT} strokeWidth="1.3" />
        <text x="846" y="376" fontSize="11.5" fill={TEXT}>
          Прямоугольник 2
        </text>
        <text x="1018" y="376" textAnchor="end" fontSize="10.5" fill={MUTED}>
          2
        </text>

        <circle cx="830.5" cy="409" r="6.5" fill="none" stroke={MUTED} strokeWidth="1.3" />
        <text x="846" y="413" fontSize="11.5" fill={MUTED}>
          Эллипс 1
        </text>
        <text x="1018" y="413" textAnchor="end" fontSize="10.5" fill={MUTED}>
          1
        </text>
      </g>

      <rect
        x="1"
        y="1"
        width="1038"
        height="658"
        rx="17"
        fill="none"
        stroke={BORDER}
        strokeWidth="2"
      />
    </svg>
  )
}
