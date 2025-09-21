import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Text } from "react-native";
import { colors } from "../../styles/colors";
import TextTitle from "../TextTitle";
import SearchIcon from "../../icons/search";
import { Animal } from "../TableRebanho";

interface SearchBarProps {
  animais: Animal[],
  onFiltered: (animaisFiltrados: Animal[]) => void,
}


const filterOptions = [
  "Ativo",
  "Inativo",
  "Macho",
  "Femêa",
  "Categoria PO",
  "Categoria PA",
  "Categoria PC",
  "Categoria CCG",
];


export default function SearchBar({ animais, onFiltered }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  useEffect(() => {
  const filtered = animais
    .filter(a => a.brinco.includes(search))
    .filter(a => {
      if (!activeFilters.length) return true;
      return (
        activeFilters.includes(
          typeof a.status === "boolean"
            ? a.status
              ? "Ativo"
              : "Inativo"
            : String(a.status)
        ) ||
        activeFilters.includes(
          typeof a.sexo === "boolean"
            ? a.sexo
              ? "Macho"
              : "Femêa"
            : String(a.sexo)
        ) ||
        activeFilters.includes(a.categoria ?? "")
      );
    });

  onFiltered(filtered);
  }, [search, activeFilters, animais]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TextTitle>Buscar animal por Brinco:</TextTitle>
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
           <SearchIcon fill={colors.black.base} size={18}/>
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
    paddingBottom:16, 
 
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
    overflow: "hidden",
  },

  input: {
    flex: 0.9,
    fontSize: 16,
    color: colors.gray.base,
  },

  iconWrapper: {
    width: '10%',
    height: '100%',
    alignItems:'center',
    justifyContent:'center',
    marginLeft: 'auto',
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
