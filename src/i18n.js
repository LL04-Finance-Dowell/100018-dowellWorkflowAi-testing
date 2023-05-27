import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import translationEN from './Translation Files/TranslationEn.json';
import translationchi from './Translation Files/Translationchi.json';
import translationfr from './Translation Files/Transalationfr.json';
import translationgr from './Translation Files/Translationgr.json';
import translationsp from './Translation Files/Translationsp.json';

const resources = {
  en: {
    translation: translationEN,
  },
  chi: {
    translation: translationchi,
  },
  fr: {
    translation: translationfr,
  },
  gr: {
    translation: translationgr,
  },
  sp: {
    translation: translationsp,
  },
};

i18n
  .use(Backend)

  .use(LanguageDetector)

  .use(initReactI18next)

  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    lng: localStorage.getItem('i18nextLng') || 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
