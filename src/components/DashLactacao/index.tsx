import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

interface DashLactationProps {
  totalArmazenado: number; // quantidade de leite total produzido
  vacasLactando: number;   // número de vacas em lactação
  dataAtualizacao: string; // data da última atualização
}

export default function DashLactation({
  totalArmazenado,
  vacasLactando,
  dataAtualizacao,
}: DashLactationProps) {
  return (
    <View style={styles.card}>
      {/* Título */}
      <Text style={styles.title}>Resumo da Produção de Leite</Text>

      {/* Linha principal */}
      <View style={styles.row}>
        {/* Total Produzido */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Total Produzido</Text>
          <Text style={styles.value}>{totalArmazenado} Litros</Text>
        </View>

        {/* Vacas em Lactação */}
        <View style={[styles.infoBox, styles.borderbox]}>
          <Text style={styles.label}>Vacas em Lactação</Text>
          <Text style={styles.value}>{vacasLactando} Vacas</Text>
        </View>
      </View>

      {/* Rodapé */}
      <Text style={styles.footerText}>
        Última Atualização: {dataAtualizacao}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white.base,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
  },
  borderbox: {
    borderLeftWidth: 2,
    borderColor: colors.gray.disabled,
    paddingLeft: 20,
  },
  label: {
    fontSize: 13,
    color: colors.gray.base,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.black.base,
  },
  footerText: {
    fontSize: 11,
    color: colors.gray.base,
    textAlign: "right",
  },
});
