import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

export type CardReproducaoProps = {
  reproducao: any;
  onPress?: () => void;
};

type StatusType = "Em andamento" | "Confirmada" | "Falha";

export const CardReproducao: React.FC<CardReproducaoProps> = ({ reproducao, onPress }) => {
  // Determina o status válido
  const status: StatusType =
    reproducao.status === "Confirmada"
      ? "Confirmada"
      : reproducao.status === "Falha"
      ? "Falha"
      : "Em andamento";

  // Cores do chip
  const statusColors: Record<StatusType, { bg: string; text: string }> = {
    "Em andamento": { bg: "#FEF3C7", text: "#92400E" },
    Confirmada: { bg: "#D1FAE5", text: "#065F46" },
    Falha: { bg: "#FEE2E2", text: "#991B1B" },
  };

  const color = statusColors[status];

  // Cor da barra lateral
  const barColors: Record<StatusType, string> = {
    "Em andamento": "#FBBF24",
    Confirmada: "#10B981",
    Falha: "#EF4444",
  };

  
  // Material genético resumido
    const materialGenetico =
    reproducao.id_semen || reproducao.id_ovulo
        ? `${(reproducao.id_semen || reproducao.id_ovulo).slice(0, 5)} ${
            reproducao.id_semen 
        }`
        : null;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={[styles.statusBar, { backgroundColor: barColors[status] }]} />
      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.nome}>
            Búfala: <Text style={styles.highlight}>{reproducao.brincoBufala}</Text>
            {reproducao.brincoTouro && (
              <> | Búfalo: <Text style={styles.highlight}>{reproducao.brincoTouro}</Text></>
            )}
            {materialGenetico && <> / {materialGenetico}</>}
          </Text>
        </View>

        {/* Detalhes */}
        <View style={styles.details}>
          <Text style={styles.detailItem}>
            Data Cruzamento:{" "}
            <Text style={styles.detailValue}>{reproducao.dataCruzamento || "-"}</Text>
          </Text>
          <Text style={styles.detailItem}>
            Tipo de Reprodução:{" "}
            <Text style={styles.detailValue}>{reproducao.tipo_inseminacao}</Text>
          </Text>
        <Text style={styles.detailItem}>
        Concluída:{" "}
        <Text style={styles.detailValue}>
            {reproducao.concluida
            ? reproducao.tipo_parto
                ? `Sim, parto: ${reproducao.tipo_parto.toLowerCase()}`
                : "Sim"
            : "Não"}
        </Text>
        </Text>

        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black.base,
    flexShrink: 1,
  },
  highlight: {
    color: colors.black.base,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  details: {
    marginTop: 4,
  },
  detailItem: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  detailValue: {
    fontWeight: "600",
    color: "#1A1A1A",
  },
});
