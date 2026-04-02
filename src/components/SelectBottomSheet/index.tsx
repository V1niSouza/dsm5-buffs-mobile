import React, { useMemo, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { 
  BottomSheetModal, 
  BottomSheetView,
  BottomSheetBackdrop 
} from "@gorhom/bottom-sheet";

interface Item {
  label: string;
  value: string;
}

interface Props {
  items: Item[];
  value: string | null;
  onChange: (value: string) => void;
  title: string;
  placeholder?: string;
}

export default function SelectBottomSheet({
  items,
  value,
  onChange,
  title,
  placeholder = "Selecionar",
}: Props) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["30%", "50%"], []);

    const open = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const close = useCallback(() => {
        bottomSheetRef.current?.dismiss();
    }, []);

    const selectedLabel =
        items.find((i) => i.value === value)?.label || placeholder;

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            />
        ),
        []
    );

return (
    <View> 
        <TouchableOpacity onPress={open} style={styles.input}>
            <Text style={styles.inputText}>{selectedLabel}</Text>
        </TouchableOpacity>
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            backgroundStyle={{ backgroundColor: "#fff" }}>
            <BottomSheetView style={styles.sheetContainer}>
                <Text style={styles.title}>{title}</Text>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                        onChange(item.value);
                        close();
                        }}>
                        <Text style={styles.itemText}>{item.label}</Text>
                    </TouchableOpacity>
                    )}
                />
            </BottomSheetView>
        </BottomSheetModal>
    </View>
);
}
const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  inputText: {
    fontSize: 16,
  },
  sheetContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
});