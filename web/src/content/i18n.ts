// All interface text, in English and French. Add a language = add a dictionary here.
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

const en = {
  meta: {
    title: "CS student who builds things",
    description: "Portfolio of a computer science student: projects, what each one taught me, and how to get in touch.",
  },
  nav: { label: "Main", projects: "Projects", contact: "Contact", github: "GitHub", switchTo: "Français", switchLabel: "Lire en français" },
  hero: {
    headline: "I learn computer science by building things.",
    intro:
      "I'm a CS student. For each project I pick a new area of computer science, from AI tooling to emulators, and build something real with it.",
    seeProjects: "See my projects",
    githubProfile: "GitHub profile",
  },
  projects: {
    title: "What I’m building",
    intro: "Projects in the order I build them. Each one is a new area of computer science, and finished ones link to their code.",
    projectLabel: "Project",
    techLabel: "Technologies",
    status: { live: "Released", building: "Building now", planned: "Coming soon" },
  },
  contact: {
    title: "Get in touch",
    intro: "Internship, project, or a question about something I built? Send me a message and I’ll reply by email.",
    name: "Your name",
    email: "Your email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    waking: "Sending… the server is waking up after a nap, this can take up to a minute.",
    sent: "Message sent. Thanks, I’ll reply by email.",
    invalid: "Check the form: a valid email address and a message of at least 10 characters are needed.",
    tooMany: "Too many messages for now. Try again in a few minutes.",
    unavailable: "Messages can’t be delivered right now. Try again later, or reach me on GitHub.",
    failed: "Your message couldn’t be delivered. Try again later.",
    noAnswer: "The server didn’t answer. Check your connection and try again.",
  },
  footer: { github: "GitHub" },
};

export type Dictionary = typeof en;

const fr: Dictionary = {
  meta: {
    title: "J’étudie l’informatique en construisant des projets",
    description: "Mon portfolio en informatique : mes projets, ce que chacun m’a appris, et comment me contacter.",
  },
  nav: { label: "Principal", projects: "Projets", contact: "Contact", github: "GitHub", switchTo: "English", switchLabel: "Read in English" },
  hero: {
    headline: "J’apprends l’informatique en construisant des choses.",
    intro:
      "J’étudie l’informatique. Pour chaque projet, je choisis un nouveau domaine, des outils d’IA aux émulateurs, et je construis quelque chose de concret.",
    seeProjects: "Voir mes projets",
    githubProfile: "Profil GitHub",
  },
  projects: {
    title: "Ce que je construis",
    intro: "Mes projets, dans l’ordre où je les construis. Chacun explore un nouveau domaine de l’informatique, et ceux qui sont terminés renvoient vers leur code.",
    projectLabel: "Projet",
    techLabel: "Technologies",
    status: { live: "Publié", building: "En cours", planned: "Bientôt" },
  },
  contact: {
    title: "Me contacter",
    intro: "Un stage, un projet ou une question sur ce que j’ai construit ? Envoyez-moi un message, je vous répondrai par e-mail.",
    name: "Votre nom",
    email: "Votre e-mail",
    message: "Message",
    send: "Envoyer le message",
    sending: "Envoi…",
    waking: "Envoi… le serveur se réveille après une pause, cela peut prendre jusqu’à une minute.",
    sent: "Message envoyé. Merci, je vous réponds par e-mail.",
    invalid: "Vérifiez le formulaire : il faut une adresse e-mail valide et un message d’au moins 10 caractères.",
    tooMany: "Trop de messages pour le moment. Réessayez dans quelques minutes.",
    unavailable: "Les messages ne peuvent pas être envoyés pour l’instant. Réessayez plus tard, ou contactez-moi sur GitHub.",
    failed: "Votre message n’a pas pu être envoyé. Réessayez plus tard.",
    noAnswer: "Le serveur ne répond pas. Vérifiez votre connexion et réessayez.",
  },
  footer: { github: "GitHub" },
};

export const dictionaries: Record<Locale, Dictionary> = { en, fr };

/** Pick the best supported language from an Accept-Language header ("fr-FR,fr;q=0.9,en;q=0.8"). */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((x) => x.q > 0)
    .sort((a, b) => b.q - a.q);
  return ranked.map((x) => x.lang).find(isLocale) ?? defaultLocale;
}
