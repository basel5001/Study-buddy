// Run this script ONCE to get your encrypted API URL
// Usage: node encryptApiUrl.js
const CryptoJS = require('crypto-js');

const apiUrl = 'https://7pz7euzg1d.execute-api.us-west-2.amazonaws.com/Dev'; // Your API URL
const key = 'mySecretKey123'; // Change this to your secret key

const encrypted = CryptoJS.AES.encrypt(apiUrl, key).toString();
console.log('Encrypted API URL:', encrypted);
