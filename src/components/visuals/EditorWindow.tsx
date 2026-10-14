/**
 * src/components/visuals/EditorWindow.tsx — векторный макет окна редактора Figma.
 * Это достоверная иллюстрация интерфейса (панели, холст, слои, свойства),
 * нарисованная в SVG, а не скриншот: масштабируется без потерь и весит мало.
 */

type LayerRow = {
  label: string
  kind: 'frame' | 'text' | 'rect' | 'component' | 'icon'
  depth: number
  active?: boolean
}

const LAYERS: LayerRow[] = [
  { label: 'Mobile App', kind: 'frame', depth: 0, active: true },
  { label: 'Hero', kind: 'frame', depth: 1 },
  { label: 'Image', kind: 'rect', depth: 2 },
  { label: 'Title', kind: 'text', depth: 2 },
  { label: 'Button / Primary', kind: 'component', depth: 1 },
  { label: 'Feature Card', kind: 'frame', depth: 1 },
  { label: 'Icons', kind: 'icon', depth: 1 },
]

function LayerGlyph({ kind, x, y }: { kind: LayerRow['kind']; x: number; y: number }) {
  switch (kind) {
    case 'frame':
      return (
        <g stroke="#9a9a9a" strokeWidth="1.3" fill="none">
          <path d={`M${x - 3} ${y - 4.5}h3M${x} ${y - 4.5}v9M${x - 4.5} ${y - 3}v3M${x + 4.5} ${y - 3}v3`} />
        </g>
      )
    case 'text':
      return (
        <text x={x} y={y + 3.4} fontSize="9" fontWeight="700" fill="#9a9a9a" textAnchor="middle">
          T
        </text>
      )
    case 'rect':
      return <rect x={x - 4} y={y - 4} width="8" height="8" rx="1.6" fill="none" stroke="#9a9a9a" strokeWidth="1.3" />
    case 'component':
      return (
        <path
          d={`M${x} ${y - 4.6}l4.6 4.6-4.6 4.6L${x - 4.6} ${y}z`}
          fill="none"
          stroke="#a259ff"
          strokeWidth="1.3"
        />
      )
    case 'icon':
      return <circle cx={x} cy={y} r="4" fill="none" stroke="#9a9a9a" strokeWidth="1.3" />
  }
}

type Field = { label: string; value: string }

const FIELDS: Field[] = [
  { label: 'X', value: '240' },
  { label: 'Y', value: '96' },
  { label: 'W', value: '230' },
  { label: 'H', value: '460' },
]

