import { ethers } from 'ethers';

/**
 * Rastgele 12 kelimelik bir mnemonic oluşturur.
 * @returns {string} Oluşturulan mnemonic.
 */
export const generateMnemonic = (): string => {
  const wallet = ethers.Wallet.createRandom();
  // ethers.Wallet.createRandom() her zaman bir mnemonic ile wallet oluşturur.
  // Bu yüzden wallet.mnemonic null olmamalıdır.
  // Typescript'in emin olması için non-null assertion (!) kullanıyoruz.
  return wallet.mnemonic!.phrase;
};

/**
 * Verilen bir mnemonic'ten cüzdan bilgilerini (adres, özel anahtar) türetir.
 * @param {string} mnemonic Türetilecek mnemonic.
 * @returns {{ address: string; privateKey: string; mnemonic: string }} Cüzdan bilgileri.
 */
export const deriveWalletFromMnemonic = (mnemonic: string): { address: string; privateKey: string; mnemonic: string } => {
  try {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic, // Geri döndürülen objede mnemonic'i de verelim
    };
  } catch (error) {
    console.error("Mnemonic'ten cüzdan türetilirken hata oluştu:", error);
    throw new Error('Geçersiz mnemonic veya türetme hatası.');
  }
};

/**
 * Verilen bir özel anahtardan cüzdan bilgilerini (adres) türetir.
 * @param {string} privateKey Türetilecek özel anahtar.
 * @returns {{ address: string; privateKey: string }} Cüzdan bilgileri.
 */
export const deriveWalletFromPrivateKey = (privateKey: string): { address: string; privateKey: string } => {
  try {
    // Özel anahtarın geçerli olup olmadığını kontrol etmek için başına "0x" ekleyebiliriz (ethers.js bazen bunu bekler)
    const pk = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    const wallet = new ethers.Wallet(pk);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey, // Orijinal privateKey'i değil, ethers Wallet objesinden geleni döndürelim
    };
  } catch (error) {
    console.error("Özel anahtardan cüzdan türetilirken hata oluştu:", error);
    throw new Error('Geçersiz özel anahtar veya türetme hatası.');
  }
};

// İleride Avalanche C-Chain ile etkileşim için provider ve diğer fonksiyonlar eklenebilir.
// Örneğin:
// const CCHAIN_RPC_URL = 'https://api.avax.network/ext/bc/C/rpc';
// export const provider = new ethers.JsonRpcProvider(CCHAIN_RPC_URL); 