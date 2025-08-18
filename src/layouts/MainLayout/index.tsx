import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDimensions } from '../../utils/useDimensions';

interface MainLayoutProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  backgroundColor = '#000',
}) => {
  const { wp, hp } = useDimensions();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: hp(1),
          paddingHorizontal: wp(2),
          backgroundColor,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,               // garante que o layout ocupe toda a tela
  },
});
