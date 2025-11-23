import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

export type CardLactacaoProps = {
  animal: any;
  onPress?: () => void;
};

export const CardLactacao: React.FC<CardLactacaoProps> = ({ animal, onPress }) => {
  const isLactando = animal.status === "Em Lactação";

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View
        style={[
          styles.statusBar,
          { backgroundColor: isLactando ? colors.green.active : colors.red.inactive },
        ]}
      />
      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.nome}>{animal.nome || "Sem nome"}</Text>
          <Text style={styles.brinco}>Brinco: Nº {animal.brinco}</Text>
        </View>
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Raça:</Text>
            <Text style={styles.chipValue}>{animal.raca || "—"}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Ciclo:</Text>
            <Text style={styles.chipValue}>{animal.ciclo ? `${animal.ciclo}º` : "—"}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Dias Lactação:</Text>
            <Text style={styles.chipValue}>{animal.diasEmLactacao ?? "—"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
    marginBottom: 10,
  },
  statusBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    paddingLeft: 10,
  },
  header: {
    marginBottom: 8,
  },
  nome: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  brinco: {
    fontSize: 13,
    color: "#6B7280",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    marginBottom: 6,
    gap: 5,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginRight: 4,
  },
  chipValue: {
    fontSize: 13,
    color: "#374151",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  footerHighlight: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.yellow.base,
  },
});
