import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import TextTitle from "../TextTitle";

interface DashLactationProps {
  totalArmazenado: number;      // quantidade de leite no estoque
  vacasLactando: number;        // total de vacas em lactação
  dataAtualizacao: string;      // data do último registro
}


export default function DashLactation({
  totalArmazenado,
  vacasLactando,
  dataAtualizacao,
}: DashLactationProps) {

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TextTitle>Resumo da Produção de Leite</TextTitle>
        <Text style={styles.subtitle}>Data de atualização: {dataAtualizacao}</Text>
      </View>

      {/* Primeira linha */}
      <View style={styles.row}>
        <View style={[styles.item, {borderBottomWidth: 0.2}]}>
          <Text style={styles.value}>{totalArmazenado} L</Text>
          <Text style={styles.label}>Total Armazenado</Text>
        </View>
        <View style={[styles.item, {borderBottomWidth: 0.2}]}>
          <Text style={styles.value}>{vacasLactando}</Text>
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
