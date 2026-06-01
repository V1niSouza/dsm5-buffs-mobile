import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { useTranslation } from "react-i18next";
import User from "../../../assets/images/user.svg";
import { colors } from "../../styles/colors";
import Exit from "../../icons/exit";
import { useAuth } from "../../context/AuthContext";

const LANGUAGES = [
  { code: "pt-BR", label: "🇧🇷 Português" },
  { code: "en", label: "🇬🇧 English" },
] as const;

export const UserMenu = () => {
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation("auth");
  const { logout } = useAuth(); // 🔑 pegar a função de logout

  const handleLogout = () => {
    setVisible(false); // fechar o menu
    logout();          // chamar logout do contexto
  };

  const handleSelectLanguage = (code: string) => {
    i18n.changeLanguage(code); // persiste via languageDetector.cacheUserLanguage
    setVisible(false);
  };

  return (
    <>
      {/* Botão do usuário */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.button}>
        <User width={26} height={26} style={{ marginTop: 6 }} />
      </TouchableOpacity>

      {/* Menu suspenso */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.menu}>
            <Text style={styles.sectionLabel}>{t("userMenu.language")}</Text>
            {LANGUAGES.map((lng) => {
              const active = i18n.language === lng.code;
              return (
                <TouchableOpacity
                  key={lng.code}
                  style={styles.menuButton}
                  onPress={() => handleSelectLanguage(lng.code)}
                >
                  <Text style={[styles.langText, active && styles.langTextActive]}>
                    {lng.label}
                  </Text>
                  {active && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
              <Exit width={14} height={14} color={colors.status.error} />
              <Text style={styles.menuText}>{t("userMenu.signOut")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand.primary,
    borderRadius: 50,
    flexDirection: "row",
    position: "absolute",
    gap: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  menu: {
    marginTop: 50,
    marginRight: 20,
    backgroundColor: colors.bg.card,
    borderRadius: 8,
    padding: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.status.error,
    marginLeft: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.muted,
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
    textTransform: "uppercase",
  },
  langText: {
    fontSize: 15,
    color: colors.text.body,
  },
  langTextActive: {
    fontWeight: "700",
    color: colors.brand.primary,
  },
  check: {
    fontSize: 15,
    color: colors.brand.primary,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.muted,
    marginVertical: 6,
  },
});
