/**
 * src/components/visuals/ShowcaseVisual.tsx — три векторные иллюстрации для
 * галереи возможностей. Каждая повторяет реальную часть редактора:
 * фигуры, свободный холст с камерой и панели слоёв и свойств. Рисуются
 * в тёмной палитре проекта, поэтому совпадают с самим редактором.
 */
import type { ComponentType, ReactNode } from 'react'
import type { ShowcaseVariant } from '../../types/landing'

const LABELS: Record<ShowcaseVariant, string> = {
  shapes: 'Холст редактора: выделенный прямоугольник и эллипс',
  navigation: 'Свободный холст с сеткой, осями и подсказками по камере',
  panels: 'Панель свойств с координатами и цветом и панель слоёв',
}

/** Тёмный «экран» редактора: фон, сетка точек и скруглённые углы. */
function Screen({ uid, children }: { uid: string; children: ReactNode }) {
  const clip = `sv-clip-${uid}`
  const grid = `sv-grid-${uid}`
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect width="420" height="300" rx="16" />
        </clipPath>
        <pattern id={grid} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#241f36" />
        </pattern>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="420" height="300" fill="#0e0c16" />
        <rect width="420" height="300" fill={`url(#${grid})`} />
        {children}
      </g>
    </>
  )
}

/** Маркеры выделения по углам и серединам сторон прямоугольника. */
function handles(x: number, y: number, w: number, h: number) {
  const right = x + w
  const bottom = y + h
  const midX = x + w / 2
  const midY = y + h / 2
  return [
    [x, y],
    [midX, y],
    [right, y],
    [x, midY],
    [right, midY],
    [x, bottom],
    [midX, bottom],
    [right, bottom],
  ].map(([hx, hy]) => (
    <rect key={`${hx}-${hy}`} x={hx - 4} y={hy - 4} width="8" height="8" fill="#ffffff" stroke="#7c6cff" strokeWidth="2" />
  ))
}

function Shapes() {
  return (
    <Screen uid="shapes">
      {/* Подпись выделенной фигуры */}
      <rect x="52" y="40" width="104" height="21" rx="5" fill="#7c6cff" />
      <text x="62" y="55" fontSize="11" fontWeight="600" fill="#ffffff">
        Прямоугольник
      </text>

      <rect x="56" y="72" width="170" height="120" rx="4" fill="#7c6cff" />
      <rect x="52" y="68" width="178" height="128" fill="none" stroke="#7c6cff" strokeWidth="2" />
      {handles(52, 68, 178, 128)}

      <ellipse cx="312" cy="196" rx="74" ry="56" fill="#3fd8f0" />
    </Screen>
  )
}

function Navigation() {
  const majors = [42, 126, 210, 294, 378]
  return (
    <Screen uid="navigation">
      {/* Крупная сетка */}
      {majors.map((v) => (
        <line key={`v-${v}`} x1={v} y1="0" x2={v} y2="300" stroke="rgba(236,233,248,0.12)" strokeWidth="1" />
      ))}
      {[42, 126, 210, 294].map((h) => (
        <line key={`h-${h}`} x1="0" y1={h} x2="420" y2={h} stroke="rgba(236,233,248,0.12)" strokeWidth="1" />
      ))}

      {/* Мировые оси */}
      <line x1="210" y1="0" x2="210" y2="300" stroke="rgba(124,108,255,0.55)" strokeWidth="1.5" />
      <line x1="0" y1="150" x2="420" y2="150" stroke="rgba(124,108,255,0.55)" strokeWidth="1.5" />

      {/* Подсказка панорамы */}
      <g stroke="#9c97b8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M210 116v68M176 150h68" />
        <path d="M204 122l6-6 6 6M204 178l6 6 6-6M182 144l-6 6 6 6M238 144l6 6-6 6" />
      </g>

      {/* Масштаб */}
      <rect x="332" y="252" width="68" height="28" rx="14" fill="#1b1727" stroke="#2b2540" />
      <text x="366" y="270" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ece9f8">
        100%
      </text>

      {/* Подсказка по управлению */}
      <rect x="20" y="252" width="150" height="28" rx="14" fill="#1b1727" stroke="#2b2540" />
      <text x="95" y="270" textAnchor="middle" fontSize="11.5" fill="#9c97b8">
        Пробел + мышь
      </text>
    </Screen>
  )
}

