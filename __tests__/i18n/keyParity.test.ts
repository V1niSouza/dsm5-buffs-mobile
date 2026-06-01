import ptCommon from "../../src/i18n/locales/pt-BR/common.json";
import ptAuth from "../../src/i18n/locales/pt-BR/auth.json";
import enCommon from "../../src/i18n/locales/en/common.json";
import enAuth from "../../src/i18n/locales/en/auth.json";

/** Achata um objeto aninhado em chaves "a.b.c". */
function flatten(obj: Record<string, any>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === "object"
      ? flatten(value, path)
      : [path];
  });
}

const namespaces = {
  common: { "pt-BR": ptCommon, en: enCommon },
  auth: { "pt-BR": ptAuth, en: enAuth },
};

describe("i18n key parity (pt-BR <-> en)", () => {
  for (const [ns, locales] of Object.entries(namespaces)) {
    const ptKeys = flatten(locales["pt-BR"]).sort();
    const enKeys = flatten(locales.en).sort();

    it(`namespace "${ns}" has the same keys in both languages`, () => {
      const missingInEn = ptKeys.filter((k) => !enKeys.includes(k));
      const missingInPt = enKeys.filter((k) => !ptKeys.includes(k));

      expect(missingInEn).toEqual([]);
      expect(missingInPt).toEqual([]);
    });
  }
});
