import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languageDetector } from './languageDetector';

import ptCommon from './locales/pt-BR/common.json';
import ptAuth from './locales/pt-BR/auth.json';
import ptHome from './locales/pt-BR/home.json';
import ptRebanho from './locales/pt-BR/rebanho.json';
import ptNav from './locales/pt-BR/nav.json';
import ptLactacao from './locales/pt-BR/lactacao.json';
import ptReproducao from './locales/pt-BR/reproducao.json';
import ptPiquetes from './locales/pt-BR/piquetes.json';
import ptSanitario from './locales/pt-BR/sanitario.json';
import ptZootecnico from './locales/pt-BR/zootecnico.json';
import ptAnimalDetail from './locales/pt-BR/animalDetail.json';
import ptNfc from './locales/pt-BR/nfc.json';
import ptAlertas from './locales/pt-BR/alertas.json';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enHome from './locales/en/home.json';
import enRebanho from './locales/en/rebanho.json';
import enNav from './locales/en/nav.json';
import enLactacao from './locales/en/lactacao.json';
import enReproducao from './locales/en/reproducao.json';
import enPiquetes from './locales/en/piquetes.json';
import enSanitario from './locales/en/sanitario.json';
import enZootecnico from './locales/en/zootecnico.json';
import enAnimalDetail from './locales/en/animalDetail.json';
import enNfc from './locales/en/nfc.json';
import enAlertas from './locales/en/alertas.json';

export const defaultNS = 'common';

export const resources = {
  'pt-BR': {
    common: ptCommon,
    auth: ptAuth,
    home: ptHome,
    rebanho: ptRebanho,
    nav: ptNav,
    lactacao: ptLactacao,
    reproducao: ptReproducao,
    piquetes: ptPiquetes,
    sanitario: ptSanitario,
    zootecnico: ptZootecnico,
    animalDetail: ptAnimalDetail,
    nfc: ptNfc,
    alertas: ptAlertas,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    home: enHome,
    rebanho: enRebanho,
    nav: enNav,
    lactacao: enLactacao,
    reproducao: enReproducao,
    piquetes: enPiquetes,
    sanitario: enSanitario,
    zootecnico: enZootecnico,
    animalDetail: enAnimalDetail,
    nfc: enNfc,
    alertas: enAlertas,
  },
} as const;

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    ns: ['common', 'auth', 'home', 'rebanho', 'nav', 'lactacao', 'reproducao', 'piquetes', 'sanitario', 'zootecnico', 'animalDetail', 'nfc', 'alertas'],
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
