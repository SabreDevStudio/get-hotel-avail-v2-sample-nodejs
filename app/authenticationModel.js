const axios = require('axios');
const queryString = require('querystring');

class AuthenticationModel {
  constructor(endPointConfig) {
    this.userSecret = endPointConfig.userSecret;
    this.apiEndPoint = endPointConfig.apiEndPoint;
    this.token = '';
  }

  get token() {
    return this.authenticationToken;
  }

  set token(newToken) {
    this.authenticationToken = newToken;
  }

  async createToken() {
    try {
      const postData = {
        grant_type: 'client_credentials',
      };

      const response = await axios({
        method: 'post',
        url: `${this.apiEndPoint}/v2/auth/token`,
        data: queryString.stringify(postData),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          authorization: `Basic ${this.userSecret}`,
        },
      });

      if (response.status === 200) {
        this.token = response.data.access_token;
      }
    } catch (error) {
      console.log('\nUnexpected error calling authentication.');
      console.log(`[${error.response.status}] ... [${error.response.statusText}]`);
      console.log(`[${error.response.data.error}] ... [${error.response.data.error_description}]`);
    }
  }
}

module.exports = AuthenticationModel;
