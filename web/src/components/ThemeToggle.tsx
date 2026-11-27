"use client";

// Switches between light and dark. The choice is saved; without one, the site follows the system setting
// (see theme-script.ts, run by the layout, which applies it before the page is painted, so there is no flash).
export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // storage blocked (private window): the switch still works for this page
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-full border-2 border-paper/60 transition-transform hover:border-paper active:rotate-45"
    >
      {/* Moon in light mode, sun in dark mode: CSS picks one, so server and browser render the same HTML. */}
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 dark:hidden" fill="currentColor">
        <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="hidden h-5 w-5 dark:block" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
      </svg>
    </button>
  );
}
