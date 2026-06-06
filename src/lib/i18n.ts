import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../locales/en.json';
import amTranslation from '../locales/am.json';
import omTranslation from '../locales/om.json';
import tiTranslation from '../locales/ti.json';

const resources = {
  en: { translation: enTranslation },
  am: { translation: amTranslation },
  om: { translation: omTranslation },
  ti: { translation: tiTranslation }
};

// Initialize i18next
// Use localStorage to get initial language if available, fallback to 'en'
let initialLng = 'en';
if (typeof window !== 'undefined') {
  const storedLng = localStorage.getItem('gursha_lang');
  if (storedLng && ['en', 'am', 'om', 'ti'].includes(storedLng)) {
    initialLng = storedLng;
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
