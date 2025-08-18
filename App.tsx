// App.tsx
import React from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Layout
import { MainLayout } from './src/layouts/MainLayout';

// Telas TabBar
import { HomeScreen } from './src/screens/HomeScreen';
import { RebanhoScreen } from './src/screens/RebanhoScreen';
import { LactacaoScreen } from './src/screens/LactacaoScreen';
import { ReproducaoScreen } from './src/screens/ReproducaoScreen';
import { PiquetesScreen } from './src/screens/PiquetesScreen';
import { colors } from './src/styles/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// TabBar principal
function MainTab() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
                // --- CABEÇALHO (HEADER) ---
        headerStyle: {
          height: Platform.OS === "ios" ? 90 : 80,
          backgroundColor: colors.yellow.base,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: "bold",
          color: colors.black.base,
        },
        headerTitleAlign: "center",

        // --- BARRA DE ABAS (TAB BAR) ---
        tabBarStyle: {
          height: Platform.OS === "ios" ? 85 : 85,
          paddingBottom: Platform.OS === "ios" ? 10 : 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === "ios" ?  2 : 0,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },

        // --- CORES ATIVAS / INATIVAS ---
        tabBarActiveTintColor: colors.yellow.dark,
        tabBarInactiveTintColor: "gray",

      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rebanho" component={RebanhoScreen} />
      <Tab.Screen name="Lactação" component={LactacaoScreen} />
      <Tab.Screen name="Reprodução" component={ReproducaoScreen} />
      <Tab.Screen name="Piquetes" component={PiquetesScreen} />
    </Tab.Navigator>
  );
}

// Stack geral
function AppContent() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTab" component={MainTab} />
    </Stack.Navigator>
  );
}
export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
