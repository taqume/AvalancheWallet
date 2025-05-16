import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { generateMnemonic } from '../utils/wallet';

type CreateWalletScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateWallet'>;

type Props = {
  navigation: CreateWalletScreenNavigationProp;
};

const CreateWalletScreen: React.FC<Props> = ({ navigation }) => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateMnemonic = async () => {
    setIsGenerating(true);
    try {
      // await new Promise(resolve => setTimeout(resolve, 300)); // Gecikme efekti için
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
    } catch (error) {
      console.error("Mnemonic oluşturulurken hata:", error);
      Alert.alert("Hata", "Kelimeler oluşturulurken bir sorun oluştu.");
    }
    setIsGenerating(false);
  };

  const handleContinue = () => {
    if (mnemonic) {
      navigation.navigate('VerifyMnemonic', { mnemonic });
    } else {
      Alert.alert("Uyarı", "Devam etmeden önce lütfen kelimelerinizi oluşturun.");
    }
  };

  const mnemonicWords = mnemonic ? mnemonic.split(' ') : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Yeni Cüzdan Oluştur</Text>
          
          {!mnemonic ? (
            <>
              <Text style={styles.instructionsText}>
                Aşağıdaki butona basarak 12 gizli kurtarma kelimenizi oluşturun. Bu kelimeler cüzdanınıza erişimin tek yoludur, bu yüzden onları ÇOK DİKKATLİ ve güvenli bir şekilde saklayın.
              </Text>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton, isGenerating && styles.buttonDisabled]} 
                onPress={handleGenerateMnemonic}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" style={styles.activityIndicator} />
                    <Text style={styles.buttonText}>Oluşturuluyor...</Text>
                  </>
                ) : (
                  <Text style={styles.buttonText}>Gizli Kelimeleri Oluştur</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.mnemonicHeader}>Kurtarma Kelimeleriniz:</Text>
              <Text style={styles.mnemonicSubheader}>
                Bu 12 kelimeyi SADECE SİZİN görebileceğiniz, güvenli bir yere (örneğin bir kağıda yazarak) doğru sırada kaydedin. ASLA dijital ortamda ekran görüntüsü almayın veya kimseyle paylaşmayın. Kaybetmeniz durumunda cüzdanınıza bir daha erişemezsiniz!
              </Text>
              <View style={styles.mnemonicGridContainer}>
                {mnemonicWords.map((word, index) => (
                  <View key={index} style={styles.wordCard}>
                    <Text style={styles.wordIndex}>{index + 1}</Text>
                    <Text style={styles.wordValue}>{word}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity 
                style={[styles.actionButton, styles.confirmButton]} 
                onPress={handleContinue} 
              >
                <Text style={styles.buttonText}>Kelimeleri Kaydettim, Devam Et</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton, isGenerating && styles.buttonDisabled]} 
            onPress={() => navigation.goBack()}
            disabled={isGenerating}
          >
            <Text style={styles.buttonTextSecondary}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Koyu tema
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20, // Üst ve alt boşluklar
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#AEAEB2',
    lineHeight: 24,
    paddingHorizontal:10,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  confirmButton: {
    backgroundColor: '#34C759',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: '#007AFF',
    borderWidth: 1.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  activityIndicator: {
    marginRight: 8, // Buton metni ile arasında boşluk için
  },
  mnemonicHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 10,
    textAlign: 'center',
  },
  mnemonicSubheader: {
    fontSize: 14,
    color: '#FF6B6B', // Uyarı için farklı bir kırmızı tonu
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
    paddingHorizontal: 15,
    lineHeight: 20,
  },
  mnemonicGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Daha dengeli dağılım
    width: '100%',
    marginBottom: 30,
    backgroundColor: '#1C1C1E', // Kelime kartları için arkaplan
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  wordCard: {
    width: '46%', // İki sütun, biraz boşlukla
    backgroundColor: '#2C2C2E', // Kelime kartı arka planı
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row', // Numara ve kelime yan yana
  },
  wordIndex: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8E8E93', // Numara rengi
    marginRight: 10,
  },
  wordValue: {
    fontSize: 17,
    fontWeight: '500',
    color: '#E0E0E0', // Kelime rengi
    flexShrink: 1, // Uzun kelimeler için
  },
});

export default CreateWalletScreen; 