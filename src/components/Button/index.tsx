import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

type YellowButtonProps = {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function YellowButton({ title, onPress, disabled }: YellowButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.yellow.base,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  disabled: {
    backgroundColor: colors.gray.disabled,
  },
});
