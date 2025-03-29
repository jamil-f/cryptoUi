const axios = require('axios');
const generateJwt = require('../utils/jwAuth');
const { v4: uuidv4 } = require('uuid');

const API_KEY = (process.env.COINBASE_ADV_API_KEY || '').replace(/^"|"$/g, '');
let privateKeyPem = (process.env.COINBASE_ADV_API_SECRET || '').replace(/^"|"$/g, '');
privateKeyPem = privateKeyPem.replace(/\\n/g, '\n');



const BASE_ADV_URL = 'https://api.coinbase.com';

// Define the components needed to build the URI claim
const requestMethod = "GET";
const hostname = "api.coinbase.com"; 
const requestPath = "/api/v3/brokerage/accounts";
const uri = `${requestMethod} ${hostname}${requestPath}`;

async function getAccounts(req, res) {
  try {
    
    const nonce = uuidv4();
    
    const token = generateJwt(privateKeyPem, uri, nonce);
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      // Optionally include the nonce as an HTTP header if needed:
      'x-auth-nonce': nonce,
    };

    const response = await axios.get(`${BASE_ADV_URL}${requestPath}`, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Failed to get accounts:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAccounts };