import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "../Button";
import { colors } from "../../styles/colors";

interface PropriedadesProps {
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}

export default function Propriedades({ dropdownOpen, setDropdownOpen }: PropriedadesProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: "Opção 1", value: "opcao1" },
    { label: "Opção 2", value: "opcao2" },
  ]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Propriedades</Text>
      </View>

      {/* DropDown */}
      <View style={styles.dropdownWrapper}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={(o) => {
            setOpen(o);
            setDropdownOpen(typeof o === 'boolean' ? o : false); // avisa o pai
          }}
          setValue={setValue}
          setItems={setItems}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropDownContainer}

        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, 
    backgroundColor: "#fff",
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.gray.disabled,
      shadowColor: colors.black.base,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2, },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "bold" },
  dropdownWrapper: { zIndex: 1000 },
  dropdownContainer: { height: 50 },
  dropdown: { backgroundColor: "#fff", borderRadius: 12, borderColor: "#ccc" },
  dropDownContainer: { backgroundColor: "#fff", borderRadius: 12, borderColor: "#ccc" },
});