export function EditorWindow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1040 660"
      className={`font-sans h-auto w-full ${className}`}
      role="img"
      aria-label="Макет интерфейса Figma: панель слоёв, холст с макетом мобильного экрана и панель свойств"
    >
      <defs>
        <clipPath id="editor-window">
          <rect x="0" y="0" width="1040" height="660" rx="18" />
        </clipPath>
        <linearGradient id="hero-image" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a259ff" />
          <stop offset="55%" stopColor="#7a7cff" />
          <stop offset="100%" stopColor="#1abcfe" />
        </linearGradient>
        <pattern id="canvas-dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#dcdcdc" />
        </pattern>
      </defs>

      <g clipPath="url(#editor-window)">
        <rect x="0" y="0" width="1040" height="660" fill="#ffffff" />

        {/* Панель инструментов сверху */}
        <rect x="0" y="0" width="1040" height="46" fill="#fbfbfb" />
        <line x1="0" y1="46" x2="1040" y2="46" stroke="#ebebeb" strokeWidth="1.5" />
        <circle cx="22" cy="23" r="6" fill="#ff5f57" />
        <circle cx="42" cy="23" r="6" fill="#febc2e" />
        <circle cx="62" cy="23" r="6" fill="#28c840" />
        <text x="520" y="28" textAnchor="middle" fontSize="13" fill="#8a8a8a">
          Mobile App — Figma
        </text>
        <circle cx="922" cy="23" r="11" fill="#0acf83" />
        <text x="922" y="27" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">
          A
        </text>
        <circle cx="944" cy="23" r="11" fill="#a259ff" />
        <text x="944" y="27" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">
          M
        </text>
        <rect x="968" y="11" width="58" height="24" rx="12" fill="#0d0d0d" />
        <text x="997" y="27" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#ffffff">
          Поделиться
        </text>

        {/* Левая панель: слои */}
        <rect x="0" y="46" width="196" height="614" fill="#fcfcfc" />
        <line x1="196" y1="46" x2="196" y2="660" stroke="#ebebeb" strokeWidth="1.5" />
        <text x="20" y="82" fontSize="12.5" fontWeight="600" fill="#0d0d0d">
          Слои
        </text>
        <text x="82" y="82" fontSize="12.5" fill="#b0b0b0">
          Ресурсы
        </text>
        <line x1="20" y1="94" x2="52" y2="94" stroke="#0d0d0d" strokeWidth="2" />

        {LAYERS.map((layer, index) => {
          const y = 122 + index * 34
          const x = 34 + layer.depth * 16
          return (
            <g key={layer.label + index}>
              {layer.active ? (
                <rect x="10" y={y - 15} width="176" height="28" rx="6" fill="#ecebff" />
              ) : null}
              <LayerGlyph kind={layer.kind} x={x} y={y} />
              <text
                x={x + 12}
                y={y + 4}
                fontSize="12"
                fill={layer.active ? '#1b1b1b' : '#5c5c5c'}
                fontWeight={layer.active ? 600 : 400}
              >
                {layer.label}
              </text>
            </g>
          )
        })}

        {/* Холст */}
        <rect x="196" y="46" width="622" height="614" fill="#f1f1f1" />
        <rect x="196" y="46" width="622" height="614" fill="url(#canvas-dots)" />

        {/* Рамка: мобильный экран */}
        <rect x="268" y="96" width="234" height="464" rx="22" fill="#ffffff" stroke="#e4e4e4" strokeWidth="1.5" />
        <rect x="292" y="120" width="186" height="150" rx="14" fill="url(#hero-image)" />
        <rect x="292" y="292" width="120" height="12" rx="6" fill="#1b1b1b" />
        <rect x="292" y="314" width="186" height="8" rx="4" fill="#dcdcdc" />
        <rect x="292" y="330" width="150" height="8" rx="4" fill="#dcdcdc" />
        <rect x="292" y="360" width="110" height="34" rx="17" fill="#0d0d0d" />
        <text x="347" y="382" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">
          Начать
        </text>
        <rect x="292" y="416" width="186" height="60" rx="12" fill="#f7f7f7" />
        <rect x="292" y="492" width="186" height="44" rx="12" fill="#f7f7f7" />

        {/* Рамка: карточка-компонент */}
        <rect x="560" y="150" width="216" height="150" rx="16" fill="#ffffff" stroke="#e4e4e4" strokeWidth="1.5" />
        <path d="M588 176l6 6-6 6-6-6z" fill="none" stroke="#a259ff" strokeWidth="1.6" />
        <text x="604" y="178" fontSize="11" fontWeight="600" fill="#a259ff">
          Component
        </text>
        <rect x="582" y="200" width="140" height="11" rx="5.5" fill="#1b1b1b" />
        <rect x="582" y="222" width="172" height="8" rx="4" fill="#dcdcdc" />
        <rect x="582" y="238" width="120" height="8" rx="4" fill="#dcdcdc" />
        <rect x="582" y="262" width="72" height="24" rx="12" fill="#a259ff" />

        {/* Рамка: прототип */}
        <rect x="560" y="340" width="216" height="130" rx="16" fill="#ffffff" stroke="#e4e4e4" strokeWidth="1.5" />
        <rect x="584" y="366" width="72" height="50" rx="8" fill="#f7f7f7" stroke="#dcdcdc" strokeWidth="1.2" />
        <rect x="668" y="366" width="84" height="50" rx="8" fill="#f7f7f7" stroke="#dcdcdc" strokeWidth="1.2" />
        <path d="M656 391h12" stroke="#0acf83" strokeWidth="2" />
        <path d="M658 387l-4 4 4 4" stroke="#0acf83" strokeWidth="2" fill="none" />

        {/* Соединение прототипа от экрана к карточке */}
        <path
          d="M502 300 C 530 300 532 225 558 225"
          fill="none"
          stroke="#0acf83"
          strokeWidth="2"
          strokeDasharray="1 0"
        />
        <circle cx="502" cy="300" r="5" fill="#0acf83" />
        <path d="M552 219l7 6-7 6" fill="none" stroke="#0acf83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Выделение активной рамки */}
        <rect x="264" y="92" width="242" height="472" fill="none" stroke="#1abcfe" strokeWidth="2" />
        {[
          [264, 92],
          [506, 92],
          [264, 564],
          [506, 564],
        ].map(([hx, hy]) => (
          <rect key={`${hx}-${hy}`} x={hx - 4} y={hy - 4} width="8" height="8" fill="#ffffff" stroke="#1abcfe" strokeWidth="2" />
        ))}
        <rect x="264" y="70" width="96" height="18" rx="4" fill="#1abcfe" />
        <text x="272" y="83" fontSize="11" fontWeight="600" fill="#ffffff">
          Mobile / Home
        </text>

        {/* Правая панель: свойства */}
        <rect x="818" y="46" width="222" height="614" fill="#fcfcfc" />
        <line x1="818" y1="46" x2="818" y2="660" stroke="#ebebeb" strokeWidth="1.5" />
        <text x="838" y="82" fontSize="12.5" fontWeight="600" fill="#0d0d0d">
          Дизайн
        </text>
        <text x="896" y="82" fontSize="12.5" fill="#b0b0b0">
          Прототип
        </text>
        <line x1="838" y1="94" x2="878" y2="94" stroke="#0d0d0d" strokeWidth="2" />

        {/* Выравнивание */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={`align-${i}`}
            x={838 + i * 26}
            y={108}
            width="16"
            height="16"
            rx="3"
            fill="none"
            stroke="#c4c4c4"
            strokeWidth="1.3"
          />
        ))}

        <text x="838" y="150" fontSize="11" fontWeight="600" fill="#8a8a8a">
          Размер
        </text>
        {FIELDS.map((field, i) => {
          const col = i % 2
          const row = Math.floor(i / 2)
          const fx = 838 + col * 92
          const fy = 162 + row * 36
          return (
            <g key={field.label}>
              <rect x={fx} y={fy} width="84" height="28" rx="7" fill="#f2f2f2" />
              <text x={fx + 12} y={fy + 18} fontSize="11" fill="#a0a0a0">
                {field.label}
              </text>
              <text x={fx + 30} y={fy + 18} fontSize="11.5" fill="#2b2b2b">
                {field.value}
              </text>
            </g>
          )
        })}

        <text x="838" y="268" fontSize="11" fontWeight="600" fill="#8a8a8a">
          Заливка
        </text>
        <g>
          <rect x="838" y="280" width="192" height="30" rx="7" fill="#f2f2f2" />
          <rect x="846" y="284" width="22" height="22" rx="5" fill="#1abcfe" stroke="#ffffff" strokeWidth="1.5" />
          <text x="878" y="299" fontSize="11.5" fill="#2b2b2b">
            1ABC FE
          </text>
          <text x="1012" y="299" fontSize="11" fill="#a0a0a0" textAnchor="end">
            100%
          </text>
        </g>
        <text x="838" y="338" fontSize="11" fontWeight="600" fill="#8a8a8a">
          Обводка
        </text>
        <g>
          <rect x="838" y="350" width="192" height="30" rx="7" fill="#f2f2f2" />
          <rect x="846" y="354" width="22" height="22" rx="5" fill="#ffffff" stroke="#dcdcdc" strokeWidth="1.2" />
          <text x="878" y="369" fontSize="11.5" fill="#2b2b2b">
            E6E6E6
          </text>
          <text x="1012" y="369" fontSize="11" fill="#a0a0a0" textAnchor="end">
            1 px
          </text>
        </g>
        <text x="838" y="408" fontSize="11" fontWeight="600" fill="#8a8a8a">
          Эффекты
        </text>
        <g>
          <rect x="838" y="420" width="192" height="30" rx="7" fill="#f2f2f2" />
          <text x="850" y="439" fontSize="11.5" fill="#2b2b2b">
            Тень · 0 4 12
          </text>
        </g>

        <text x="838" y="488" fontSize="11" fontWeight="600" fill="#8a8a8a">
          Экспорт
        </text>
        <rect x="838" y="500" width="192" height="34" rx="8" fill="#0d0d0d" />
        <text x="934" y="521" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">
          Экспортировать
        </text>
      </g>

      <rect
        x="1"
        y="1"
        width="1038"
        height="658"
        rx="17"
        fill="none"
        stroke="#e6e6e6"
        strokeWidth="2"
      />
    </svg>
  )
}
