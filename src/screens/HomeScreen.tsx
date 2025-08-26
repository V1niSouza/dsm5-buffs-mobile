// HomeScreen.tsx
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Animated, Text } from "react-native";
import Propriedades from "../components/Dropdown";
import AlertasPendentes from "../components/Lembretes";
import DashPropriedade from "../components/DashPropriedade";
import { colors } from "../styles/colors";
import BuffsLogo from '../../assets/images/logoBuffs.svg'; 

export const HomeScreen = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const header2Opacity = scrollY.interpolate({
    inputRange: [0, 50], // altura do scroll para desaparecer
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const header1TextOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View>
      <View style={styles.headerNotifications}>
        {/* Texto centralizado */}
        <Animated.View 
          style={[
            { opacity: header1TextOpacity,  alignItems: 'center'}
          ]}
        >
          <BuffsLogo width={80} height={80} />
        </Animated.View>
      </View>
      {/* Conteúdo rolável */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 25 }}
      >
        <Animated.View style={[styles.header2, { opacity: header2Opacity}]}>
          <BuffsLogo width={90} height={90} style={{ marginBottom: 10 }} />
        </Animated.View>
    <ScrollView 
      style={styles.container}
      scrollEnabled={!dropdownOpen} // trava o scroll quando dropdown está aberto
    >
      <Propriedades dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
      <DashPropriedade />
      <AlertasPendentes />
    </ScrollView>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
    headerNotifications: {
    height: 60,
    backgroundColor: colors.yellow.base,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingTop: 20,
  },
  header1Text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.brown.base,
  },
  header2: {
    height: 35,
    justifyContent: 'center',
    paddingLeft: 16,
    backgroundColor: colors.yellow.base,
  },
  header2Text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
