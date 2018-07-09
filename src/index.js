import request from 'request-promise';

export default class Textlocal {
  constructor(credentials) {
    this.setAuth(credentials);
    this.apiUrl = 'https://api.txtlocal.com';
  }

  /**
   * Set class property to the credentials for authentication with the Textlocal service.
   *
   * @param {Object} credentials
   * Can be set to an `apikey`, a `username` and `password`, or a `username` and `hash`.
   *
   * @return {Textlocal}
   * The object instance.
   */
  setAuth(credentials) {
    const invalidCredsError = new Error('Invalid Textlocal authentication credentials specified.');

    if (!credentials || !Object.keys(credentials).length) {
      throw invalidCredsError;
    } else if (credentials.apikey) {
      this.auth = { apikey: credentials.apikey };
    } else if (credentials.username && credentials.hash) {
      this.auth = { username: credentials.username, hash: credentials.hash };
    } else if (credentials.username && credentials.password) {
      this.auth = { username: credentials.username, password: credentials.password };
    } else {
      throw invalidCredsError;
    }

    return this;
  }

  /**
   * Sets class property to the Textlocal response data format.
   *
   * @param {string} format
   * The chosen format (`json` or `xml`).
   *
   * @return {Textlocal}
   * The object instance.
   */
  setFormat(format) {
    const dataFormat = String(format).toLowerCase();
    if (!['json', 'xml'].includes(dataFormat)) {
      throw new Error('Invalid format specified.');
    }

    this.format = dataFormat;
    return this;
  }

  /**
   * Sets class property with a sender name. Setting the sender name using this
   * method will send all messages from this instance with this sender name
   * unless overridden in an action method.
   *
   * @param {string} sender
   * The sender name.
   *
   * @return {Textlocal}
   * The object instance.
   */
  setSender(sender) {
    this.sender = sender;
    return this;
  }

  /**
   * Send SMS messages to one or more numbers.
   *
   * @param {string} message
   * The body of the sms message.
   *
   * @param {number[]} numbers
   * An array of recipient numbers.
   *
   * @param {Object} optionalParams
   * Any optional parameters (see https://api.txtlocal.com/docs/sendsms).
   *
   * @return {Promise<Object>}
   * Resolves the response object if the request was processed successfully, rejects
   * with the fail response if there was an error processing the request,
   */
  sendSMS(message, numbers, optionalParams = {}) {
    const requestData = {
      ...this.auth,
      message: encodeURIComponent(message),
      numbers: (numbers || []).join(','),
      ...optionalParams,
    };

    /**
     * Only set the sender if there is one in the class property `sender`,
     * but allow it to be overridden with optionalParams
     */
    if (this.sender && !requestData.sender) {
      requestData.sender = encodeURIComponent(this.sender);
    }

    const requestOptions = {
      method: 'POST',
      uri: `${this.apiUrl}/send`,
      json: true,
      form: requestData,
    };

    return Textlocal.makeRequest(requestOptions);
  }

  /**
   * Makes a http request with the options specified and checks if the response is
   * a success or failure.
   *
   * @param {Object} options
   * Data required for a http request.
   *
   * @return {Promise<Object>}
   * Resolves if the response if a success, rejects witht the response if it is a failure.
   */
  static makeRequest(options) {
    return request(options)
      .then((response) => {
        if (Textlocal.isFailResponse(response)) {
          throw response;
        }

        return response;
      });
  }

  /**
   * Checks is a response from the Textlocal service is a success or failure.
   *
   * @param {Object} response
   * Textlocal response object.
   *
   * @return {boolean}
   * True if the response is a fail, false if it is a success.
   */
  static isFailResponse(response) {
    return (response.status !== 'success');
  }
}