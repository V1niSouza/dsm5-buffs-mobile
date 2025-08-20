import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MainLayout } from '../layouts/MainLayout';
import { useDimensions } from '../utils/useDimensions';
import TableAnimais, { Animal } from '../components/Table'; // <-- importa o tipo
import SearchBar from '../components/SearchBar';

export const RebanhoScreen = () => {
  const { wp, hp } = useDimensions();
  
  const animais: Animal[] = [
    { id: 1, status: true, brinco: "A123", nome: "Estrela", raca: "Holandesa", sexo: "Fêmea" },
    { id: 2, status: false, brinco: "B456", nome: "TouroX", raca: "Angus", sexo: "Macho" },
    { id: 3, status: true, brinco: "C789", nome: "Luna", raca: "Jersey", sexo: "Fêmea" },
    { id: 4, status: false, brinco: "D012", nome: "Rex", raca: "Hereford", sexo: "Macho" },
    { id: 5, status: true, brinco: "E345", nome: "Bella", raca: "Holandesa", sexo: "Fêmea" },
    { id: 6, status: false, brinco: "F678", nome: "Max", raca: "Angus", sexo: "Macho" },
    { id: 7, status: true, brinco: "G901", nome: "Mila", raca: "Jersey", sexo: "Fêmea" },
    { id: 8, status: false, brinco: "H234", nome: "Thor", raca: "Hereford", sexo: "Macho" },
    { id: 9, status: true, brinco: "I567", nome: "Nina", raca: "Holandesa", sexo: "Fêmea" },
    { id: 10, status: false, brinco: "J890", nome: "Rocky", raca: "Angus", sexo: "Macho" },
    { id: 11, status: true, brinco: "K123", nome: "Daisy", raca: "Jersey", sexo: "Fêmea" },
    { id: 12, status: false, brinco: "L456", nome: "Brutus", raca: "Hereford", sexo: "Macho" },
    { id: 13, status: true, brinco: "M789", nome: "Lola", raca: "Holandesa", sexo: "Fêmea" },
    { id: 14, status: false, brinco: "N012", nome: "Hercules", raca: "Angus", sexo: "Macho" },
    { id: 15, status: true, brinco: "O345", nome: "Sophie", raca: "Jersey", sexo: "Fêmea" },
    { id: 16, status: false, brinco: "P678", nome: "Zeus", raca: "Hereford", sexo: "Macho" },
    { id: 17, status: true, brinco: "Q901", nome: "Chloe", raca: "Holandesa", sexo: "Fêmea" },
  ];


  return (
    <MainLayout>
      <ScrollView>
        <SearchBar />
        
        <TableAnimais
          data={animais}
          
          onVerMais={(animal: Animal) => {   // <-- adiciona a tipagem aqui
            console.log("Ver mais sobre:", animal);
            // ex: navigation.navigate("AnimalDetalhes", { animal })
          }}
        />
      </ScrollView>
    </MainLayout>
  );
};
