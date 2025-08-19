// HomeScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Propriedades from "../components/Dropdown";
import AlertasPendentes from "../components/Lembretes";
import Movimentacoes from "../components/Movimentacoes";

export const HomeScreen = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const components = [
    { key: "propriedades" },
    { key: "alertas" },
    { key: "movimentacoes" },
    { key: "parametros"},
  ];

  const renderItem = ({ item }: { item: { key: string } }) => {
    switch (item.key) {
      case "propriedades":
        return <Propriedades dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />;
      case "alertas":
        return <AlertasPendentes />;
      case "movimentacoes":
        return <Movimentacoes />;
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={components}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.container}
      scrollEnabled={!dropdownOpen} // controla o scroll quando o dropdown está aberto
    />
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", padding: 16 },
});
