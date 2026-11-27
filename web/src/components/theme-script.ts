// Runs in <head> before the body is painted, so dark mode never flashes light first.
// A fixed string written here (no visitor input), so inlining it is safe.
// Kept out of ThemeToggle.tsx: a "use client" file can't hand plain values to server components.
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;
