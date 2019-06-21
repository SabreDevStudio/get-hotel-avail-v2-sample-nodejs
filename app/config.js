const APIConfig = {
  apiEndPoint: 'https://api-crt.cert.havail.sabre.com',
  userSecret: process.env.SWS_API_SECRET || '',
  appId: process.env.SWS_APP_ID || '',
};

module.exports = APIConfig;
