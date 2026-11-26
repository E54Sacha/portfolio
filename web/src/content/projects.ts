// One entry per project, in build order. Add a project = add an object here.
export type ProjectStatus = "live" | "building" | "planned";

export type Project = {
  number: number;
  title: string;
  pitch: string;
  status: ProjectStatus;
  /** Tailwind colour name used for the tile, from tailwind.config.ts */
  color: "tangerine" | "mint" | "bubblegum" | "sunflower" | "lilac";
  tech: string[];
  /** 1-2 short facts that prove the project is real */
  proof?: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    number: 0,
    title: "claude-dev-toolkit",
    pitch: "A Claude Code plugin that scopes my projects, teaches me what I build and ships my releases.",
    status: "live",
    color: "tangerine",
    tech: ["Claude Code", "Node.js", "JavaScript"],
    proof: ["v0.1.0 released", "19 automated tests"],
    links: [
      { label: "Code on GitHub", href: "https://github.com/E54Sacha/claude-dev-toolkit" },
      { label: "Lessons it wrote", href: "https://e54sacha.github.io/lessons/" },
    ],
  },
  {
    number: 1,
    title: "This portfolio",
    pitch: "The site you're on: a Next.js front end with a small FastAPI back end for the contact form.",
    status: "building",
    color: "mint",
    tech: ["Next.js", "TypeScript", "FastAPI"],
  },
  {
    number: 2,
    title: "Habit tracker",
    pitch: "A full-stack habit tracker with accounts, a PostgreSQL database, Docker and automatic deploys.",
    status: "planned",
    color: "bubblegum",
    tech: ["PostgreSQL", "Docker", "CI/CD"],
  },
  {
    number: 3,
    title: "CS revision game",
    pitch: "A revision game for web and phone with spaced repetition, fed by the quizzes my tutor writes.",
    status: "planned",
    color: "sunflower",
    tech: ["Expo", "React Native", "TypeScript"],
  },
  {
    number: 4,
    title: "CHIP-8 emulator",
    pitch: "A CPU emulator that runs games from the 1970s in your browser.",
    status: "planned",
    color: "lilac",
    tech: ["TypeScript", "Canvas"],
  },
];