function Panels() {
  return (
    <Screen uid="panels">
      {/* Холст слева */}
      <rect x="30" y="80" width="150" height="110" rx="4" fill="#7c6cff" />
      <ellipse cx="118" cy="232" rx="62" ry="44" fill="#3fd8f0" />

      {/* Панель справа */}
      <rect x="220" y="0" width="200" height="300" fill="#14111f" />
      <line x1="220" y1="0" x2="220" y2="300" stroke="#2b2540" strokeWidth="1.5" />

      <text x="236" y="34" fontSize="12" fontWeight="700" fill="#ece9f8">
        Свойства
      </text>

      {/* Координаты и размер */}
      {[
        { label: 'X', value: '56', cx: 236, cy: 46 },
        { label: 'Y', value: '72', cx: 326, cy: 46 },
        { label: 'W', value: '170', cx: 236, cy: 80 },
        { label: 'H', value: '120', cx: 326, cy: 80 },
      ].map((field) => (
        <g key={field.label}>
          <rect x={field.cx} y={field.cy} width="82" height="26" rx="6" fill="#1b1727" />
          <text x={field.cx + 10} y={field.cy + 17} fontSize="10.5" fill="#9c97b8">
            {field.label}
          </text>
          <text x={field.cx + 26} y={field.cy + 17} fontSize="11" fill="#ece9f8">
            {field.value}
          </text>
        </g>
      ))}

      <text x="236" y="126" fontSize="10.5" fontWeight="600" fill="#9c97b8">
        Заливка
      </text>
      <rect x="236" y="134" width="170" height="28" rx="6" fill="#1b1727" />
      <rect x="243" y="140" width="16" height="16" rx="4" fill="#7c6cff" />
      <text x="268" y="153" fontSize="11" fill="#ece9f8">
        7C6CFF
      </text>

      {/* Палитра пресетов */}
      {['#7c6cff', '#3fd8f0', '#f66fc8', '#4ade80', '#f5a623', '#ff5d5d', '#ece9f8', '#1b1727'].map(
        (color, i) => (
          <circle
            key={color}
            cx={244 + i * 21}
            cy={188}
            r="9"
            fill={color}
            stroke="#2b2540"
            strokeWidth="1"
          />
        ),
      )}

      <text x="236" y="228" fontSize="12" fontWeight="700" fill="#ece9f8">
        Слои
      </text>
      <line x1="236" y1="240" x2="406" y2="240" stroke="#2b2540" strokeWidth="1" />

      {/* Выделенный слой */}
      <rect x="228" y="248" width="186" height="30" rx="6" fill="#241f3d" />
      <rect x="238" y="259" width="11" height="11" rx="2" fill="none" stroke="#ece9f8" strokeWidth="1.3" />
      <text x="258" y="268" fontSize="11" fill="#ece9f8">
        Прямоугольник 2
      </text>

      {/* Второй слой */}
      <circle cx="243.5" cy="294" r="5.5" fill="none" stroke="#9c97b8" strokeWidth="1.3" />
      <text x="258" y="298" fontSize="11" fill="#9c97b8">
        Эллипс 1
      </text>
    </Screen>
  )
}

const VARIANTS: Record<ShowcaseVariant, ComponentType> = {
  shapes: Shapes,
  navigation: Navigation,
  panels: Panels,
}

export function ShowcaseVisual({ variant }: { variant: ShowcaseVariant }) {
  const Visual = VARIANTS[variant]

  return (
    <svg
      viewBox="0 0 420 300"
      className="font-sans h-auto w-full"
      role="img"
      aria-label={LABELS[variant]}
    >
      <Visual />
    </svg>
  )
}
