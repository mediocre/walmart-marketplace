# walmart-marketplace

[![Build Status](https://github.com/mediocre/walmart-marketplace/actions/workflows/continuousIntegration.yaml/badge.svg?branch=main)](https://github.com/mediocre/walmart-marketplace/actions/workflows/continuousIntegration.yaml)
[![Coverage Status](https://coveralls.io/repos/github/mediocre/walmart-marketplace/badge.svg?branch=main)](https://coveralls.io/github/mediocre/walmart-marketplace?branch=main)


The Walmart Marketplace APIs provide resources for sellers to manage their items, orders, prices, promotions, inventory and reports on Walmart.com.

https://developer.walmart.com/home/us-mp/

## Usage

```javascript
const WalmartMarketplace = require('walmart-marketplace');

const walmartMarketplace = new WalmartMarketplace({
    clientId: 'your_api_key',
    clientSecret: 'your_api_secret',
    url: 'https://marketplace.walmartapis.com'
});
```

## walmartMarketplace.authentication.getAccessToken([options])

Get access token by providing Client ID and Client Secret.

https://developer.walmart.com/api/us/mp/auth

**Promise Example**
```javascript
walmartMarketplace.authentication.getAccessToken(function(err, accessToken) {
    console.log(accessToken);
});
```

**Callback Example**
```javascript
const accessToken = await walmartMarketplace.authentication.getAccessToken();
console.log(accessToken);
```

**Options**
```
{
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```