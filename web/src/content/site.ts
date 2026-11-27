// Personal details that don't depend on the language. Interface text is in i18n.ts.
export const site = {
  name: "Sacha Lévi",
  // The live site, used to turn links in <head> (languages, canonical) into full URLs.
  url: "https://portfolio-five-khaki-3lwpzpubw8.vercel.app",
  // The FastAPI back end on Render (public URL, not a secret).
  apiUrl: "https://portfolio-api-1lil.onrender.com",
  links: {
    github: "https://github.com/E54Sacha",
    // Empty = not shown. Add the URL once the profile exists.
    linkedin: "",
  },
  cv: {
    href: "/cv.pdf", // the file goes in web/public/cv.pdf
    // Set to true once web/public/cv.pdf is the web version of the CV (no phone number or date of birth).
    ready: false,
  },
};
