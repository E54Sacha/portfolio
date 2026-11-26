import type { Project } from "@/content/projects";

// Full class names (not built from strings) so Tailwind keeps them in the CSS.
export const tileBg: Record<Project["color"], string> = {
  tangerine: "bg-tangerine",
  mint: "bg-mint",
  bubblegum: "bg-bubblegum",
  sunflower: "bg-sunflower",
  lilac: "bg-lilac",
};

export const tileBorder: Record<Project["color"], string> = {
  tangerine: "border-tangerine",
  mint: "border-mint",
  bubblegum: "border-bubblegum",
  sunflower: "border-sunflower",
  lilac: "border-lilac",
};

export const pad = (n: number) => String(n).padStart(2, "0");
