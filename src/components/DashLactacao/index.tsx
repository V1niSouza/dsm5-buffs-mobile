import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useTranslation } from "react-i18next";

import { colors } from "../../styles/colors";

import TextTitle from "../TextTitle";

interface DashLactationProps {
  totalArmazenado: number;
  vacasLactando: number;
  dataAtualizacao: string;
}

export default function DashLactation({
  totalArmazenado,
  vacasLactando,
  dataAtualizacao,
}: DashLactationProps) {
  const { t } = useTranslation("lactacao");
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <TextTitle>
            {t("dash.title")}
          </TextTitle>

          <Text style={styles.subtitle}>
            {t("dash.subtitle")}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            {t("dash.totalProduced")}
          </Text>

          <Text style={styles.statValue}>
            {totalArmazenado}
            <Text style={styles.unit}>
              {" "}L
            </Text>
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            {t("dash.lactatingCows")}
          </Text>

          <Text style={styles.statValue}>
            {vacasLactando}
          </Text>

          <Text style={styles.helperText}>
            {t("dash.inProduction")}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t("dash.updatedAt", { date: dataAtualizacao })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: colors.bg.card,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: colors.black,
    shadowOpacity: 0.03,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    elevation: 1,
  },

  header: {
    marginBottom: 8,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: colors.bg.section,
    paddingHorizontal: 6,
  },

  statCard: {
    flex: 1,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
    justifyContent: "center",
  },

  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border.default,
  },

  subtitle: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 1,
    lineHeight: 14,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.muted,
    marginBottom: 1,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text.accent,
    lineHeight: 24,
  },

  unit: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.secondary,
  },

  helperText: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: -1,
  },

  footer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },

  footerText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.text.muted,
    textAlign: "center",
  },
});