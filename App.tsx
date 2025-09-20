import { AuthProvider, useAuth } from './src/context/AuthContext'

// App.tsx
import React, { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Layout
import { MainLayout } from './src/layouts/MainLayout';
import { colors } from './src/styles/colors';

// Telas TabBar
import { HomeScreen } from './src/screens/HomeScreen';
import { RebanhoScreen } from './src/screens/RebanhoScreen';
import { LactacaoScreen } from './src/screens/LactacaoScreen';
import { ReproducaoScreen } from './src/screens/ReproducaoScreen';
import { PiquetesScreen } from './src/screens/PiquetesScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { PropriedadeProvider } from './src/context/PropriedadeContext';

// Icons SVG
import BuffsLogo from './assets/images/logoBuffs.svg'; 
import Bufalo from './src/icons/bufalo';
import Home from './src/icons/home';
import Lactation from './src/icons/lactation';
import GlobeIcon from './src/icons/sex';
import Fance from './src/icons/fance';


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTab: undefined;
  CompleteProfile: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();


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
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Lactation 
              width={focused ? 35 : 25}         // maior quando ativo
              height={focused ? 35 : 25}        // maior quando ativo
              fill={focused ? colors.yellow.dark : 'gray'} // muda cor
            />
          )
        }} />
      <Tab.Screen 
        name="Reprodução" 
        component={ReproducaoScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <GlobeIcon
              size={focused ? 25 : 22}         // maior quando ativo
              fill={focused ? colors.yellow.dark : 'gray'} // muda cor
            />
          )
        }}/>
      <Tab.Screen 
        name="Piquetes" 
        component={PiquetesScreen}         
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Fance
              size={focused ? 25 : 22}         // maior quando ativo
              fill={focused ? colors.yellow.dark : 'gray'} // muda cor
            />
          )
        }}/>
    </Tab.Navigator>
  );
}

// App.tsx (parte relevante)
function AppContent() {
  const { userToken, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userToken ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <Stack.Screen name="MainTab" component={MainTab} />
      )}
    </Stack.Navigator>
  );
}


export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AuthProvider>
            <PropriedadeProvider>
              <NavigationContainer>
                <AppContent />
              </NavigationContainer>
            </PropriedadeProvider>
          </AuthProvider>
    </SafeAreaProvider>
  );
}
