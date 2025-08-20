// HomeScreen.tsx
import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Propriedades from "../components/Dropdown";
import AlertasPendentes from "../components/Lembretes";
import DashPropriedade from "../components/DashPropriedade";

export const HomeScreen = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ScrollView 
      style={styles.container}
      scrollEnabled={!dropdownOpen} // trava o scroll quando dropdown está aberto
    >
      <Propriedades dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
      <DashPropriedade />
      <AlertasPendentes />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
});
