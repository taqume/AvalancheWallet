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
  ActivityIndicator,
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
        if (!mnemonicInput.trim() || mnemonicInput.trim().split(' ').length < 12) {
          Alert.alert("Geçersiz Giriş", "Lütfen en az 12 adet kurtarma kelimesi girin.");
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
        if (!/^(0x)?[0-9a-fA-F]{64}$/.test(privateKeyInput.trim())) {
            Alert.alert("Geçersiz Özel Anahtar", "Özel anahtar formatı hatalı görünüyor. Lütfen kontrol edin.");
            setIsLoading(false);
            return;
        }
        walletDetails = deriveWalletFromPrivateKey(privateKeyInput.trim());
      }

      Alert.alert("Başarılı!", "Cüzdanınız başarıyla içe aktarıldı.", [
        { text: "Harika!", onPress: () => navigation.replace('Home') },
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
                disabled={isLoading}
              >
                <Text style={[styles.segmentButtonText, importType === 'mnemonic' && styles.segmentButtonTextActive]}>
                  12 Kelime
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentButton, importType === 'privateKey' && styles.segmentButtonActive]}
                onPress={() => setImportType('privateKey')}
                disabled={isLoading}
              >
                <Text style={[styles.segmentButtonText, importType === 'privateKey' && styles.segmentButtonTextActive]}>
                  Özel Anahtar
                </Text>
              </TouchableOpacity>
            </View>

            {importType === 'mnemonic' ? (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Kurtarma Kelimeleri (Boşluklarla ayırın):</Text>
                <TextInput
                  style={styles.inputLarge}
                  placeholder="örn: kelime1 kelime2 kelime3 ..."
                  placeholderTextColor="#6E6E73"
                  onChangeText={setMnemonicInput}
                  value={mnemonicInput}
                  multiline={true}
                  numberOfLines={4}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  keyboardAppearance="dark"
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Özel Anahtarınız (Private Key):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="örn: 0x... veya sadece harf/rakam dizisi"
                  placeholderTextColor="#6E6E73"
                  onChangeText={setPrivateKeyInput}
                  value={privateKeyInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  keyboardAppearance="dark"
                />
              </View>
            )}

            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton, isLoading && styles.buttonDisabled]} 
              onPress={handleImport} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={styles.activityIndicator} />
              ) : (
                <Text style={styles.buttonText}>Cüzdanı İçe Aktar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton, isLoading && styles.buttonDisabled]} 
              onPress={() => navigation.goBack()} 
              disabled={isLoading}
            >
              <Text style={styles.buttonTextSecondary}>Geri Dön</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  segmentedControlContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#007AFF',
    borderRadius: 8, 
    margin: 2,
  },
  segmentButtonText: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#AEAEB2',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputLarge: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 100, 
    textAlignVertical: 'top',
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
    marginRight: 10,
  },
});

export default ImportWalletScreen; 