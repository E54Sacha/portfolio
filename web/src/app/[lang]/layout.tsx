import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";
import { dictionaries, isLocale, locales } from "@/content/i18n";
import { site } from "@/content/site";
import { themeScript } from "@/components/theme-script";
import "../globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

// Build one static page per language; any other /xx is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dictionaries[lang].meta;
  return {
    metadataBase: new URL(site.url), // search engines need full URLs in hreflang links
    title: `${site.name} | ${t.title}`,
    description: t.description,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", fr: "/fr", "x-default": "/en" } },
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    // suppressHydrationWarning: themeScript may add the "dark" class before React loads.
    <html lang={lang} className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
