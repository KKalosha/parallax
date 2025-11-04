import { useTheme } from "@/context/ThemeContext";

import "./ThemeToggle.scss";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      data-theme={theme}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <img src="/icons/moon.svg" alt="Moon" />
      ) : (
        <img src="/icons/sun.svg" alt="Sun" />
      )}
    </button>
  );
};

export default ThemeToggle;
