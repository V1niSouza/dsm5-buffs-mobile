import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { RootStackParamList } from '../../App'; 
import { colors } from '../styles/colors';
import { getFriendlyErrorMessage } from '../utils/errorHandler';

// Icons SVG
import BuffsLogo from '../../assets/images/logoBuffs.svg'; 
import YellowButton from '../components/Button';

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha e-mail e senha.');
      return; 
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log(error);
      if (error) {
        setError(getFriendlyErrorMessage(error));
      } else if (data?.user) {
        console.log('Usuário logado:', data.user);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <View style={{alignItems: 'center', marginTop: 150}}>
          <BuffsLogo width={200} height={200}/>
        </View>
        <View>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <YellowButton title="Entrar" onPress={handleLogin}   loading={loading}/>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 5 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  error: { 
    color: 'red', 
    marginBottom: 10 
  },
  signupLink: { 
    color: colors.black.base, 
    marginTop: 10, 
    textAlign: 'center', 
    fontSize: 12 
  },
});

