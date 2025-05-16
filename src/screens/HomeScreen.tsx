import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
// import Clipboard from '@react-native-clipboard/clipboard'; // Kopyalama için şimdilik kaldırıldı
import { RootStackParamList } from '../../App';

// react-native-vector-icons kurulumu varsayılıyor, eğer yoksa eklenmeli
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

// const DUMMY_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678"; 
// const NETWORK_NAME = "Avalanche C-Chain"; // Bu bilgiler yeni tasarımda farklı bir yerde olabilir

type ActiveTab = 'assets' | 'nfts';

interface Asset {
  id: string;
  logoPlaceholderColor?: string; // Opsiyonel, eğer resim kullanılacaksa
  logoIconName?: string; // react-native-vector-icons için ikon adı
  symbol: string;
  name: string;
  balance: string;
  valueTL: string;
  priceTL: string;
}

const DUMMY_ASSETS: Asset[] = [
  { id: 'kmps', logoIconName: 'school', symbol: 'KMPS', name: 'Kampüs Token', balance: '0.00', valueTL: '0.00 TL', priceTL: '(1 KMPS = 25.00 TL)' },
  { id: 'avax', logoIconName: 'snowflake', symbol: 'AVAX', name: 'Avalanche', balance: '0.000', valueTL: '0.00 TL', priceTL: '(1 AVAX = 1002.34 TL)' },
  { id: 'eth', logoIconName: 'ethereum', symbol: 'ETH', name: 'Ethereum', balance: '0.0000', valueTL: '0.00 TL', priceTL: '(1 ETH = 1,000,000.24 TL)' },
  { id: 'btc', logoIconName: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', balance: '0.0000', valueTL: '0.00 TL', priceTL: '(1 BTC = 123,344,234.29 TL)' },
];


const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assets');
  const totalAssetValue = "0.00 TL"; 

  // const copyAddressToClipboard = () => {
  //   Clipboard.setString(DUMMY_ADDRESS);
  //   Alert.alert("Kopyalandı!", "Cüzdan adresi panoya kopyalandı.");
  // };

  const renderAssetItem = ({ item }: { item: Asset }) => (
    <TouchableOpacity style={styles.assetItemContainer} onPress={() => Alert.alert(item.name, "Varlık detayları henüz eklenmedi.")}>
      <View style={[styles.assetLogoCircle, item.logoPlaceholderColor ? {backgroundColor: item.logoPlaceholderColor} : {}]}>
        {/* <Icon name={item.logoIconName || "help-circle"} size={24} color="#FFFFFF" /> */}
        <Text style={styles.assetLogoText}>{item.logoIconName ? '' : item.symbol.substring(0,1)}</Text> 
      </View>
      <View style={styles.assetInfo}>
        <Text style={styles.assetSymbol}>{item.symbol}</Text>
        <Text style={styles.assetBalance}>{item.balance}</Text>
      </View>
      <View style={styles.assetValue}>
        <Text style={styles.assetValueTL}>{item.valueTL}</Text>
        <Text style={styles.assetPriceTL}>{item.priceTL}</Text>
      </View>
    </TouchableOpacity>
  );
  
  interface ActionButtonProps {
    icon: string; // Emoji veya basit karakter
    label: string;
    onPress: () => void;
  }

  const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={styles.actionButtonIconCircle}>
        <Text style={styles.actionButtonIconText}>{icon}</Text>
      </View>
      <Text style={styles.actionButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceCardTitle}>Anlık Varlığınız:</Text>
          <Text style={styles.balanceCardAmount}>{totalAssetValue}</Text>
        </View>

        <View style={styles.actionsRow}>
          <ActionButton icon="↗️" label="Gönder" onPress={() => Alert.alert("Gönder", "Henüz uygulanmadı.")} />
          <ActionButton icon="↙️" label="Al" onPress={() => Alert.alert("Al", "Henüz uygulanmadı.")} />
          <ActionButton icon="➕" label="Satın Al" onPress={() => Alert.alert("Satın Al", "Henüz uygulanmadı.")} />
          <ActionButton icon="🍴" label="Yemekhane" onPress={() => Alert.alert("Yemekhane", "Henüz uygulanmadı.")} />
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'assets' && styles.activeTabButton]}
            onPress={() => setActiveTab('assets')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'assets' && styles.activeTabButtonText]}>Varlıklar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'nfts' && styles.activeTabButton]}
            onPress={() => setActiveTab('nfts')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'nfts' && styles.activeTabButtonText]}>NFTler</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'assets' && (
          <View style={styles.tabContentContainer}>
            {DUMMY_ASSETS.length > 0 ? (
              <FlatList
                data={DUMMY_ASSETS}
                renderItem={renderAssetItem}
                keyExtractor={item => item.id}
                style={styles.assetList}
                scrollEnabled={false} 
              />
            ) : (
              <Text style={styles.tabContentText}>Henüz varlığınız bulunmuyor.</Text>
            )}
          </View>
        )}

        {activeTab === 'nfts' && (
          <View style={styles.tabContentContainer}>
            <Text style={styles.tabContentText}>Henüz NFT'niz bulunmuyor.</Text>
          </View>
        )}
        
        {/* Çıkış yap butonu şimdilik kaldırıldı, alt navigasyona taşınabilir veya ayarlar menüsüne */}
        {/* <View style={styles.footerActions}>
            <Button title="Çıkış Yap (Test)" onPress={() => navigation.navigate('Login')} color="#FF3B30" />
        </View> */}

      </ScrollView>

      {/* Kayan Eylem Butonu (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={() => Alert.alert("Robot", "Merhaba!")}>
        <Text style={styles.fabIcon}>🤖</Text>
      </TouchableOpacity>

      {/* Alt Navigasyon Çubuğu (Şimdilik sadece görsel, işlevsellik sonra eklenecek) */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navBarItem}>
          {/* <Icon name="wallet" size={24} color="#FFFFFF" /> */}
          <Text style={styles.navBarIcon}>💰</Text>
          <Text style={styles.navBarLabel}>Cüzdan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem}>
          {/* <Icon name="image-multiple" size={24} color="#8E8E93" /> */}
          <Text style={styles.navBarIcon}>🖼️</Text>
          <Text style={styles.navBarLabel}>NFT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem}>
          {/* <Icon name="swap-horizontal" size={24} color="#8E8E93" /> */}
          <Text style={styles.navBarIcon}>🔄</Text>
          <Text style={styles.navBarLabel}>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem}>
          {/* <Icon name="cog" size={24} color="#8E8E93" /> */}
          <Text style={styles.navBarIcon}>⚙️</Text>
          <Text style={styles.navBarLabel}>Ayarlar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { // Ana container, SafeAreaView
    flex: 1,
    backgroundColor: '#2C1D53', // Yeni ana arka plan rengi (koyu mor)
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Alt nav bar için boşluk bırak
  },
  balanceCard: {
    backgroundColor: '#4A3B79', // Kart arka planı (biraz daha açık mor)
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 15,
    marginTop: 20, // SafeArea sonrası boşluk
    marginBottom: 25,
    alignItems: 'flex-start', // İçeriği sola yasla
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  balanceCardTitle: {
    fontSize: 16,
    color: '#E0E0E0', // Açık renk metin
    marginBottom: 8,
  },
  balanceCardAmount: {
    fontSize: 36, // Daha büyük bakiye
    fontWeight: 'bold',
    color: '#FFFFFF', // Beyaz metin
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 25,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A3B79', // Buton ikon arka planı
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonIconText: {
    fontSize: 22, // Emoji ikon boyutu
  },
  actionButtonLabel: {
    fontSize: 13,
    color: '#E0E0E0', // Açık renk etiket
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    backgroundColor: '#4A3B79', // Sekme arka planı
    borderRadius: 10,
    marginBottom: 1, // İçerikle birleşik görünmesi için ince ayar
  },
  tabButton: {
    flex: 1, // Eşit genişlik
    paddingVertical: 12,
    paddingHorizontal: 10, // Yatayda padding
    alignItems: 'center', // Metni ortala
    borderRadius: 10, // Aktif sekme için
  },
  activeTabButton: {
    backgroundColor: '#6E5AA8', // Aktif sekme rengi (daha belirgin bir mor)
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B0A6D4', // Pasif sekme metin rengi
  },
  activeTabButtonText: {
    color: '#FFFFFF', // Aktif sekme metin rengi
  },
  tabContentContainer: {
    backgroundColor: '#4A3B79', // Varlık listesi arka planı
    marginHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: 5, // Liste ile sekme arasında küçük bir boşluk
    paddingBottom: 10, // Liste altında boşluk
    minHeight: 200, // Minimum yükseklik
  },
  tabContentText: { 
    fontSize: 16,
    color: '#AEAEB2',
    textAlign: 'center',
    paddingVertical: 40,
  },
  assetList: {
    width: '100%',
  },
  assetItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15, 
    borderBottomWidth: 1,
    borderBottomColor: '#5A4B89', // Daha yumuşak bir ayırıcı (arka plana uygun)
  },
  assetLogoCircle: { // logoPlaceholder -> logoCircle olarak güncellendi
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#6E5AA8', // Placeholder için varsayılan renk
  },
  assetLogoText: { 
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
  },
  assetInfo: {
    flex: 1, 
    justifyContent: 'center', // Dikeyde ortala
  },
  assetSymbol: { // Sembol ve bakiye yan yana değil, üst üste
    fontSize: 16, // Biraz küçültüldü
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
  assetBalance: {
    fontSize: 13, // Biraz küçültüldü
    color: '#B0A6D4', // Daha soluk renk
    marginTop: 2,
  },
  assetValue: {
    alignItems: 'flex-end', 
    justifyContent: 'center', // Dikeyde ortala
  },
  assetValueTL: { // TL değeri ve birim fiyat yan yana değil, üst üste
    fontSize: 16, // Biraz küçültüldü
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  assetPriceTL: {
    fontSize: 13, // Biraz küçültüldü
    color: '#B0A6D4', // Daha soluk renk
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Alt nav bar'ın biraz üstünde
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6E5AA8', // FAB rengi
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 28, // Robot emoji boyutu
  },
  bottomNavBar: {
    position: 'absolute', // Ekranın altına sabitle
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 70, // Yükseklik artırıldı
    backgroundColor: '#3A2D5F', // Alt nav bar arka planı (ana arka planla aynı veya biraz farklı)
    borderTopWidth: 1,
    borderTopColor: '#5A4B89', // Üst çizgi
    alignItems: 'center', // Dikeyde ortala
    justifyContent: 'space-around', // Öğeleri eşit dağıt
    paddingBottom: 5, // iPhone X gibi çentikli cihazlar için alt boşluk (SafeAreaView alt kısmı yönetmiyorsa)
  },
  navBarItem: {
    alignItems: 'center',
    flex: 1, // Eşit dağılım
  },
  navBarIcon: {
    fontSize: 22, // NavBar ikon boyutu
    marginBottom: 3,
    color: '#B0A6D4', // Pasif ikon rengi (aktif olan Cüzdan için farklı olacak)
  },
  navBarLabel: {
    fontSize: 11, // Etiket boyutu küçültüldü
    color: '#B0A6D4', // Pasif etiket rengi
  },
  // Aktif NavBarItem için özel stil eklenebilir (örneğin Cüzdan için)
  // Örneğin navBarItemActive ve navBarLabelActive gibi.
});

export default HomeScreen; 