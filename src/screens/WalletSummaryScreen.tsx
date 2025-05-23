import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard'; // Kopyalama için
import { RootStackParamList } from '../../App';

type WalletSummaryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WalletSummary'>;
type WalletSummaryScreenRouteProp = RouteProp<RootStackParamList, 'WalletSummary'>;

type Props = {
  navigation: WalletSummaryScreenNavigationProp;
  route: WalletSummaryScreenRouteProp;
};

const WalletSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mnemonic, privateKey, address } = route.params;

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert("Kopyalandı!", `${label} panoya kopyalandı.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.headerTitle}>Cüzdanınız Başarıyla Oluşturuldu!</Text>
          <Text style={styles.importantWarning}>
            ÇOK ÖNEMLİ: Aşağıdaki bilgileri SADECE SİZİN erişebileceğiniz, son derece güvenli bir yerde (tercihen çevrimdışı, örneğin bir kağıda yazarak) saklayın. Bu bilgilere sahip olan herkes cüzdanınıza tam erişim sağlayabilir. ASLA ekran görüntüsü almayın veya dijital olarak güvensiz bir şekilde saklamayın.
          </Text>
          
          <InfoBox 
            title="Kurtarma Kelimeleriniz (Mnemonic)"
            value={mnemonic}
            onCopy={() => copyToClipboard(mnemonic, "Kurtarma Kelimeleri")}
            warningText="Bu kelimeleri kaybetmeniz durumunda cüzdanınıza BİR DAHA ASLA erişemezsiniz."
            isSensitive={true}
          />

          <InfoBox 
            title="Özel Anahtarınız (Private Key)"
            value={privateKey}
            onCopy={() => copyToClipboard(privateKey, "Özel Anahtar")}
            warningText="Bu anahtarı ASLA HİÇ KİMSEYLE paylaşmayın. Cüzdanınızın tam kontrolünü sağlar."
            isSensitive={true}
          />

          <InfoBox 
            title="Cüzdan Adresiniz (Paylaşılabilir)"
            value={address}
            onCopy={() => copyToClipboard(address, "Cüzdan Adresi")}
            warningText="Bu adresi AVAX ve C-Chain uyumlu tokenları almak için başkalarıyla paylaşabilirsiniz."
            isSensitive={false}
          />

          <View style={styles.buttonWrapper}>
            <Button 
              title="Ana Sayfaya Git (Cüzdanım)" 
              onPress={() => navigation.navigate('Home')} 
              color="#007AFF"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Bilgi kutucukları için ayrı bir component oluşturalım
interface InfoBoxProps {
  title: string;
  value: string;
  onCopy: () => void;
  warningText: string;
  isSensitive?: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, value, onCopy, warningText, isSensitive }) => {
  const [showValue, setShowValue] = React.useState(!isSensitive); // Hassas veriler başlangıçta gizli

  return (
    <View style={styles.infoBoxContainer}>
      <Text style={styles.infoTitle}>{title}</Text>
      {isSensitive ? (
        <TouchableOpacity onPress={() => setShowValue(!showValue)} style={styles.sensitiveValueContainer}>
          <Text selectable style={styles.infoDetailMuted}>
            {showValue ? value : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
          </Text>
          <Text style={styles.eyeIcon}>{showValue ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      ) : (
        <Text selectable style={styles.infoDetail}>{value}</Text>
      )}
      <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
        <Text style={styles.copyButtonText}>Kopyala</Text>
      </TouchableOpacity>
      <Text style={[styles.warningText, isSensitive && styles.warningTextSensitive]}>{warningText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Koyu tema arka planı
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20, // Üst ve alt boşluk
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 24, // Biraz daha büyük
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#E0E0E0', // Koyu tema metin rengi
    textAlign: 'center',
  },
  importantWarning: {
    fontSize: 15,
    color: '#FF6B6B', // Koyu tema için canlı uyarı rengi
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 25,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  infoBoxContainer: { // infoBox -> infoBoxContainer olarak değiştirildi
    width: '100%',
    backgroundColor: '#1C1C1E', // Koyu tema eleman arka planı
    borderRadius: 12, // Daha yuvarlak kenarlar
    padding: 18, // Padding artırıldı
    marginBottom: 20,
    shadowColor: "#000", // Gölge koyu temada da kalabilir
    shadowOffset: {
      width: 0,
      height: 2, // Gölge biraz daha belirgin
    },
    shadowOpacity: 0.15, // Gölge opaklığı azaltıldı
    shadowRadius: 3.84,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 17, // Biraz daha büyük
    fontWeight: '600',
    marginBottom: 10,
    color: '#E0E0E0', // Koyu tema metin rengi
  },
  infoDetail: {
    fontSize: 15,
    color: '#E0E0E0', // Koyu tema ana metin rengi
    marginBottom: 10,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  infoDetailMuted: {
    fontSize: 15,
    color: '#8E8E93', // Koyu tema ikincil metin rengi (uygun)
    fontFamily: 'monospace',
    lineHeight: 22,
    flexShrink: 1, // Uzun metinlerin taşmasını engelle
  },
  sensitiveValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#2C2C2E', // Koyu tema iç eleman arka planı
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  eyeIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  copyButton: {
    backgroundColor: '#2C2C2E', // Koyu tema buton arka planı
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start', // Sola yasla
    marginBottom: 10,
  },
  copyButtonText: {
    color: '#007AFF', // Vurgu rengi (kalsın)
    fontWeight: '500',
    fontSize: 14,
  },
  warningText: {
    fontSize: 13,
    color: '#AEAEB2', // Koyu tema ikincil metin rengi
    fontStyle: 'italic',
    lineHeight: 18,
  },
  warningTextSensitive: {
    color: '#FFD580', // Koyu tema için canlı hassas uyarı rengi
    fontWeight: '500',
  },
  buttonWrapper: {
    width: '90%',
    marginTop: 15, // Diğer elemanlarla arasına boşluk
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default WalletSummaryScreen; 