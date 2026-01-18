// Utility to decrypt the API URL
import CryptoJS from 'crypto-js';

export function decryptApiUrl(encrypted, key) {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
