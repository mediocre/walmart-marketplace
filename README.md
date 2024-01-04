# walmart-marketplace

[![Build Status](https://github.com/mediocre/walmart-marketplace/actions/workflows/continuousIntegration.yaml/badge.svg?branch=main)](https://github.com/mediocre/walmart-marketplace/actions/workflows/continuousIntegration.yaml)
[![Coverage Status](https://coveralls.io/repos/github/mediocre/walmart-marketplace/badge.svg?branch=main)](https://coveralls.io/github/mediocre/walmart-marketplace?branch=main)


The Walmart Marketplace APIs provide resources for sellers to manage their items, orders, prices, promotions, inventory and reports on Walmart.com.

https://developer.walmart.com/home/us-mp/

## Usage

```javascript
const WalmartMarketplace = require('@mediocre/walmart-marketplace');

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

## walmartMarketplace.items.bulkItemSetup(feedType, file, [options])

Use this API for initial item setup and maintenance.

https://developer.walmart.com/api/us/mp/items#operation/itemBulkUploads

**Promise Example**
```javascript
const mpItemMatch = {
    MPItemFeedHeader: {
        locale: 'en',
        sellingChannel: 'mpsetupbymatch',
        version: '4.2'
    },
    MPItem: [{
        Item: {
            condition: 'New',
            price: 123,
            productIdentifiers: {
                productId: '123456789012',
                productIdType: 'UPC'
            },
            ShippingWeight: 1,
            sku: '123abc'
        }
    }]
};

const response = await walmartMarketplace.items.bulkItemSetup('MP_ITEM_MATCH', mpItemMatch);
console.log(response);
```

**Callback Example**
```javascript
const mpItemMatch = {
    MPItemFeedHeader: {
        locale: 'en',
        sellingChannel: 'mpsetupbymatch',
        version: '4.2'
    },
    MPItem: [{
        Item: {
            condition: 'New',
            price: 123,
            productIdentifiers: {
                productId: '123456789012',
                productIdType: 'UPC'
            },
            ShippingWeight: 1,
            sku: '123abc'
        }
    }]
};

walmartMarketplace.items.bulkItemSetup('MP_ITEM_MATCH', mpItemMatch, function(err, response) {
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
    "feedId": "F129C19240844B97A3C6AD8F1A2C4997@AU8BAQA"
}
```

## walmartMarketplace.items.getAnItem(id, [options])

Retrieves an item and displays the item details.

https://developer.walmart.com/api/us/mp/items#operation/getAnItem

**Promise Example**
```javascript
const itemDetails = await walmartMarketplace.items.getAnItem('97964_KFTest');
console.log(itemDetails);
```

**Callback Example**
```javascript
walmartMarketplace.items.getAnItem('97964_KFTest', function(err, itemDetails) {
    console.log(itemDetails);
});
```

**Options**
```
{
    condition: 'New', // The value of product condition, (e.g. Restored). Enum: "New" "New without box" "New without tags" "Restored Premium" "Restored" "Remanufactured" "Open Box" "Pre-Owned: Like New" "Pre-Owned: Good" "Pre-Owned: Fair" "New with defects"
    productIdType: 'SKU', // Item code type specifier allows to filter by specific code type, (e.g. GTIN). Enum: "GTIN" "UPC" "ISBN" "EAN" "SKU" "ITEM_ID"
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```

**Returns**
```
{
    "ItemResponse": [
        {
            "mart": "WALMART_US",
            "sku": "30348_KFTest",
            "condition": "New",
            "wpid": "0RCPILAXM0C1",
            "upc": "",
            "gtin": "06932096330348",
            "productName": "Kidsform Adjustable Infant Baby Carrier Sling Wrap Rider Carrier Backpack Front/Back Pack Khaki, Blue, Pink 4 Carrying Position Modes With Storage Bag",
            "shelf": "[\"Home Page\",\"Baby\",\"Baby Activities & Gear\",\"Baby Carriers\"]",
            "productType": "Baby Carriers",
            "price": {
                "currency": "USD",
                "amount": 3
            },
            "publishedStatus": "PUBLISHED",
            "lifecycleStatus": "ACTIVE"
        }
    ],
    "totalItems": 1
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