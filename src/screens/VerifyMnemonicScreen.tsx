import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, TextInput, Alert, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { deriveWalletFromMnemonic } from '../utils/wallet';

type VerifyMnemonicScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerifyMnemonic'>;
type VerifyMnemonicScreenRouteProp = RouteProp<RootStackParamList, 'VerifyMnemonic'>;

type Props = {
  navigation: VerifyMnemonicScreenNavigationProp;
  route: VerifyMnemonicScreenRouteProp;
};

const VerifyMnemonicScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mnemonic } = route.params;
  const mnemonicWords = useMemo(() => mnemonic.split(' '), [mnemonic]);
  
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const NUM_WORDS_TO_VERIFY = 3;

  useEffect(() => {
    // Rastgele benzersiz N indeks seçelim
    const indices = new Set<number>();
    while (indices.size < NUM_WORDS_TO_VERIFY) {
      indices.add(Math.floor(Math.random() * mnemonicWords.length));
    }
    setSelectedIndices(Array.from(indices).sort((a, b) => a - b)); // Sıralı göstermek daha iyi olabilir
    setUserInputs(new Array(NUM_WORDS_TO_VERIFY).fill(''));
    setErrorMessages(new Array(NUM_WORDS_TO_VERIFY).fill(''));
  }, [mnemonicWords]);

  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...userInputs];
    newInputs[index] = text.trim().toLowerCase();
    setUserInputs(newInputs);
    // Kullanıcı yazarken hatayı temizle
    const newErrorMessages = [...errorMessages];
    newErrorMessages[index] = '';
    setErrorMessages(newErrorMessages);
  };

  const handleVerification = () => {
    let allCorrect = true;
    const newErrorMessages = new Array(NUM_WORDS_TO_VERIFY).fill('');

    for (let i = 0; i < selectedIndices.length; i++) {
      const actualWordIndex = selectedIndices[i];
      if (userInputs[i] !== mnemonicWords[actualWordIndex]) {
        allCorrect = false;
        newErrorMessages[i] = `Kelime yanlış.`;
      }
    }
    setErrorMessages(newErrorMessages);

    if (allCorrect) {
      try {
        const walletDetails = deriveWalletFromMnemonic(mnemonic);
        Alert.alert(
          "Doğrulama Başarılı!", 
          "Kelimeleriniz başarıyla doğrulandı. Cüzdan bilgileriniz oluşturuluyor...",
          [
            { text: "Tamam", onPress: () => navigation.navigate('WalletSummary', walletDetails) }
          ]
        );
      } catch (error) {
        console.error("Cüzdan türetme hatası:", error);
        Alert.alert("Hata", "Cüzdan oluşturulurken bir sorun oluştu.");
      }
    } else {
      Alert.alert("Doğrulama Başarısız", "Lütfen işaretli kelimeleri doğru girdiğinizden emin olun.");
    }
  };

  if (selectedIndices.length === 0) {
    return <SafeAreaView style={styles.container}><View style={styles.content}><Text>Yükleniyor...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Kelimeleri Doğrula</Text>
          <Text style={styles.infoText}>
            Cüzdanınızı güvende tutmak için lütfen aşağıdaki sıralarda bulunan kelimeleri girin.
          </Text>

          {selectedIndices.map((wordIndex, iterationIndex) => (
            <View key={wordIndex} style={styles.inputGroup}>
              <Text style={styles.label}>{wordIndex + 1}. Kelime:</Text>
              <TextInput
                style={[styles.input, errorMessages[iterationIndex] ? styles.inputError : {}]}
                placeholder={`Lütfen ${wordIndex + 1}. kelimeyi girin`}
                onChangeText={(text) => handleInputChange(text, iterationIndex)}
                value={userInputs[iterationIndex]}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true} // Kelimelerin görünmemesi için
              />
              {errorMessages[iterationIndex] ? <Text style={styles.errorText}>{errorMessages[iterationIndex]}</Text> : null}
            </View>
          ))}
          
          <View style={styles.buttonWrapper}>
            <Button title="Doğrula ve Cüzdanı Oluştur" onPress={handleVerification} color="#34C759"/>
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Geri Dön" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 20,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#3C3C43',
    paddingHorizontal: 10,
  },
  inputGroup: {
    width: '90%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#3C3C43',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12, // Yüksekliği artırıldı
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputError: {
    borderColor: '#FF3B30', // Hata durumunda kırmızı border
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  buttonWrapper: {
    width: '90%',
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  // mnemonicPreview kaldırıldı, kullanıcıya kelimeleri göstermemeliyiz.
});

export default VerifyMnemonicScreen; 