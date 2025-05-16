import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { deriveWalletFromMnemonic } from '../utils/wallet';

// Fisher-Yates shuffle algoritması
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

type VerifyMnemonicScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VerifyMnemonic'>;
type VerifyMnemonicScreenRouteProp = RouteProp<RootStackParamList, 'VerifyMnemonic'>;

type Props = {
  navigation: VerifyMnemonicScreenNavigationProp;
  route: VerifyMnemonicScreenRouteProp;
};

const NUM_WORDS_TO_VERIFY = 3;
const TOTAL_CHOICES = 9; // 3 doğru + 6 yanlış

const VerifyMnemonicScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mnemonic } = route.params;
  const originalMnemonicWords = useMemo(() => mnemonic.split(' '), [mnemonic]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationSetup, setVerificationSetup] = useState<{
    wordsToVerifyIndices: number[]; // [2, 5, 8] -> 3., 6., 9. kelimeler
    correctWords: string[]; // [originalMnemonicWords[2], originalMnemonicWords[5], ...]
    choicePool: string[]; // Karıştırılmış 9 kelime
  } | null>(null);
  
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(NUM_WORDS_TO_VERIFY).fill(''));
  const [filledSlots, setFilledSlots] = useState<boolean[]>(new Array(NUM_WORDS_TO_VERIFY).fill(false));

  useEffect(() => {
    // Doğrulanacak rastgele N kelime seç
    const indicesToVerify = new Set<number>();
    while (indicesToVerify.size < NUM_WORDS_TO_VERIFY) {
      indicesToVerify.add(Math.floor(Math.random() * originalMnemonicWords.length));
    }
    const sortedIndicesToVerify = Array.from(indicesToVerify).sort((a, b) => a - b);
    const correctWordsForVerification = sortedIndicesToVerify.map(index => originalMnemonicWords[index]);

    // Yanıltıcı kelimeler oluştur
    const distractorWords = new Set<string>();
    const remainingWords = originalMnemonicWords.filter(word => !correctWordsForVerification.includes(word));
    
    while (distractorWords.size < TOTAL_CHOICES - NUM_WORDS_TO_VERIFY) {
      if (remainingWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingWords.length);
        distractorWords.add(remainingWords.splice(randomIndex, 1)[0]);
      } else {
        // Eğer mnemonic çok kısaysa (ki 12 kelime için bu olmaz) veya tüm kelimeler doğruysa,
        // genel bir BIP-39 listesinden rastgele kelimeler eklenebilir veya basitçe mevcutlarla yetinilebilir.
        // Şimdilik bu durumu basitleştiriyoruz, yeterli kelime yoksa havuz küçülebilir.
        break; 
      }
    }

    const pool = shuffleArray([...correctWordsForVerification, ...Array.from(distractorWords)]);
    
    setVerificationSetup({
      wordsToVerifyIndices: sortedIndicesToVerify,
      correctWords: correctWordsForVerification,
      choicePool: pool,
    });
    setSelectedAnswers(new Array(NUM_WORDS_TO_VERIFY).fill(''));
    setFilledSlots(new Array(NUM_WORDS_TO_VERIFY).fill(false));

  }, [mnemonic, originalMnemonicWords]);

  const handleSelectWord = (word: string) => {
    const nextEmptySlotIndex = filledSlots.indexOf(false);
    if (nextEmptySlotIndex !== -1) {
      const newAnswers = [...selectedAnswers];
      newAnswers[nextEmptySlotIndex] = word;
      setSelectedAnswers(newAnswers);

      const newFilledSlots = [...filledSlots];
      newFilledSlots[nextEmptySlotIndex] = true;
      setFilledSlots(newFilledSlots);
    }
  };

  const handleClearSlot = (slotIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[slotIndex] = '';
    setSelectedAnswers(newAnswers);

    const newFilledSlots = [...filledSlots];
    newFilledSlots[slotIndex] = false;
    setFilledSlots(newFilledSlots);
  };

  const handleVerification = async () => {
    if (!verificationSetup) return;
    setIsLoading(true);

    let allCorrect = true;
    for (let i = 0; i < NUM_WORDS_TO_VERIFY; i++) {
      if (selectedAnswers[i] !== verificationSetup.correctWords[i]) {
        allCorrect = false;
        break;
      }
    }

    // Kısa bir gecikme (opsiyonel)
    // await new Promise(resolve => setTimeout(resolve, 500));

    if (allCorrect) {
      try {
        const walletDetails = deriveWalletFromMnemonic(mnemonic);
        Alert.alert(
          "Doğrulama Başarılı!", 
          "Kelimeleriniz başarıyla doğrulandı. Cüzdan bilgileriniz oluşturuluyor...",
          [
            { text: "Harika!", onPress: () => navigation.replace('WalletSummary', walletDetails) }
          ]
        );
      } catch (error) {
        console.error("Cüzdan türetme hatası:", error);
        Alert.alert("Hata", "Cüzdan oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin.");
      }
    } else {
      Alert.alert("Doğrulama Başarısız", "Seçtiğiniz kelimeler doğru değil. Lütfen kontrol edip tekrar deneyin.");
    }
    setIsLoading(false);
  };

  if (!verificationSetup) {
    return <SafeAreaView style={styles.container}><View style={styles.content}><ActivityIndicator size="large" color="#007AFF" /></View></SafeAreaView>;
  }

  const allSlotsFilled = filledSlots.every(filled => filled);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Kelimeleri Doğrula</Text>
          <Text style={styles.instructionsText}>
            Lütfen aşağıdaki sıralarda belirtilen kelimeleri, alttaki kelime havuzundan seçerek yerleştirin.
          </Text>

          <View style={styles.slotsContainer}>
            {verificationSetup.wordsToVerifyIndices.map((originalIndex, slotIdx) => (
              <TouchableOpacity 
                key={slotIdx} 
                style={[styles.slotBox, selectedAnswers[slotIdx] ? styles.slotBoxFilled : {}]} 
                onPress={() => handleClearSlot(slotIdx)}
                disabled={!selectedAnswers[slotIdx]} // Sadece doluysa temizlenebilir
              >
                <Text style={styles.slotLabel}>{originalIndex + 1}. Kelime:</Text>
                <Text style={styles.slotWord}>{selectedAnswers[slotIdx] || '-'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.poolTitle}>Kelime Havuzu (Seçim Yapın):</Text>
          <View style={styles.wordPoolContainer}>
            {verificationSetup.choicePool.map((word, index) => {
              const isSelected = selectedAnswers.includes(word) && filledSlots[selectedAnswers.indexOf(word)];
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.wordChip, isSelected && styles.wordChipDisabled]} 
                  onPress={() => handleSelectWord(word)}
                  disabled={isSelected || !allSlotsFilled && filledSlots.filter(f => f).length >= NUM_WORDS_TO_VERIFY}
                >
                  <Text style={styles.wordChipText}>{word}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.confirmButton, (!allSlotsFilled || isLoading) && styles.buttonDisabled]} 
            onPress={handleVerification}
            disabled={!allSlotsFilled || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.activityIndicator}/>
            ) : (
              <Text style={styles.buttonText}>Doğrula ve Cüzdanı Oluştur</Text>
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
    paddingVertical: 20, 
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#AEAEB2',
    lineHeight: 22,
  },
  slotsContainer: {
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  slotBox: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1.5,
    borderColor: '#3A3A3C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  slotBoxFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#2C2C2E',
  },
  slotLabel: {
    fontSize: 14,
    color: '#AEAEB2',
    marginBottom: 4,
  },
  slotWord: {
    fontSize: 18,
    fontWeight: '500',
    color: '#E0E0E0',
  },
  poolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 10,
  },
  wordPoolContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  wordChip: {
    backgroundColor: '#2C2C2E',
    borderColor: '#007AFF',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 5,
  },
  wordChipDisabled: {
    backgroundColor: '#404040',
    borderColor: '#505050',
  },
  wordChipText: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  actionButton: {
    width: '95%',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    flexDirection: 'row',
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
    opacity: 0.6,
  },
  activityIndicator: {
    marginRight: 10,
  },
});

export default VerifyMnemonicScreen; 