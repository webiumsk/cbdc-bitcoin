import { createI18n } from "vue-i18n";
import sk from "./locales/sk.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import de from "./locales/de.json";

const i18n = createI18n({
  legacy: false,
  locale: "sk",
  fallbackLocale: "sk",
  messages: {
    sk,
    en,
    es,
    de,
  },
});

export default i18n;
