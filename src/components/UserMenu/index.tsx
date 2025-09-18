import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal, Alert } from "react-native";
import User from "../../../assets/images/user.svg";
import { supabase } from "../../lib/supabase";
import { colors } from "../../styles/colors";

import Exit from "../../icons/exit";

export const UserMenu = () => {
  const [visible, setVisible] = useState(false);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    setAuth(null)
    if (error) {
        Alert.alert('Error', 'Erro ao sair da conta, tente mais tarde.')
        setVisible(false);
        return;
    }
    setVisible(false);   
  }

  return (
    <>
      {/* Botão do usuário */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.button}>
        <User width={20} height={20} style={{ margin: 6 }} />
      </TouchableOpacity>

      {/* Menu suspenso */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
          
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={handleSignOut} style={styles.menuButton}>
              <Exit width={14} height={14} color={colors.red.base} />
              <Text style={styles.menuText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.yellow.dark,
    borderRadius: 50,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor:"transparent",
  },
  menu: {
    marginTop: 50,
    marginRight: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "E />E />#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.red.base,
    marginLeft: 8,
  },
});
function setAuth(arg0: null) {
    throw new Error("Function not implemented.");
}

