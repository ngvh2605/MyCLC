import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./languages/en/translation.json";
import translationVI from "./languages/vi/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("i18nLanguage") || "vi",
});

export default i18next;
