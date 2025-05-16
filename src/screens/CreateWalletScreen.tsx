import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { generateMnemonic } from '../utils/wallet'; // wallet.ts'den fonksiyonu import ediyoruz

type CreateWalletScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateWallet'>;

type Props = {
  navigation: CreateWalletScreenNavigationProp;
};

const CreateWalletScreen: React.FC<Props> = ({ navigation }) => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);

  const handleGenerateMnemonic = () => {
    try {
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
      setShowMnemonic(true);
    } catch (error) {
      console.error("Mnemonic oluşturulurken hata:", error);
      Alert.alert("Hata", "Kelimeler oluşturulurken bir sorun oluştu.");
    }
  };

  const handleContinue = () => {
    if (mnemonic) {
      navigation.navigate('VerifyMnemonic', { mnemonic });
    } else {
      Alert.alert("Uyarı", "Devam etmeden önce lütfen kelimelerinizi oluşturun.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Yeni Cüzdan Oluştur</Text>
        
        {!showMnemonic && (
          <Text style={styles.infoText}>
            Aşağıdaki butona basarak 12 gizli kurtarma kelimenizi oluşturun. Bu kelimeler cüzdanınıza erişimin tek yoludur, güvenli bir şekilde saklayın.
          </Text>
        )}

        <View style={styles.buttonWrapper}>
          <Button 
            title={showMnemonic ? "Kelimeleri Gizle" : "Gizli Kelimeleri Oluştur ve Göster"} 
            onPress={showMnemonic ? () => setShowMnemonic(false) : handleGenerateMnemonic} 
            color={showMnemonic ? "#FF9500" : "#007AFF"} // Turuncu ve Mavi
          />
        </View>

        {showMnemonic && mnemonic && (
          <View style={styles.mnemonicContainer}>
            <Text style={styles.mnemonicWarning}>ÖNEMLİ: Bu kelimeleri SADECE SİZİN görebileceğiniz, güvenli bir yere (örneğin bir kağıda yazarak) kaydedin. ASLA dijital ortamda ekran görüntüsü almayın veya kimseyle paylaşmayın.</Text>
            <Text style={styles.mnemonicText}>{mnemonic}</Text>
          </View>
        )}

        {mnemonic && showMnemonic && (
          <View style={styles.buttonWrapper}>
            <Button 
              title="Devam Et (Kelimeleri Doğrula)" 
              onPress={handleContinue} 
              color="#34C759" // Yeşil
            />
          </View>
        )}
        <View style={styles.buttonWrapper}>
          <Button title="Geri Dön" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // Biraz padding artırıldı
  },
  title: {
    fontSize: 24, // Biraz büyütüldü
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#3C3C43',
    paddingHorizontal: 10, // Yatay padding eklendi
  },
  buttonWrapper: { // Butonlar için sarmalayıcı
    width: '90%',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mnemonicContainer: {
    marginVertical: 20,
    padding: 15,
    borderColor: '#D1D1D6',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    width: '95%',
    alignItems: 'center', // İçeriği ortala
  },
  mnemonicWarning: {
    fontSize: 14,
    color: '#FF3B30', // Kırmızı uyarı rengi
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  mnemonicText: {
    fontSize: 17, // Biraz büyütüldü
    fontWeight: '500', // Yarı-kalın
    textAlign: 'center',
    color: '#1C1C1E',
    letterSpacing: 0.5, // Harf aralığı
    lineHeight: 24, // Satır yüksekliği
  },
});

export default CreateWalletScreen; 