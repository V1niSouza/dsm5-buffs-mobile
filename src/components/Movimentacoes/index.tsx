import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

export default function Movimentacoes() {

  const movimentacoes = [
    {
      id: 1,
      grupo: "Lote A",
      hora: "08:30",
      saida: "Piquete 1",
      chegada: "Piquete 3",
      qtd: 12,
      motivo: "Rotação de pastagem",
    },
    {
      id: 2,
      grupo: "Bezerras",
      hora: "14:15",
      saida: "Curral",
      chegada: "Piquete 2",
      qtd: 8,
    },
    {
      id: 3,
      grupo: "Bezerras",
      hora: "14:15",
      saida: "Curral",
      chegada: "Piquete 2",
      qtd: 8,
    },
    {
      id: 4,
      grupo: "Bezerras",
      hora: "14:15",
      saida: "Curral",
      chegada: "Piquete 2",
      qtd: 8,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Movimentações Diárias</Text>
          <Text style={styles.motivoText}>Motivo: Rotação diária de Pastagem</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver Mais</Text>
        </TouchableOpacity>
      </View>

      {/* Header da lista */}
      <View style={styles.listHeader}>
        <Text style={[styles.listHeaderText, { flex: 1 }]}>Grupo</Text>
        <Text style={[styles.listHeaderText, { flex: 1, textAlign: "center" }]}>Lote Saída</Text>
        <Text style={[styles.listHeaderText, { flex: 1, textAlign: "center" }]}>Lote Chegada</Text>
        <Text style={[styles.listHeaderText, { width: 40, textAlign: "center" }]}>Qtd</Text>
      </View>

      {/* Lista */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {movimentacoes.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            {/* Linha principal */}
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.grupo}</Text>
              </View>
              <Text style={{ flex: 1, textAlign: "center" }}>{item.saida}</Text>
              <Text style={{ flex: 1, textAlign: "center" }}>{item.chegada}</Text>
              <View style={styles.qtdBox}>
                <Text style={styles.qtdText}>{item.qtd}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    color: "#6B7280", // cinza
  },
  button: {
    backgroundColor: "#FACC15", // amarelo
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonText: {
    fontWeight: "600",
  },
  listHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6", // cinza claro
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  listHeaderText: {
    fontWeight: "600",
    color: "#4B5563", // cinza escuro
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB", // cinza claro
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontWeight: "bold",
  },
  itemHour: {
    color: "#6B7280",
    fontSize: 12,
  },
  qtdBox: {
    width: 40,
    height: 28,
    backgroundColor: "#FEF3C7", // amarelo claro
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  qtdText: {
    fontWeight: "bold",
    color: "#B45309", // amarelo escuro
  },
  motivoText: {
    marginTop: 4,
    fontSize: 12,
    color: "#9CA3AF",
  },
});
