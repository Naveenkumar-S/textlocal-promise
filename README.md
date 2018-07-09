# textlocal-promise

Node.js wrapper for Textlocal API

## Installation

`$ npm install --save textlocal-promise`

## Usage

```js
import Textlocal from 'textlocal-promise';

// api-key
const textlocal = new Textlocal({ apikey: 'my-api-key' });

// username & hash
const textlocal = new Textlocal({ username: 'my-user', hash: 'my-hash' });

// username & password
const textlocal = new Textlocal({ username: 'my-user', password: 'my-pass' });


// Set the response format (json or xml)
textlocal.setFormat('json');

// Set the SMS message sender
textlocal.setSender('MrMaximus');


// Send an SMS
const message = 'This is a test';
const numbers = [441234567890, 441234567891];
const optionalParams = { custom: 'custom field' };
textlocal.sendSMS(message, numbers, optionalParams)
  .then(data => processSuccess(data)) // status === 'success'
  .catch(error => processFail(error)); // status === 'failure'


// Method chaining
const textlocal = new Textlocal({ apikey: 'my-api-key' });
textlocal.setFormat('xml').setSender('MrMaximus').sendSMS(message, numbers, optionalParams);
```

## Contributing
Pull requests are welcome. Open an issue to discuss the change and branch from master.

## License
MIT

## TODO
- Add tests