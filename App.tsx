/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import ImportWalletScreen from './src/screens/ImportWalletScreen';
import CreateWalletScreen from './src/screens/CreateWalletScreen';
import VerifyMnemonicScreen from './src/screens/VerifyMnemonicScreen';
import WalletSummaryScreen from './src/screens/WalletSummaryScreen';
import HomeScreen from './src/screens/HomeScreen';

// Ekran tiplerini tanımlayalım (henüz tüm ekranlar oluşturulmadı)
export type RootStackParamList = {
  Login: undefined;
  ImportWallet: undefined;
  CreateWallet: undefined;
  VerifyMnemonic: { mnemonic: string }; // Parametre alacak ekranlar için tip belirtiyoruz
  WalletSummary: { mnemonic: string; privateKey: string; address: string }; // Örnek parametreler
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F5F5F7', // Açık gri header
          },
          headerTintColor: '#1C1C1E', // Koyu başlık rengi
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false, // Geri butonunda başlık gösterme (iOS)
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Avalanche Cüzdanı' }} 
        />
        <Stack.Screen 
          name="ImportWallet" 
          component={ImportWalletScreen} 
          options={{ title: 'Cüzdanı İçe Aktar' }} 
        />
        <Stack.Screen 
          name="CreateWallet" 
          component={CreateWalletScreen} 
          options={{ title: 'Yeni Cüzdan Oluştur' }} 
        />
        <Stack.Screen 
          name="VerifyMnemonic" 
          component={VerifyMnemonicScreen} 
          options={{ title: 'Kelimeleri Doğrula' }} 
        />
        <Stack.Screen 
          name="WalletSummary" 
          component={WalletSummaryScreen} 
          options={{ title: 'Cüzdan Bilgileri' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Cüzdanım' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
