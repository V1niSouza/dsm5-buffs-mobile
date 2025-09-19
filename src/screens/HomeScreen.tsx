import React, { useState, useEffect} from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import Propriedades from "../components/Dropdown";
import AlertasPendentes from "../components/Lembretes";
import DashPropriedade from "../components/DashPropriedade";
import { colors } from "../styles/colors";
import BuffsLogo from '../../assets/images/logoBuffs.svg'; 
import { MainLayout } from "../layouts/MainLayout";
import { UserMenu } from "../components/UserMenu";

import bufaloService from "../services/bufaloService";
import propriedadeService from "../services/propriedadeService";

export const HomeScreen = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countsSex, setCountsSex] = useState({ machos: 0, femeas: 0 });
  const [countsMat, setCountsMat] = useState({ bezerros: 0, novilhas: 0, vacas: 0, touros: 0 });
  const [count, setCount] = useState({ bufalosAtivos: 0 });
  const [propriedades, setPropriedades] = useState<any[]>([]); 

  const [refreshing, setRefreshing] = useState(false);

  const fetchBufalos = async () => {
    try {
      const { raw, countsSex, countsMat, count } = await bufaloService.getBufalos();
      setCountsSex(countsSex);
      setCountsMat(countsMat);
      setCount(count);
    } catch (err) {
      console.error("Erro ao buscar búfalos:", err);
    }
  };

  const fetchPropriedades = async () => {
    try {
      const { propriedades } = await propriedadeService.getPropriedades();
      setPropriedades(propriedades);
    } catch (err) {
      console.error("Erro ao buscar propriedades:", err);
    }
  };

  useEffect(() => {
    fetchBufalos();
  //  fetchPropriedades();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchBufalos(),
      fetchPropriedades()
    ]);
    setRefreshing(false);
  };

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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          >
          <Propriedades dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} prop={propriedades}/>
          <DashPropriedade
            total={count.bufalosAtivos}
            machos={countsSex.machos}
            femeas={countsSex.femeas}
            bezerros={countsMat.bezerros}
            novilhas={countsMat.novilhas}
            vacas={countsMat.vacas}
            touros={countsMat.touros}
           />
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
