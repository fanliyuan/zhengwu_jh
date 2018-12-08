import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('o7H8uIM2O5qv65l2');
const Encrypt = word => {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};
const Decrypt = word => {
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};
const Crypto = {
  Encrypt,
  Decrypt,
};

export default Crypto;
