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
const accessToken = await walmartMarketplace.authentication.getAccessToken();
console.log(accessToken);
```

**Callback Example**
```javascript
walmartMarketplace.authentication.getAccessToken(function(err, accessToken) {
    console.log(accessToken);
});
```

**Options**
```
{
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```

**Returns**
```
{
    "access_token": "eyJraWQiOiI1MWY3MjM0Ny0wYWY5LTRhZ.....",
    "token_type": "Bearer",
    "expires_in": 900
}
```

## walmartMarketplace.items.retireAnItem(sku, [options])

Completely deactivates and un-publishes an item from the site.

https://developer.walmart.com/api/us/mp/items#operation/retireAnItem

**Promise Example**
```javascript
const response = await walmartMarketplace.items.retireAnItem('97964_KFTest');
console.log(response);
```

**Callback Example**
```javascript
walmartMarketplace.items.retireAnItem('97964_KFTest', function(err, response) {
    console.log(response);
});
```

**Options**
```
{
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```

**Returns**
```
{
    "sku": "97964_KFTest",
    "message": "Thank you.  Your item has been submitted for retirement from Walmart Catalog.  Please note that it can take up to 48 hours for items to be retired from our catalog.",
    "additionalAttributes": null,
    "errors": null
}
```