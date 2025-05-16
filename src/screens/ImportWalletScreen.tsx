import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { deriveWalletFromMnemonic, deriveWalletFromPrivateKey } from '../utils/wallet';

type ImportWalletScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ImportWallet'>;

type Props = {
  navigation: ImportWalletScreenNavigationProp;
};

type ImportType = 'mnemonic' | 'privateKey';

const ImportWalletScreen: React.FC<Props> = ({ navigation }) => {
  const [importType, setImportType] = useState<ImportType>('mnemonic');
  const [mnemonicInput, setMnemonicInput] = useState<string>('');
  const [privateKeyInput, setPrivateKeyInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImport = async () => {
    setIsLoading(true);
    try {
      let walletDetails;
      if (importType === 'mnemonic') {
        if (!mnemonicInput.trim() || mnemonicInput.trim().split(' ').length !== 12) {
          Alert.alert("Geçersiz Giriş", "Lütfen 12 adet kurtarma kelimesi girin.");
          setIsLoading(false);
          return;
        }
        walletDetails = deriveWalletFromMnemonic(mnemonicInput.trim());
      } else {
        if (!privateKeyInput.trim()) {
          Alert.alert("Geçersiz Giriş", "Lütfen özel anahtarınızı girin.");
          setIsLoading(false);
          return;
        }
        // Basit bir hex kontrolü (ethers.js daha detaylı kontrol yapacaktır)
        if (!/^(0x)?[0-9a-fA-F]{64}$/.test(privateKeyInput.trim())) {
            Alert.alert("Geçersiz Özel Anahtar", "Özel anahtar formatı hatalı görünüyor. Lütfen kontrol edin.");
            setIsLoading(false);
            return;
        }
        walletDetails = deriveWalletFromPrivateKey(privateKeyInput.trim());
      }

      // Başarılı içe aktarma sonrası Home ekranına yönlendir
      // TODO: İçe aktarılan cüzdan bilgilerini (adres, anahtar vb.) güvenli bir şekilde saklamak gerekebilir (EncryptedStorage vb.)
      // Şimdilik sadece Home'a yönlendiriyoruz, Home ekranı bu bilgileri parametre olarak almayacak şekilde güncellenebilir
      // ya da bir state management çözümü (Context API, Redux, Zustand) kullanılabilir.
      Alert.alert("Başarılı!", "Cüzdanınız başarıyla içe aktarıldı.", [
        { text: "Tamam", onPress: () => navigation.replace('Home') }, // replace ile geri dönüşte bu ekrana gelinmez
      ]);

    } catch (error: any) {
      console.error("Cüzdan içe aktarma hatası:", error);
      Alert.alert("İçe Aktarma Başarısız", error.message || "Cüzdan içe aktarılırken bir hata oluştu. Lütfen girdilerinizi kontrol edin.");
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Cüzdanı İçe Aktar</Text>

            <View style={styles.segmentedControlContainer}>
              <TouchableOpacity
                style={[styles.segmentButton, importType === 'mnemonic' && styles.segmentButtonActive]}
                onPress={() => setImportType('mnemonic')}
              >
                <Text style={[styles.segmentButtonText, importType === 'mnemonic' && styles.segmentButtonTextActive]}>
                  12 Kelime
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentButton, importType === 'privateKey' && styles.segmentButtonActive]}
                onPress={() => setImportType('privateKey')}
              >
                <Text style={[styles.segmentButtonText, importType === 'privateKey' && styles.segmentButtonTextActive]}>
                  Özel Anahtar
                </Text>
              </TouchableOpacity>
            </View>

            {importType === 'mnemonic' ? (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Kurtarma Kelimeleri (12 adet, boşluklarla ayırın):</Text>
                <TextInput
                  style={styles.inputLarge}
                  placeholder="örn: kelime1 kelime2 kelime3 ... kelime12"
                  onChangeText={setMnemonicInput}
                  value={mnemonicInput}
                  multiline={true}
                  numberOfLines={3}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Özel Anahtarınız (Private Key):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="örn: 0x... veya sadece harf/rakam dizisi"
                  onChangeText={setPrivateKeyInput}
                  value={privateKeyInput}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            )}

            <View style={styles.buttonWrapper}>
              <Button 
                title={isLoading ? "İçe Aktarılıyor..." : "Cüzdanı İçe Aktar"} 
                onPress={handleImport} 
                disabled={isLoading}
                color="#007AFF"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Geri Dön" onPress={() => navigation.goBack()} disabled={isLoading}/>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  segmentedControlContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 7, // Aktifken içten border gibi görünmesi için
    margin: 1.5, // Aktifken arkaplandan biraz ayırmak için
  },
  segmentButtonText: {
    fontSize: 15,
    color: '#007AFF',
  },
  segmentButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  inputContainer: {
    width: '95%',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#3C3C43',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputLarge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 80, // Mnemonic için daha geniş alan
    textAlignVertical: 'top',
  },
  buttonWrapper: {
    width: '90%',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default ImportWalletScreen; 