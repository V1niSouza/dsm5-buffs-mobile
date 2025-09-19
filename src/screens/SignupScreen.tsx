import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { apiFetch } from '../lib/apiClient';

type SignupScreenProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

export const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      // Chamada para criar usuário
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: { email, password },
      });

      // Se der certo, vai para tela de Login
      navigation.replace('Login');

    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


      {error && <Text style={styles.error}>{error}</Text>}

      <Button title={loading ? 'Cadastrando...' : 'Cadastrar'} onPress={handleSignup} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 5 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  error: { color: 'red', marginBottom: 10 },
});
