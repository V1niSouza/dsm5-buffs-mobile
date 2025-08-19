import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

export default function DashPropriedade() {

  return (
    <View style={styles.container}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },

  title: { fontSize: 18, fontWeight: "bold" },

  date: { color: "#6B7280" },

  button: { backgroundColor: "#FACC15", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },

  buttonText: { fontWeight: "600" },

  listHeader: { flexDirection: "row", backgroundColor: "#F3F4F6", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, marginBottom: 8 },

  listHeaderText: { fontWeight: "600", color: "#4B5563" },

  itemContainer: { backgroundColor: "#fff", borderRadius: 24, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB", shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },

  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  itemTitle: { fontWeight: "bold" },

  itemHour: { color: "#6B7280", fontSize: 12 },

  qtdBox: { width: 40, height: 28, backgroundColor: "#FEF3C7", borderRadius: 6, justifyContent: "center", alignItems: "center" },
  qtdText: { fontWeight: "bold", color: "#B45309" },

  motivoText: { marginTop: 4, fontSize: 12, color: "#9CA3AF" },

  pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },

  pageButton: { backgroundColor: "#FACC15", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },

  pageButtonDisabled: { backgroundColor: "#E5E7EB" },

  pageButtonText: { fontWeight: "600" },

  pageInfo: { fontWeight: "600" },
});
