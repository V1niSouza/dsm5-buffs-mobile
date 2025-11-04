import React, { Children, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";


interface TitleProps {
    children: React.ReactNode;
}

export default function TextTitle( { children }: TitleProps) {

  return (
        <Text style={styles.title}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});
