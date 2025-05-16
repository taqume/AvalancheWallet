import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; // App.tsx dosyasındaki RootStackParamList'i import ediyoruz

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Avalanche Cüzdanına Hoş Geldiniz</Text>
        <View style={styles.buttonContainer}>
          <Button 
            title="Cüzdana Giriş" 
            onPress={() => navigation.navigate('ImportWallet')} 
            color="#007AFF" // iOS mavi rengi
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="Cüzdan Oluştur" 
            onPress={() => navigation.navigate('CreateWallet')} 
            color="#34C759" // iOS yeşil rengi
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7', // Açık gri arka plan
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#1C1C1E', // Koyu gri metin rengi
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 8, // Butonlara hafif yuvarlaklık
    overflow: 'hidden', // borderRadius'ın çalışması için
  },
});

export default LoginScreen; 