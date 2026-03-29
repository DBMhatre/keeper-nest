import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '@env';

import 'react-native-get-random-values';

const encryption_key = ENCRYPTION_KEY || 'K3ep3rN3st!2024@Secure#App$Key%32Char';

if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }
  };
}

CryptoJS.lib.WordArray.random = function(nBytes) {
  const words = [];
  
  for (let i = 0; i < nBytes; i += 4) {
    const word = (
      (Math.random() * 0x100000000) |
      (Math.random() * 0x10000) |
      (Math.random() * 0x100)
    );
    words.push(word & 0xff);
  }
  
  return CryptoJS.lib.WordArray.create(words, nBytes);
};

export const encrypt = (text) => {
  try {
    console.log("Encrypting text...");
    
    const encrypted = CryptoJS.AES.encrypt(
      text, 
      encryption_key,
      {
        mode: CryptoJS.mode.ECB, 
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    const result = encrypted.toString();
    console.log("Encryption successful");
    return result;
    
  } catch (error) {
    console.error("Encryption error details:", error);
    return null;
  }
};

export const decrypt = (encryptedText) => {
  try {
    console.log("Decrypting text...");
    
    const decrypted = CryptoJS.AES.decrypt(
      encryptedText,
      encryption_key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!result) {
      throw new Error('Empty decryption result');
    }
    
    console.log("Decryption successful");
    return result;
    
  } catch (error) {
    console.error("Decryption error details:", error);
    return null;
  }
};
