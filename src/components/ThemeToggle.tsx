import type { Theme } from '../lib/theme'
import './ThemeToggle.css'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const next = theme === 'dark' ? 'светлый' : 'тёмный'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Включить ${next} режим`}
      title={`Тема: ${theme === 'dark' ? 'тёмная' : 'светлая'}`}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" aria-hidden className="theme-toggle__icon">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path
            d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden className="theme-toggle__icon">
          <path
            d="M19 14.5A7.5 7.5 0 1 1 9.5 5 6 6 0 0 0 19 14.5Z"
            fill="currentColor"
          />
        </svg>
      )}
      <span className="theme-toggle__text">{theme === 'dark' ? 'Светлая' : 'Тёмная'}</span>
    </button>
  )
}
