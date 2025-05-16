import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  // TODO: Cüzdan verileri (bakiye, varlıklar vb.) buraya gelecek
  const totalBalance = "0.00 AVAX"; // Örnek bakiye

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cüzdanım</Text>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Toplam Bakiye:</Text>
          <Text style={styles.balanceAmount}>{totalBalance}</Text>
        </View>

        {/* TODO: Varlık listesi buraya eklenecek */}
        <View style={styles.assetsContainer}>
          <Text style={styles.assetsTitle}>Varlıklarım</Text>
          <Text style={styles.noAssetsText}>Henüz varlığınız bulunmuyor.</Text>
          {/* Örnek Varlık Öğesi
          <View style={styles.assetItem}>
            <Text style={styles.assetName}>Avalanche (AVAX)</Text>
            <Text style={styles.assetBalance}>0.00</Text>
          </View>
          */}
        </View>

        {/* TODO: Gönder, Al butonları ve işlem geçmişi gibi özellikler eklenebilir */}
        <Button title="Çıkış Yap (Login Ekranına Dön)" onPress={() => navigation.navigate('Login')} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1C1C1E',
  },
  balanceContainer: {
    width: '95%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#3C3C43',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  assetsContainer: {
    width: '95%',
    marginBottom: 25,
  },
  assetsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  noAssetsText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    paddingVertical: 20,
  },
  // assetItem: { ... }, // Varlık öğesi stilleri eklenecek
});

export default HomeScreen; 