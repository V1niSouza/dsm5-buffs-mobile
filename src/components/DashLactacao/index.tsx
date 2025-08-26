import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import TextTitle from "../TextTitle";

export default function DashLactation() {
  // Valores de exemplo — depois você pode puxar da API ou state
  const total = "20/04/2005";
  const femeas = 149;
  const machos = 98;
  const bezerros = 43;
  const novilhas = 80;
  const vacas = 124;
  const touros = 24;

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TextTitle>Resumo da Produção de Leite</TextTitle>
        <Text style={styles.subtitle}>Data de atualização: {total}</Text>
      </View>

      {/* Primeira linha */}
      <View style={styles.row}>
        <View style={[styles.item, {borderBottomWidth: 0.2}]}>
          <Text style={styles.value}>{machos} L</Text>
          <Text style={styles.label}>Total Armazenado</Text>
        </View>
        <View style={[styles.item, {borderBottomWidth: 0.2}]}>
          <Text style={styles.value}>{femeas}</Text>
          <Text style={styles.label}>Vacas em Lactação</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white.base,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    shadowColor: colors.black.base,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1, // deixa abaixo do dropdown
    zIndex: 1,    // iOS
  },
  header: {
    marginBottom: 16,
  },
  subtitle: { 
    fontSize: 14, 
    color: colors.gray.base 
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 16,
  },
  item: { 
    alignItems: "center", 
    flex: 1,
    borderRightWidth: 0.2,
    borderLeftWidth: 0.2,
    borderColor: colors.gray.disabled,
  },
  value: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 4 
  },
  label: { 
    fontSize: 12, 
    color: colors.gray.base 
  },
});
