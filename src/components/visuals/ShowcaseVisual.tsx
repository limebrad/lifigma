/**
 * src/components/visuals/ShowcaseVisual.tsx — три векторные иллюстрации для
 * галереи возможностей: макеты, компоненты и прототипы. Воспроизводят
 * типичные рабочие сцены Figma и служат фоном карточек-примеров.
 */
import type { ComponentType } from 'react'
import type { ShowcaseVariant } from '../../types/landing'

const LABELS: Record<ShowcaseVariant, string> = {
  layouts: 'Холст Figma с двумя макетами экранов и направляющими выравнивания',
  components: 'Компоненты кнопок с вариантами и палитра цветовых стилей',
  prototypes: 'Два экрана, соединённые интерактивным переходом прототипа',
}

function Layouts() {
  return (
    <>
      <rect width="420" height="300" rx="16" fill="#f4f4f4" />
      {/* Макет десктопного экрана */}
      <rect x="28" y="36" width="212" height="228" rx="10" fill="#ffffff" stroke="#e6e6e6" />
      <rect x="44" y="52" width="180" height="26" rx="6" fill="#f1f1f1" />
      <rect x="54" y="61" width="42" height="8" rx="4" fill="#d6d6d6" />
      <circle cx="212" cy="65" r="6" fill="#a259ff" />
      <rect x="44" y="92" width="102" height="72" rx="8" fill="#ecebff" />
      <rect x="156" y="92" width="68" height="72" rx="8" fill="#f1f1f1" />
      <rect x="44" y="178" width="180" height="8" rx="4" fill="#dedede" />
      <rect x="44" y="194" width="136" height="8" rx="4" fill="#dedede" />
      <rect x="44" y="218" width="86" height="28" rx="14" fill="#0d0d0d" />
      {/* Макет мобильного экрана */}
      <rect x="264" y="64" width="128" height="200" rx="16" fill="#ffffff" stroke="#e6e6e6" />
      <rect x="276" y="78" width="104" height="74" rx="9" fill="#1abcfe" />
      <rect x="276" y="164" width="68" height="9" rx="4.5" fill="#1b1b1b" />
      <rect x="276" y="182" width="104" height="7" rx="3.5" fill="#dedede" />
      <rect x="276" y="196" width="80" height="7" rx="3.5" fill="#dedede" />
      <rect x="276" y="220" width="70" height="24" rx="12" fill="#0d0d0d" />
      {/* Направляющие выравнивания */}
      <line x1="256" y1="36" x2="256" y2="264" stroke="#1abcfe" strokeWidth="1.2" strokeDasharray="4 4" />
      <line x1="28" y1="164" x2="392" y2="164" stroke="#1abcfe" strokeWidth="1.2" strokeDasharray="4 4" />
      <rect x="246" y="150" width="44" height="16" rx="4" fill="#1abcfe" />
      <text x="268" y="162" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ffffff">
        1280
      </text>
    </>
  )
}

function Components() {
  const colors = [
    { fill: '#a259ff', label: 'A259FF' },
    { fill: '#1abcfe', label: '1ABCFE' },
    { fill: '#0acf83', label: '0ACF83' },
    { fill: '#f24e1e', label: 'F24E1E' },
  ]

  return (
    <>
      <rect width="420" height="300" rx="16" fill="#ffffff" />
      {/* Карточка компонента */}
      <rect x="28" y="34" width="364" height="122" rx="12" fill="#f7f7f7" stroke="#ececec" />
      <path d="M46 54l7 7-7 7-7-7z" fill="none" stroke="#a259ff" strokeWidth="1.8" />
      <text x="64" y="64" fontSize="12" fontWeight="600" fill="#a259ff">
        Button / Primary
      </text>
      {/* Варианты кнопки */}
      <rect x="48" y="86" width="104" height="40" rx="20" fill="#0d0d0d" />
      <text x="100" y="111" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">
        Default
      </text>
      <rect x="164" y="86" width="104" height="40" rx="20" fill="#a259ff" />
      <text x="216" y="111" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ffffff">
        Hover
      </text>
      <rect x="280" y="86" width="94" height="40" rx="20" fill="#ededed" />
      <text x="327" y="111" textAnchor="middle" fontSize="12" fontWeight="600" fill="#a0a0a0">
        Disabled
      </text>
      {/* Цветовые стили */}
      <rect x="28" y="172" width="364" height="94" rx="12" fill="#f7f7f7" stroke="#ececec" />
      <text x="46" y="196" fontSize="11" fontWeight="600" fill="#8a8a8a">
        Цветовые стили
      </text>
      {colors.map((color, i) => (
        <g key={color.label}>
          <circle cx={60 + i * 92} cy={226} r="14" fill={color.fill} />
          <text x={60 + i * 92} y={254} textAnchor="middle" fontSize="9.5" fill="#8a8a8a">
            {color.label}
          </text>
        </g>
      ))}
    </>
  )
}

function Prototypes() {
  return (
    <>
      <rect width="420" height="300" rx="16" fill="#f4f4f4" />
      {/* Экран A */}
      <rect x="34" y="66" width="118" height="184" rx="16" fill="#ffffff" stroke="#e6e6e6" />
      <rect x="46" y="80" width="94" height="66" rx="9" fill="#a259ff" />
      <rect x="46" y="158" width="60" height="9" rx="4.5" fill="#1b1b1b" />
      <rect x="46" y="176" width="94" height="7" rx="3.5" fill="#dedede" />
      <rect x="46" y="200" width="70" height="26" rx="13" fill="#0d0d0d" />
      {/* Экран B */}
      <rect x="268" y="66" width="118" height="184" rx="16" fill="#ffffff" stroke="#e6e6e6" />
      <rect x="280" y="80" width="94" height="46" rx="9" fill="#1abcfe" />
      <rect x="280" y="138" width="94" height="46" rx="9" fill="#0acf83" />
      <rect x="280" y="198" width="72" height="9" rx="4.5" fill="#1b1b1b" />
      {/* Связь прототипа */}
      <path d="M152 214 C 210 214 210 150 268 150" fill="none" stroke="#0acf83" strokeWidth="2.4" />
      <circle cx="152" cy="214" r="6" fill="#0acf83" />
      <circle cx="268" cy="150" r="6" fill="#0acf83" />
      <path d="M258 143l9 7-9 7" fill="none" stroke="#0acf83" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Курсор */}
      <path d="M212 108l4 22 6-8 9 3z" fill="#0d0d0d" stroke="#ffffff" strokeWidth="1.6" />
      {/* Плашка Interactive */}
      <rect x="150" y="121" width="86" height="20" rx="10" fill="#0d0d0d" />
      <text x="193" y="135" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#ffffff">
        ▶ Interactive
      </text>
    </>
  )
}

const VARIANTS: Record<ShowcaseVariant, ComponentType> = {
  layouts: Layouts,
  components: Components,
  prototypes: Prototypes,
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
