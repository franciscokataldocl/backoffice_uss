import CryptoJS from 'crypto-js';

const SecretKey = process.env.REACT_APP_SecretKey
// Función para cifrar datos
export const EncryptData = (data) => {
  try {
    const dataWordArray = CryptoJS.enc.Utf8.parse(data);

    // Configuración de opciones para el cifrado
    const options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    };

    // Encriptar los datos
    const encryptedData = CryptoJS.AES.encrypt(dataWordArray, SecretKey, options).toString();

    return encryptedData;
  } catch (error) {
      console.log('Error al encriptar los datos:', error);
    throw error;
  }
}

// Función para descifrar datos
export const DecryptData = (encryptedData) => {
  try {
    // Configuración de opciones para el descifrado (deben coincidir con las opciones de encriptación)
    const options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    };

    // Descifrar los datos
    const bytes = CryptoJS.AES.decrypt(encryptedData, SecretKey, options);
    
    // Convertir el objeto WordArray a una cadena Utf8
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData;
  } catch (error) {
    console.log('Error al descifrar los datos:', error);
    throw error; // Puedes manejar el error de otra manera según tus necesidades
  }
}
