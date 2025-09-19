import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "../Button";
import { colors } from "../../styles/colors";
import TextTitle from "../TextTitle";

interface PropriedadesProps {
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  prop?: any[];
}

export default function Propriedades({ dropdownOpen, setDropdownOpen, prop }: PropriedadesProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (prop && prop.length > 0) {
      console.log("Propriedades recebidas:", prop);
      const mapped = prop.map((p: any) => ({
        label: p.nome, 
        value: p.id_propriedade     
      }));
      setItems(mapped);
      setValue(mapped[0].value);
    }
  }, [prop]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TextTitle>Propriedades</TextTitle>
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
          placeholder="Selecione uma propriedade"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropDownContainer}
          listMode="SCROLLVIEW"
        />
      </View>
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
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowRadius: 4,
    elevation: 2, 
    zIndex: 1000
  },

  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 16 
  },

  title: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  dropdownWrapper: {
    zIndex: 1000, // iOS
    elevation: 1000, // Android
  },

  dropdownContainer: { 
    height: 50,
  },

  dropdown: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    borderColor: "#ccc" 
  },

  dropDownContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ccc",
    zIndex: 1000, // iOS
    elevation: 1000, // Android
  },
});
