import { getRequestConfig } from "next-intl/server";
import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from "next-intl/navigation";

export const locales = ["en", "vi", "ja"];

export const localeNames: Record<string, string> = {
  en: "English",
  vi: "Tiếng Việt",
  ja: "日本語",
};

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));

export const pathnames = {
  "/": "/",
  "/documents": "/documents",
  "/documents/[documentId]": "/documents/[documentId]",
  "/preview/[documentId]": "/preview/[documentId]",
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, pathnames });
