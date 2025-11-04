import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";


export const AnimalInfoCard = ({ detalhes }: { detalhes: any }) => {

  // Função auxiliar para formatar
  function formatarDataSimples(dataISO: string) {
    if (!dataISO) {
      return '-';
    }
    const soData = dataISO.split('T')[0];
    const partes = soData.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  
  const maturidadeMap: Record<string, string> = {
    B: "Bezerro",
    N: "Novilha",
    T: "Touro",
    V: "Vaca",
  };
  const maturidadeTexto = maturidadeMap[detalhes.nivel_maturidade] || detalhes.nivel_maturidade;

  return (
    <View style={styles.infoCard}>
      {/* Header com nome, categoria e status */}
      <View style={styles.infoHeader}>
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{detalhes?.nome ?? 'Sem Nome'}</Text>
            {detalhes?.categoria && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{detalhes.categoria}</Text>
              </View>
            )}
          </View>
          <Text style={styles.brincoText}>Brinco: Nº {detalhes?.brinco ?? '-'}</Text>
        </View>

        <View style={[
            styles.statusBadge,
            { backgroundColor: detalhes?.status ? '#D1FAE5' : '#FEE2E2' },
          ]}>
          <View style={[
              styles.statusDot,
              { backgroundColor: detalhes?.status ? '#10B981' : '#EF4444' },
            ]} 
          />
          <Text style={[
              styles.statusText,
              { color: detalhes?.status ? '#065F46' : '#B91C1C' },
            ]}>
            {detalhes?.status ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
      <View style={styles.infoGrid}>
        <View style={styles.Row}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nascimento</Text>
            <Text style={styles.infoValue}>{detalhes?.dt_nascimento ? detalhes.dt_nascimento.split('T')[0].split('-').reverse().join('/') : '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Maturidade</Text>
            <Text style={styles.infoValue}>{maturidadeTexto ?? '-'}</Text>
          </View>
        </View>
        <View style={styles.Row}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sexo</Text>
            <Text style={styles.infoValue}>{detalhes?.sexo === 'F' ? 'Fêmea' : 'Macho'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Origem</Text>
            <Text style={styles.infoValue}>{detalhes?.origem ?? '-'}</Text>
          </View>
        </View>
        <View style={styles.Row}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Raça</Text>
            <Text style={styles.infoValue}>{detalhes?.racaNome ?? '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Grupo</Text>
            <Text style={styles.infoValue}>{detalhes?.grupo ?? '-'}</Text>
          </View>
        </View>
        <View style={styles.Row}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Pai</Text>
            <Text style={styles.infoValue}>{detalhes?.paiNome ?? '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mãe</Text>
            <Text style={styles.infoValue}>{detalhes?.maeNome ?? '-'}</Text>
          </View>
        </View>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  infoHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  nameRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  nameText: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1A1A1A' 
  },
  brincoText: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginTop: 2 
  },
  categoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#92400E' 
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: 4 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
  infoGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 12, 
    gap: 12 
  },
  Row: { 
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: { 
    width: '50%', 
    marginBottom: 8 
  },
  infoLabel: { 
    fontSize: 12, 
    color: '#6B7280' 
  },
  infoValue: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#1A1A1A', 
    marginTop: 2 
  },
});
