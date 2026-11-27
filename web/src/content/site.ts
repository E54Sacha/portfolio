// Personal details that don't depend on the language. Interface text is in i18n.ts.
import type { Locale } from "./i18n";

export const site = {
  name: "Sacha Lévi",
  // The live site, used to turn links in <head> (languages, canonical) into full URLs.
  url: "https://portfolio-five-khaki-3lwpzpubw8.vercel.app",
  // The FastAPI back end on Render (public URL, not a secret).
  apiUrl: "https://portfolio-api-1lil.onrender.com",
  links: {
    github: "https://github.com/E54Sacha",
    linkedin: "https://www.linkedin.com/in/sacha-levi-0a11332b5",
  },
  // One CV per language, in web/public/ (web versions: no phone number or date of birth).
  // Set a value to "" to hide the download button for that language.
  cv: {
    en: "/CV-Sacha-Levi-EN.pdf",
    fr: "/CV-Sacha-Levi-FR.pdf",
  } satisfies Record<Locale, string>,
};
