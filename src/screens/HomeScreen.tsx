import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import Propriedades from "../components/Dropdown";
import AlertasPendentes from "../components/Lembretes";
import DashPropriedade from "../components/DashPropriedade";
import { colors } from "../styles/colors";
import BuffsLogo from '../../assets/images/logoBuffs.svg'; 
import User from '../../assets/images/user.svg';
import { MainLayout } from "../layouts/MainLayout";
import { UserMenu } from "../components/UserMenu";

export const HomeScreen = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          {/* Texto centralizado */}
          <View style={{alignItems: 'center'}}>
            <BuffsLogo width={90} height={90} />
          </View>
          <View style={styles.headerButtons}>
            <UserMenu />
          </View>
      </View>
      <MainLayout>
        <ScrollView 
          scrollEnabled={!dropdownOpen} // trava o scroll quando dropdown está aberto
          >
          <Propriedades dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
          <DashPropriedade />
          <AlertasPendentes />
        </ScrollView>
      </MainLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222'
  },
  header: {
    height: 80,
    backgroundColor: colors.yellow.base,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingTop: 20,
    borderColor: colors.yellow.dark
  },
  headerButtons: {
    marginTop: 30,
    flexDirection: "row",
    position: "absolute",
    right: 20, // fixa os botões à direita
    gap: 20, // espaço entre eles
  },
  button: {
    backgroundColor: colors.yellow.dark,
    borderRadius: 50,
  },
});
