import type { Theme } from "../hooks/useTheme";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
  buttonGhost: string;
};

export default function ThemeToggle({ theme, onToggle, buttonGhost }: ThemeToggleProps) {
  return (
    <button
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${buttonGhost}`}
      onClick={onToggle}
    >
      {theme === "dark" ? "Light" : "Dark"} mode
    </button>
  );
}
