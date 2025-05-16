import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
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
        <Text style={styles.welcomeTitle}>Avalanche Cüzdanı</Text>
        <Text style={styles.welcomeSubtitle}>Merkeziyetsiz Finansa Hoş Geldiniz</Text>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('ImportWallet')} 
          >
            <Text style={styles.buttonText}>Cüzdana Giriş Yap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => navigation.navigate('CreateWallet')} 
          >
            <Text style={styles.buttonText}>Yeni Cüzdan Oluştur</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Koyu tema arka planı
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeTitle: {
    fontSize: 36, // Daha büyük
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#AEAEB2', // Daha açık gri
    textAlign: 'center',
    marginBottom: 60, // Butonlarla arasına daha fazla boşluk
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center', // Butonları kendi içinde ortala
  },
  button: {
    width: '90%',
    paddingVertical: 18, // Daha dolgun butonlar
    borderRadius: 12, // Daha yuvarlak kenarlar
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#007AFF', // Ana buton rengi (Mavi)
  },
  secondaryButton: {
    backgroundColor: '#34C759', // İkincil buton rengi (Yeşil)
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen; 