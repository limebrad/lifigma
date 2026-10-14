/**
 * src/components/visuals/StepVisual.tsx — маленькие иллюстрации к трём шагам:
 * открыть редактор, нарисовать фигуру и настроить её свойства.
 */

type StepVisualProps = {
  index: number
}

function OpenEditor() {
  return (
    <>
      <rect width="260" height="180" rx="12" fill="#ffffff" stroke="#ececec" />
      <rect width="260" height="26" rx="12" fill="#fbfbfb" />
      <rect y="14" width="260" height="12" fill="#fbfbfb" />
      <circle cx="16" cy="13" r="3.6" fill="#ff5f57" />
      <circle cx="27" cy="13" r="3.6" fill="#febc2e" />
      <circle cx="38" cy="13" r="3.6" fill="#28c840" />
      <rect x="70" y="7" width="120" height="12" rx="6" fill="#efefef" />

      {/* Знак проекта */}
      <defs>
        <linearGradient id="step-logo-grad" x1="116" y1="40" x2="144" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a259ff" />
          <stop offset="1" stopColor="#1abcfe" />
        </linearGradient>
      </defs>
      <rect x="116" y="40" width="28" height="28" rx="8" fill="url(#step-logo-grad)" />
      <rect x="122" y="46" width="8" height="8" rx="2" fill="#ffffff" />
      <circle cx="137.5" cy="61.5" r="4.2" fill="#ffffff" fillOpacity="0.9" />

      {/* Кнопка запуска */}
      <rect x="48" y="90" width="164" height="42" rx="12" fill="#0d0d0d" />
      <text x="130" y="116" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#ffffff">
        Открыть редактор
      </text>
      <path d="M182 124l5 26 7-9 10 3z" fill="#0d0d0d" stroke="#ffffff" strokeWidth="1.8" />
      <rect x="48" y="146" width="120" height="7" rx="3.5" fill="#ededed" />
    </>
  )
}

function DrawShape() {
  return (
    <>
      <rect width="260" height="180" rx="12" fill="#ffffff" stroke="#ececec" />
      {/* Холст */}
      <rect x="14" y="14" width="232" height="152" rx="8" fill="#f4f4f4" />
      {[46, 82, 118, 154, 190].map((x) =>
        [40, 76, 112, 148].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#dcdcdc" />),
      )}

      {/* Готовая фигура */}
      <rect x="28" y="92" width="84" height="56" rx="5" fill="#7c6cff" />

      {/* Фигура, которую рисуют прямо сейчас */}
      <rect
        x="128"
        y="40"
        width="98"
        height="96"
        rx="6"
        fill="#7c6cff"
        fillOpacity="0.16"
        stroke="#7c6cff"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <circle cx="226" cy="136" r="4" fill="#ffffff" stroke="#7c6cff" strokeWidth="2" />
      <path d="M226 136l5 26 7-9 10 3z" fill="#0d0d0d" stroke="#ffffff" strokeWidth="1.8" />
    </>
  )
}

function Adjust() {
  return (
    <>
      <rect width="260" height="180" rx="12" fill="#ffffff" stroke="#ececec" />
      <text x="18" y="32" fontSize="12" fontWeight="700" fill="#1b1b1b">
        Свойства
      </text>

      {[
        { label: 'X', value: '56', cx: 18, cy: 42 },
        { label: 'Y', value: '72', cx: 134, cy: 42 },
        { label: 'W', value: '170', cx: 18, cy: 72 },
        { label: 'H', value: '120', cx: 134, cy: 72 },
      ].map((field) => (
        <g key={field.label}>
          <rect x={field.cx} y={field.cy} width="108" height="24" rx="6" fill="#f2f2f2" />
          <text x={field.cx + 10} y={field.cy + 16} fontSize="10.5" fill="#a0a0a0">
            {field.label}
          </text>
          <text x={field.cx + 26} y={field.cy + 16} fontSize="11" fill="#2b2b2b">
            {field.value}
          </text>
        </g>
      ))}

      <text x="18" y="116" fontSize="10.5" fontWeight="600" fill="#8a8a8a">
        Заливка
      </text>
      <rect x="18" y="122" width="224" height="30" rx="7" fill="#f2f2f2" />
      <rect x="26" y="127" width="20" height="20" rx="5" fill="#7c6cff" />
      <text x="56" y="143" fontSize="11" fill="#2b2b2b">
        7C6CFF
      </text>

      {['#7c6cff', '#3fd8f0', '#f66fc8', '#4ade80', '#f5a623', '#ff5d5d', '#ece9f8', '#1b1727'].map(
        (color, i) => (
          <circle
            key={color}
            cx={30 + i * 26}
            cy={166}
            r="8"
            fill={color}
            stroke="#e0e0e0"
            strokeWidth="1"
          />
        ),
      )}
    </>
  )
}

const STEPS = [OpenEditor, DrawShape, Adjust]

export function StepVisual({ index }: StepVisualProps) {
  const Visual = STEPS[index] ?? OpenEditor

  return (
    <svg viewBox="0 0 260 180" className="font-sans h-auto w-full" aria-hidden="true">
      <Visual />
    </svg>
  )
}
