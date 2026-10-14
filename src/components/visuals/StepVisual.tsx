/**
 * src/components/visuals/StepVisual.tsx — маленькие иллюстрации к трём шагам:
 * страница загрузки, установка и первый проект.
 */

type StepVisualProps = {
  index: number
}

function DownloadPage() {
  return (
    <>
      <rect width="260" height="180" rx="12" fill="#ffffff" stroke="#ececec" />
      <rect width="260" height="26" rx="12" fill="#fbfbfb" />
      <rect y="14" width="260" height="12" fill="#fbfbfb" />
      <circle cx="16" cy="13" r="3.6" fill="#ff5f57" />
      <circle cx="27" cy="13" r="3.6" fill="#febc2e" />
      <circle cx="38" cy="13" r="3.6" fill="#28c840" />
      <text x="20" y="58" fontSize="12" fontWeight="700" fill="#1b1b1b">
        Загрузка Figma
      </text>
      <rect x="20" y="70" width="130" height="8" rx="4" fill="#e6e6e6" />
      {/* macOS */}
      <rect x="20" y="94" width="106" height="34" rx="9" fill="#0d0d0d" />
      <path d="M36 104v10M32 110l4 4 4-4" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="50" y="116" fontSize="10.5" fontWeight="600" fill="#ffffff">
        macOS
      </text>
      {/* Windows */}
      <rect x="134" y="94" width="106" height="34" rx="9" fill="#f2f2f2" />
      <path d="M150 104v10M146 110l4 4 4-4" stroke="#1b1b1b" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="164" y="116" fontSize="10.5" fontWeight="600" fill="#1b1b1b">
        Windows
      </text>
      <rect x="20" y="142" width="180" height="7" rx="3.5" fill="#ededed" />
    </>
  )
}

function Install() {
  return (
    <>
      <rect width="260" height="180" rx="12" fill="#ffffff" stroke="#ececec" />
      <rect width="260" height="26" rx="12" fill="#fbfbfb" />
      <rect y="14" width="260" height="12" fill="#fbfbfb" />
      <circle cx="16" cy="13" r="3.6" fill="#ff5f57" />
      <circle cx="27" cy="13" r="3.6" fill="#febc2e" />
      <circle cx="38" cy="13" r="3.6" fill="#28c840" />
      <circle cx="130" cy="86" r="30" fill="#f5f0ff" />
      <path
        d="M130 70v26M118 84l12 12 12-12"
        fill="none"
        stroke="#a259ff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="44" y="134" width="172" height="12" rx="6" fill="#ededed" />
      <rect x="44" y="134" width="118" height="12" rx="6" fill="#0acf83" />
      <text x="44" y="164" fontSize="10.5" fill="#8a8a8a">
        Установка… 68%
      </text>
    </>
  )
}

function Create() {
  return (
    <>
      <rect width="260" height="180" rx="12" fill="#ffffff" stroke="#ececec" />
      <rect x="14" y="14" width="232" height="152" rx="8" fill="#f4f4f4" />
      {/* новый артборд */}
      <rect x="34" y="34" width="120" height="112" rx="8" fill="#ffffff" stroke="#e6e6e6" />
      <rect x="48" y="48" width="92" height="40" rx="6" fill="#a259ff" />
      <rect x="48" y="98" width="60" height="8" rx="4" fill="#1b1b1b" />
      <rect x="48" y="114" width="92" height="7" rx="3.5" fill="#dedede" />
      {/* рисование */}
      <rect x="172" y="58" width="58" height="58" rx="8" fill="none" stroke="#1abcfe" strokeWidth="1.6" strokeDasharray="4 3" />
      <circle cx="172" cy="58" r="3" fill="#ffffff" stroke="#1abcfe" strokeWidth="1.6" />
      <circle cx="230" cy="116" r="3" fill="#ffffff" stroke="#1abcfe" strokeWidth="1.6" />
      <path d="M158 150l5 26 7-9 10 3z" fill="#0d0d0d" stroke="#ffffff" strokeWidth="1.8" />
      <circle cx="196" cy="46" r="11" fill="#0acf83" />
      <path d="M191 46h10M196 41v10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </>
  )
}

const STEPS = [DownloadPage, Install, Create]

export function StepVisual({ index }: StepVisualProps) {
  const Visual = STEPS[index] ?? DownloadPage

  return (
    <svg viewBox="0 0 260 180" className="font-sans h-auto w-full" aria-hidden="true">
      <Visual />
    </svg>
  )
}
