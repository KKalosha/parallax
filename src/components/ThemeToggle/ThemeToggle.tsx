import { useTheme } from '@/context/ThemeContext'

import './ThemeToggle.scss'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? (
        <span className="icon">🌙</span>
      ) : (
        <span className="icon">☀️</span>
      )}
    </button>
  )
}

export default ThemeToggle