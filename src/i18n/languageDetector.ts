import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import type { LanguageDetectorAsyncModule } from 'i18next';

export const STORAGE_KEY = '@app_language';

export type AppLanguage = 'pt-BR' | 'en';

const SUPPORTED: AppLanguage[] = ['pt-BR', 'en'];
const FALLBACK: AppLanguage = 'pt-BR';

/**
 * Detecta o idioma na seguinte ordem:
 * 1. Valor salvo em AsyncStorage (@app_language), se existir e for suportado.
 * 2. Locale do aparelho: se o primeiro locale começar com "en" -> "en".
 * 3. Fallback "pt-BR".
 */
export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async (): Promise<string> => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved as AppLanguage)) {
        return saved;
      }
    } catch {
      // ignora erro de leitura; cai na detecção por locale
    }

    const locales = RNLocalize.getLocales();
    const first = locales[0]?.languageCode?.toLowerCase();
    return first === 'en' ? 'en' : FALLBACK;
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // persistência best-effort
    }
  },
};
