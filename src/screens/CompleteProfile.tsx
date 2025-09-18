import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import { supabase } from "../lib/supabase";

export const CompleteProfileScreen = () => {
  const { user, profile, needsProfile, setAuth, setNeedsProfile } = useAuth();
  const [formData, setFormData] = useState({
    nome: profile?.nome || "",
    telefone: profile?.telefone || "",
    cargo: profile?.cargo || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const handleSubmit = async () => {
    if (!formData.nome || !formData.telefone || !formData.cargo) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      // Obter token via Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        setLoading(false);
        return;
      }

      // Criar perfil na API
      const result = await userService.createProfile(token, formData);
      if (result.success) {
        Alert.alert("Sucesso", "Perfil criado com sucesso!");
        if (setNeedsProfile) {
          setNeedsProfile(false);
        }
        // Atualize o profile e needsProfile localmente
        // Como não há setters no context, você pode atualizar localmente ou adicionar setters ao context
      } else {
        Alert.alert("Erro", result.error || "Falha ao criar perfil.");
      }
    } catch (err) {
      Alert.alert("Erro", "Erro inesperado ao criar perfil.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete seu Perfil</Text>
      <Text style={styles.subtitle}>Olá {user?.email}, precisamos de algumas informações adicionais.</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={formData.nome}
        onChangeText={(text) => handleChange("nome", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        keyboardType="phone-pad"
        value={formData.telefone}
        onChangeText={(text) => handleChange("telefone", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo/Função"
        value={formData.cargo}
        onChangeText={(text) => handleChange("cargo", text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" />
      ) : (
        <Button title="Completar Perfil" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#FFF8DC" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20, color: "#555" },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, backgroundColor: "#fff" },
});
