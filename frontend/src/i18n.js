import i18n from "i18next";
import { useEffect } from "react";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "./TranslationEn.json";
import translationchi from "./Translationchi.json";
import translationfr from "./Transalationfr.json";





const resources = {
	en: {
	  translation: translationEN
	},
	chi: {
	  translation: translationchi
	},
	fr: {
		translation: translationfr
	  }
  };

  i18n
  .use(Backend)

  .use(LanguageDetector)

  .use(initReactI18next)

  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    lng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
	  
    }
  });

export default i18n;
