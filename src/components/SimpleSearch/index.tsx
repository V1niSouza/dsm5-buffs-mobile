import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../styles/colors";
import TextTitle from "../TextTitle";
import SearchIcon from "../../icons/search";
import { Animal } from "../TableRebanho";

interface SearchOnlyProps {
  animais: Animal[],
  onFiltered: (animaisFiltrados: Animal[]) => void,
}

export default function SimpleSearch({ animais, onFiltered }: SearchOnlyProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filtered = animais.filter(a => a.brinco.includes(search));
    onFiltered(filtered);
  }, [search, animais]);

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
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => console.log("Pesquisar", search)}
        >
          <SearchIcon fill={colors.black.base} size={18}/>
        </TouchableOpacity>
      </View>
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
});
