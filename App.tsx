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
          headerShown: false, // Tüm headerları gizle
          /* Önceki header stil ayarları artık gereksiz
          headerStyle: {
            backgroundColor: '#F5F5F7', 
          },
          headerTintColor: '#1C1C1E', 
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false, 
          */
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          // options içinde title artık görsel olarak görünmeyecek ama navigasyon için faydalı olabilir
        />
        <Stack.Screen 
          name="ImportWallet" 
          component={ImportWalletScreen} 
        />
        <Stack.Screen 
          name="CreateWallet" 
          component={CreateWalletScreen} 
        />
        <Stack.Screen 
          name="VerifyMnemonic" 
          component={VerifyMnemonicScreen} 
        />
        <Stack.Screen 
          name="WalletSummary" 
          component={WalletSummaryScreen} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
