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