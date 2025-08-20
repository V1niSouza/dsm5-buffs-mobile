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

// Icons SVG
import BuffsLogo from './assets/images/logoBuffs.svg'; 
import Bufalo from './src/icons/bufalo';
import Home from './src/icons/home';
import Lactation from './src/icons/lactation';

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
          color: colors.brown.base,
        },
        headerTitleAlign: "left",

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
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Home 
              width={focused ? 30 : 20}         // maior quando ativo
              height={focused ? 30 : 20}        // maior quando ativo
              stroke={focused ? colors.yellow.dark : 'gray'} // muda cor
            />
          ),
          headerTitle: () => <BuffsLogo width={80} height={80} />,
        }}
      />
      <Tab.Screen 
        name="Rebanho" 
        component={RebanhoScreen} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Bufalo 
              width={focused ? 35 : 25}         // maior quando ativo
              height={focused ? 35 : 25}        // maior quando ativo
              fill={focused ? colors.yellow.dark : 'gray'} // muda cor
            />
          )
        }}/>
      <Tab.Screen
        name="Lactação"
        component={LactacaoScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Lactation 
              width={focused ? 35 : 25}         // maior quando ativo
              height={focused ? 35 : 25}        // maior quando ativo
              fill={focused ? colors.yellow.dark : 'gray'} // muda cor
            />
          )
        }} />
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
