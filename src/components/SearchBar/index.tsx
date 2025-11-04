import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors } from "../../styles/colors";
import YellowButton from "../Button";

export default function FiltroRebanho() {
  const categorias = ["Sexo", "Raça", "Maturidade", "Status"];
  const opcoesPorCategoria: Record<string, string[]> = {
    Sexo: ["Macho", "Fêmea"],
    Raça: ["Murrah", "Jafarabadi", "Mediterrâneo"],
    Maturidade: ["Bezerro", "Novilha", "Vaca", "Touro"],
    Status: ["Ativo", "Inativo"],
  };

  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const limparFiltros = () => {
    setSearch("");
    setCategoriaAtiva(null);
    setOpcaoSelecionada(null);
  };

  const aplicarFiltro = () => {
    // Aqui futuramente você chama sua rota API
    console.log({
      brinco: search,
      categoria: categoriaAtiva,
      opcao: opcaoSelecionada,
    });
  };

  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.header}>
        <Text style={styles.title}>Filtrar Rebanho</Text>
        <YellowButton title="Limpar" onPress={limparFiltros}/>
      </View>

      {/* Categorias */}
      <Text style={styles.subtitle}>CATEGORIA DO FILTRO</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollChips}
      >
        {categorias.map((cat) => {
          const ativo = cat === categoriaAtiva;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, ativo && styles.chipAtivo]}
              onPress={() =>
                setCategoriaAtiva(categoriaAtiva === cat ? null : cat)
              }
            >
              <Text style={[styles.chipText, ativo && styles.chipTextAtivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Mostrar o restante só se alguma categoria estiver ativa */}
      {categoriaAtiva && (
        <>
          {/* Campo de busca por Brinco */}
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Buscar por brinco..."
              placeholderTextColor={colors.gray.base}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Opções dinâmicas */}
          <Text style={styles.subtitle}>
            OPÇÕES DE {categoriaAtiva.toUpperCase()}
          </Text>
          <View style={styles.optionsContainer}>
            {opcoesPorCategoria[categoriaAtiva].map((opcao) => {
              const selecionada = opcao === opcaoSelecionada;
              return (
                <TouchableOpacity
                  key={opcao}
                  style={[
                    styles.optionButton,
                    selecionada && styles.optionButtonActive,
                  ]}
                  onPress={() =>
                    setOpcaoSelecionada(
                      selecionada ? null : opcao
                    )
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      selecionada && styles.optionTextActive,
                    ]}
                  >
                    {opcao}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Rodapé */}
          <YellowButton title="Aplicar Filtro" onPress={aplicarFiltro} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white.base,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black.base,
  },
  clearText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.yellow.dark,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray.base,
    fontWeight: "600",
    marginBottom: 8,
  },
  scrollChips: {
    flexGrow: 0,
    marginBottom: 16,
  },
  chip: {
    width: 120,
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 2,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginRight: 8,
  },
  chipAtivo: {
    backgroundColor: colors.yellow.base,
  },
  chipText: {
    color: colors.black.base,
    fontWeight: "500",
    fontSize: 16,
  },
  chipTextAtivo: {
    color: colors.brown.base,
    fontWeight: "700",
  },
  searchWrapper: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
  },
  input: {
    fontSize: 16,
    color: colors.gray.base,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    flexGrow: 1,
    alignItems: "center",
    minWidth: "45%",
  },
  optionButtonActive: {
    backgroundColor: colors.yellow.base,
  },
  optionText: {
    color: colors.black.base,
    fontWeight: "500",
  },
  optionTextActive: {
    color: colors.brown.base,
    fontWeight: "700",
  },
  footerButton: {
    backgroundColor: colors.yellow.base,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.black.base,
  },
});
