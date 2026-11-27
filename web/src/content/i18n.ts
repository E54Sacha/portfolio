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
  nav: {
    label: "Main",
    projects: "Projects",
    about: "About",
    built: "How it’s built",
    contact: "Contact",
    github: "GitHub",
    switchTo: "Français",
    switchLabel: "Lire en français",
    theme: "Dark mode",
  },
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
  about: {
    title: "About me",
    bio: [
      "I’m Sacha Lévi, a third-year engineering student at EFREI Paris.",
      "Maths and applied physics taught me to model the real world; I approach code the same way, by tackling real problems. Every project here solves one.",
    ],
    cv: "Download my CV (PDF)",
    cvSoon: "CV coming soon",
    github: "My GitHub",
    linkedin: "LinkedIn",
  },
  built: {
    metaTitle: "How this site is built",
    metaDescription: "The architecture of this portfolio: a Next.js front end on Vercel, a FastAPI back end on Render, and email through Resend.",
    title: "How this site is built",
    intro:
      "A static Next.js front end, a small Python API for the contact form, and an email service. Everything runs on free plans, which shaped most of the decisions below.",
    diagramTitle: "What happens when you send me a message",
    steps: [
      { name: "Vercel", detail: "Next.js + TypeScript", arrow: "sends the page" },
      { name: "Your browser", detail: "the form you fill in", arrow: "POST /contact (JSON)" },
      { name: "Render", detail: "FastAPI + Python", arrow: "HTTPS API call" },
      { name: "Resend", detail: "email service", arrow: "delivers the email" },
      { name: "My inbox", detail: "Gmail", arrow: "" },
    ],
    stackTitle: "The stack",
    stack: [
      { part: "Front end", tools: "Next.js 16, TypeScript, Tailwind CSS", why: "Pages are built in advance, so they load fast." },
      { part: "Back end", tools: "FastAPI, pydantic, pytest", why: "One endpoint that checks the message and blocks spam, with 29 tests." },
      { part: "Email", tools: "Resend", why: "Reached over HTTPS, so it works where email ports are blocked." },
      { part: "Hosting", tools: "Vercel, Render", why: "Free plans, deployed automatically from GitHub." },
      { part: "Checks", tools: "Playwright, Lighthouse", why: "Screenshots on phone and desktop, and a score for speed and accessibility." },
    ],
    problemsTitle: "Problems I had to solve",
    problems: [
      {
        title: "The free server falls asleep",
        text: "After 15 minutes without visitors, Render stops the API, and waking it takes up to a minute. The page wakes it as soon as you click in the form, and says so if it’s still waking when you press Send.",
      },
      {
        title: "Email was blocked",
        text: "I first sent messages from my own Gmail over SMTP. Render’s free plan blocks those ports, so the API now sends them through Resend’s web API instead.",
      },
      {
        title: "Spam and abuse",
        text: "A hidden field catches bots, each network can send 5 messages per 10 minutes, and a global cap protects my inbox. A lock stops parallel requests from slipping past the limit.",
      },
      {
        title: "Two languages",
        text: "Each page exists in English and French. Your first visit follows your browser’s language, and the switch in the menu is remembered.",
      },
    ],
    code: "All the code, front end and API, is open on GitHub.",
    codeLink: "Read the code",
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
  nav: {
    label: "Principal",
    projects: "Projets",
    about: "À propos",
    built: "Coulisses du site",
    contact: "Contact",
    github: "GitHub",
    switchTo: "English",
    switchLabel: "Read in English",
    theme: "Mode sombre",
  },
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
  about: {
    title: "À propos",
    bio: [
      "Je suis Sacha Lévi, élève ingénieur en 3e année à l’EFREI Paris.",
      "Les maths et la physique appliquée m’ont appris à modéliser le réel ; j’aborde le code de la même façon, face à de vrais problèmes. Chaque projet ici en résout un.",
    ],
    cv: "Télécharger mon CV (PDF)",
    cvSoon: "CV bientôt disponible",
    github: "Mon GitHub",
    linkedin: "LinkedIn",
  },
  built: {
    metaTitle: "Comment ce site est construit",
    metaDescription: "L’architecture de ce portfolio : un front-end Next.js sur Vercel, un back-end FastAPI sur Render et l’envoi d’e-mails avec Resend.",
    title: "Comment ce site est construit",
    intro:
      "Un front-end Next.js statique, une petite API Python pour le formulaire de contact et un service d’e-mail. Tout tourne sur des offres gratuites, ce qui explique la plupart des choix ci-dessous.",
    diagramTitle: "Ce qui se passe quand vous m’envoyez un message",
    steps: [
      { name: "Vercel", detail: "Next.js + TypeScript", arrow: "envoie la page" },
      { name: "Votre navigateur", detail: "le formulaire que vous remplissez", arrow: "POST /contact (JSON)" },
      { name: "Render", detail: "FastAPI + Python", arrow: "appel d’API en HTTPS" },
      { name: "Resend", detail: "service d’e-mail", arrow: "remet l’e-mail" },
      { name: "Ma boîte mail", detail: "Gmail", arrow: "" },
    ],
    stackTitle: "Les technologies",
    stack: [
      { part: "Front-end", tools: "Next.js 16, TypeScript, Tailwind CSS", why: "Les pages sont générées à l’avance, donc elles s’affichent vite." },
      { part: "Back-end", tools: "FastAPI, pydantic, pytest", why: "Une seule route qui vérifie le message et bloque le spam, avec 29 tests." },
      { part: "E-mail", tools: "Resend", why: "Joignable en HTTPS, donc il fonctionne même quand les ports e-mail sont bloqués." },
      { part: "Hébergement", tools: "Vercel, Render", why: "Offres gratuites, déploiement automatique depuis GitHub." },
      { part: "Vérifications", tools: "Playwright, Lighthouse", why: "Captures sur téléphone et ordinateur, et une note de vitesse et d’accessibilité." },
    ],
    problemsTitle: "Les problèmes que j’ai dû résoudre",
    problems: [
      {
        title: "Le serveur gratuit s’endort",
        text: "Après 15 minutes sans visite, Render arrête l’API, et la réveiller prend jusqu’à une minute. La page la réveille dès que vous cliquez dans le formulaire, et le signale si elle dort encore quand vous envoyez.",
      },
      {
        title: "L’e-mail était bloqué",
        text: "J’envoyais d’abord les messages depuis mon Gmail en SMTP. L’offre gratuite de Render bloque ces ports : l’API passe donc maintenant par l’API web de Resend.",
      },
      {
        title: "Le spam et les abus",
        text: "Un champ caché piège les robots, chaque réseau peut envoyer 5 messages par tranche de 10 minutes, et une limite globale protège ma boîte mail. Un verrou empêche les requêtes simultanées de contourner la limite.",
      },
      {
        title: "Deux langues",
        text: "Chaque page existe en anglais et en français. La première visite suit la langue de votre navigateur, et le choix fait dans le menu est mémorisé.",
      },
    ],
    code: "Tout le code, front-end et API, est public sur GitHub.",
    codeLink: "Voir le code",
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
