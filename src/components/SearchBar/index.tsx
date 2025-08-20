import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Text } from "react-native";
import { colors } from "../../styles/colors";
import TextTitle from "../TextTitle";
import Bufalo from '../../icons/bufalo';

const filterOptions = [
  "Ativo",
  "Inativo",
  "Categoria POO",
  "Categoria PA",
  "Categoria DSM",
];

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TextTitle>Local Bufalo por Brinco:</TextTitle>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.gray.base}
        />
        <TouchableOpacity style={styles.iconWrapper} onPress={() => console.log("Pesquisar", search)}>
           <Bufalo fill={colors.yellow.dark} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Filtrar Por:</Text>
      {/* Carrossel de filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {filterOptions.map((filter) => {
          const isActive = activeFilters.includes(filter);
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, isActive && styles.filterButtonActive]}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    shadowColor: colors.black.base,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2, 
  },

  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 16 
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray.disabled,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: colors.gray.base,
  },

  iconWrapper: {
    marginLeft: 8,
  },

  filterScroll: {
    flexDirection: "row",
  },

  filterButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  filterButtonActive: {
    backgroundColor: colors.yellow.base,
    borderColor: colors.yellow.dark,
  },

  filterText: {
    color: "#333",
    fontSize: 14,
  },

  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
    subtitle: { 
    fontSize: 14, 
    color: colors.gray.base 
  },
});
