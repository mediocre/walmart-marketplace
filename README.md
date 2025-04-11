# walmart-marketplace

[![Build Status](https://github.com/mediocre/walmart-marketplace/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/mediocre/walmart-marketplace/actions/workflows/test.yml)
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

## walmartMarketplace.inventory.getInventory(sku, [options])

You can use this API to get the inventory for a given item.

https://developer.walmart.com/api/us/mp/inventory

**Promise Example**
```javascript
const inventory = await walmartMarketplace.inventory.getInventory('97964_KFTest');
console.log(inventory);
```

**Callback Example**
```javascript
walmartMarketplace.inventory.getInventory('97964_KFTest', function(err, inventory) {
    console.log(inventory);
});
```

**Options**
```
{
    shipNode: '721407', // The shipNode for which the inventory is requested
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```

**Returns**
```
{
    "sku": "97964_KFTest",
    "quantity": {
        "unit": "EACH",
        "amount": 10
    }
}
```

## walmartMarketplace.inventory.updateInventory(inventory, [options])

Updates the inventory for a given item.

https://developer.walmart.com/api/us/mp/inventory#operation/updateInventoryForAnItem

**Promise Example**
```javascript
const inventory = {
    quantity: {
        amount: 10,
        unit: 'EACH'
    },
    sku: '97964_KFTest'
};

const response = await walmartMarketplace.inventory.updateInventory(inventory);
console.log(response);
```

**Callback Example**
```javascript
const inventory = {
    quantity: {
        amount: 10,
        unit: 'EACH'
    },
    sku: '97964_KFTest'
};

walmartMarketplace.inventory.updateInventory(inventory, function(err, response) {
    console.log(response);
});
```

**Options**
```
{
    shipNode: '721407', // The shipNode for which the inventory is to be updated.
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```

**Returns**
```
{
    "sku": "97964_KFTest",
    "quantity": {
        "unit": "EACH",
        "amount": 10
    }
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

## walmartMarketplace.items.itemSearch(options)

The Item Search API allows you to query the Walmart.com global product catalog by item keyword, UPC or GTIN.

https://developer.walmart.com/api/us/mp/items#operation/getSearchResult

**Promise Example**
```javascript
const searchResults = await walmartMarketplace.items.itemSearch({ upc: '086279171801' });
console.log(searchResults);
```

**Callback Example**
```javascript
walmartMarketplace.items.itemSearch({ upc: '086279171801' }, function(err, searchResults) {
    console.log(searchResults);
});
```

**Options**
```
{
    gtin: '911138034047', // Specifies a Global Trade Item Number (GTIN) search. GTIN must be 14 digits.
    query: 'ipad', // Specifies a keyword search as a String.
    upc: '086279171801', // Specifies a Universal Product Code (UPC) search. UPC must be 12 digits.
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```

**Returns**
```
{
  "items": [
    {
      "itemId": "393016031",
      "condition": "New",
      "isMarketPlaceItem": true,
      "images": [
        {
          "url": "http://i5.walmartimages.com/asr/556cc5a5-e729-4e48-b801-0146bbc97cdb_1.97507cfd7df5ca0fb6570e6a36495016.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff"
        },
        {
          "url": "http://i5.walmartimages.com/asr/556cc5a5-e729-4e48-b801-0146bbc97cdb_1.97507cfd7df5ca0fb6570e6a36495016.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff"
        }
      ],
      "customerRating": "3.799999952316284",
      "price": {
        "amount": "12.989999771118164",
        "currency": "USD"
      },
      "description": "<li>Designed for Apple <mark>iPad</mark> <mark>mini</mark> 1/2/3</li><li>Hybrid Silicone/PC Protective Shell with Kickstand</li><li>Shock-Absorption <mark><mark>Case</mark>s</mark> Protection <mark>Case</mark> for boys girls</li>",
      "title": "<mark>iPad</mark> <mark>mini</mark> 3/ 2 /1 <mark>Case</mark>,  ULAK Three Layer Hybrid Heavy Duty Shockproof Protective <mark>Case</mark> with Kickstand for Apple <mark>iPad</mark> <mark>Mini</mark>,<mark>iPad</mark> <mark>Mini</mark> 2,<mark>iPad</mark> <mark>Mini</mark> 3",
      "brand": "ULAK",
      "productType": "VARIANT",
      "properties": {
        "variant_items_num": "5",
        "num_reviews": "16",
        "categories": [
          "Electronics",
          "iPad & Tablets",
          "Apple iPad Accessories",
          "iPad Cases, Sleeves & Bags"
        ],
        "variants": {
          "variantMeta": [
            {
              "name": "actual_color"
            }
          ],
          "variantData": [
            {
              "productImageUrl": "https://i5.walmartimages.com/asr/82b8c484-651b-4e50-979c-42164649b8c5_1.bcf0b3a35d5767ee402c06b26a25f191.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff",
              "itemId": "936491618",
              "isAvailable": "Y",
              "title": "iPad mini 3/ 2 /1 Case,  ULAK Three Layer Hybrid Heavy Duty Shockproof Protective Case with Kickstand for Apple iPad Mini,iPad Mini 2,iPad Mini 3",
              "variantValues": [
                {
                  "name": "actual_color",
                  "value": "Black/Black"
                }
              ]
            },
            {
              "productImageUrl": "https://i5.walmartimages.com/asr/e3d7c2bd-55d2-41ab-97b8-59c441918307_1.5f96dab5b8eddf4eb4857103a8c54913.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff",
              "itemId": "865777580",
              "isAvailable": "N",
              "title": "iPad mini 3 Case, iPad mini 2 Case, iPad mini Case, ULAK Three Layer Hybrid Heavy Duty Shockproof Protective Case with Kickstand for Apple iPad Mini,iPad Mini 2,iPad Mini 3",
              "variantValues": [
                {
                  "name": "actual_color",
                  "value": "Black/Blue"
                }
              ]
            },
            {
              "productImageUrl": "https://i5.walmartimages.com/asr/556cc5a5-e729-4e48-b801-0146bbc97cdb_1.97507cfd7df5ca0fb6570e6a36495016.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff",
              "itemId": "393016031",
              "isAvailable": "N",
              "title": "iPad mini 3/ 2 /1 Case,  ULAK Three Layer Hybrid Heavy Duty Shockproof Protective Case with Kickstand for Apple iPad Mini,iPad Mini 2,iPad Mini 3",
              "variantValues": [
                {
                  "name": "actual_color",
                  "value": "Blue+Lime Green"
                }
              ]
            },
            {
              "productImageUrl": "https://i5.walmartimages.com/asr/5920a66b-a944-47c5-8ada-d1621d379ca9_1.4a20b40c528c6f8553f66043f38841e7.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff",
              "itemId": "451755050",
              "isAvailable": "Y",
              "title": "iPad mini 3/ 2 /1 Case,  ULAK Three Layer Hybrid Heavy Duty Shockproof Protective Case with Kickstand for Apple iPad Mini,iPad Mini 2,iPad Mini 3",
              "variantValues": [
                {
                  "name": "actual_color",
                  "value": "Mint Green/Grey"
                }
              ]
            },
            {
              "productImageUrl": "https://i5.walmartimages.com/asr/ba395bef-48bf-46ac-8322-962e381c4e81_1.ea83239b1d41dc6e49521c2d1026f9f5.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff",
              "itemId": "800154739",
              "isAvailable": "Y",
              "title": "iPad Mini Case,iPad Mini 2 Case,iPad Mini 3 Case,iPad mini Retina Case,ULAK Three Layer Heavy Duty Shockproof Protective Case Cover Kickstand, Pink",
              "variantValues": [
                {
                  "name": "actual_color",
                  "value": "Rose Gold/Rose Gold"
                }
              ]
            }
          ]
        },
        "next_day_eligible": false
      }
    }
  ]
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

## walmartMarketplace.orders.acknowledgeOrder(purchaseOrderId, [options])

You can use this API to acknowledge an entire order, including all of its order lines. The response to a successful call contains the acknowledged order.

https://developer.walmart.com/api/us/mp/orders#operation/acknowledgeOrders

**Promise Example**
```javascript
const response = await walmartMarketplace.orders.acknowledgeOrder('1796277083022');
console.log(response);

```

**Callback Example**
```javascript
walmartMarketplace.orders.acknowledgeOrder('1796277083022', function(err, response) {
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
  "order": {
    "purchaseOrderId": "1796277083022",
    "customerOrderId": "5281956426648",
    "customerEmailId": "3A31739D8B0A45A1B23F7F8C81C8747F@relay.walmart.com",
    "orderDate": 1568466571000,
    "shippingInfo": {
      "phone": "3155598681",
      "estimatedDeliveryDate": 1569438000000,
      "estimatedShipDate": 1568700000000,
      "methodCode": "Value",
      "postalAddress": {
        "name": "Kathryn Cole",
        "address1": "3258BWarners rd",
        "address2": "Garage",
        "city": "Warners",
        "state": "NY",
        "postalCode": "13164",
        "country": "USA",
        "addressType": "RESIDENTIAL"
      }
    },
    "orderLines": {
      "orderLine": [
        {
          "lineNumber": "4",
          "item": {
            "productName": "Beba Bean Pee-pee Teepee Airplane - Blue - Laundry Bag",
            "sku": "test1"
          },
          "charges": {
            "charge": [
              {
                "chargeType": "PRODUCT",
                "chargeName": "ItemPrice",
                "chargeAmount": {
                  "currency": "USD",
                  "amount": 10
                },
                "tax": {
                  "taxName": "Tax1",
                  "taxAmount": {
                    "currency": "USD",
                    "amount": 0.8
                  }
                }
              }
            ]
          },
          "orderLineQuantity": {
            "unitOfMeasurement": "EACH",
            "amount": "1"
          },
          "statusDate": 1568753156000,
          "orderLineStatuses": {
            "orderLineStatus": [
              {
                "status": "Acknowledged",
                "statusQuantity": {
                  "unitOfMeasurement": "EACH",
                  "amount": "1"
                }
              }
            ]
          },
          "fulfillment": {
            "fulfillmentOption": "S2H",
            "shipMethod": "VALUE",
            "pickUpDateTime": 1568919600000
          }
        }
      ]
    }
  }
}
```

## walmartMarketplace.orders.getAllOrders([options])

Retrieves the details of all the orders for specified search criteria.

https://developer.walmart.com/api/us/mp/orders#operation/getAllOrders

**Promise Example**
```javascript
const options = {
    sku: '97964_KFTest'
};

const orders = await walmartMarketplace.orders.getAllOrders(options);
console.log(orders);
```

**Callback Example**
```javascript
const options = {
    sku: '97964_KFTest'
};

walmartMarketplace.orders.getAllOrders(options, function(err, orders) {
    console.log(orders);
});
```

**Options**
```
{
    autoPagination: false, // If true, automatically fetches all pages of results. Defaults to false.
    createdEndDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that were created before this date. Default is current date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    createdStartDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that were created after this date. Default is current date - 7 days. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    customerOrderId: '5281956426648', // The customer order ID.
    fromExpectedShipDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that have order lines with an expected ship date after this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    lastModifiedEndDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that were modified before this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    lastModifiedStartDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that were modified after this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    limit: '100', // The number of orders to be returned. Cannot be larger than 200. Default: "100".
    orderType: 'REGULAR', // Specifies if the order is a regular order or replacement order. Possible values are REGULAR or REPLACEMENT. Provided in response only if query parameter replacementInfo=true.
    productInfo: 'false', // Provides the image URL and product weight in response, if available. Allowed values are true or false. Default: "false".
    purchaseOrderId: '1796277083022', // The purchase order ID. One customer may have multiple purchase orders.
    replacementInfo: 'false', // Provides additional attributes - originalCustomerOrderID, orderType - related to Replacement order, in response, if available. Allowed values are true or false. Default: "false".
    shipNodeType: 'SellerFulfilled', // Specifies the type of shipNode. Allowed values are SellerFulfilled(Default), WFSFulfilled and 3PLFulfilled. Default: "SellerFulfilled".
    shippingProgramType: 'TWO_DAY', // Specifies the type of program. Allowed value is TWO_DAY, ONE_DAY.
    sku: '97964_KFTest', // A seller-provided Product ID.
    status: 'Created', // Status of purchase order line. Valid statuses are: Created, Acknowledged, Shipped, Delivered and Cancelled.
    toExpectedShipDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that have order lines with an expected ship date before this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```

**Returns**
```
[
  {
    "purchaseOrderId": "1796277083022",
    "customerOrderId": "5281956426648",
    "customerEmailId": "3A31739D8B0A45A1B23F7F8C81C8747F@relay.walmart.com",
    "orderType": "REPLACEMENT",
    "originalCustomerOrderID": "1234567891234",
    "orderDate": 1568466571000,
    "shippingInfo": {
      "phone": "3155598681",
      "estimatedDeliveryDate": 1569438000000,
      "estimatedShipDate": 1568700000000,
      "methodCode": "Value",
      "postalAddress": {
        "name": "Kathryn Cole",
        "address1": "3258BWarners rd",
        "address2": "Garage",
        "city": "Warners",
        "state": "NY",
        "postalCode": "13164",
        "country": "USA",
        "addressType": "RESIDENTIAL"
      }
    },
    "orderLines": {
      "orderLine": [
        {
          "lineNumber": "4",
          "item": {
            "productName": "Beba Bean Pee-pee Teepee Airplane - Blue - Laundry Bag",
            "sku": "test1"
          },
          "charges": {
            "charge": [
              {
                "chargeType": "PRODUCT",
                "chargeName": "ItemPrice",
                "chargeAmount": {
                  "currency": "USD",
                  "amount": 10
                },
                "tax": {
                  "taxName": "Tax1",
                  "taxAmount": {
                    "currency": "USD",
                    "amount": 0.8
                  }
                }
              }
            ]
          },
          "orderLineQuantity": {
            "unitOfMeasurement": "EACH",
            "amount": "1"
          },
          "statusDate": 1568466647000,
          "orderLineStatuses": {
            "orderLineStatus": [
              {
                "status": "Created",
                "statusQuantity": {
                  "unitOfMeasurement": "EACH",
                  "amount": "1"
                }
              }
            ]
          },
          "fulfillment": {
            "fulfillmentOption": "S2H",
            "shipMethod": "VALUE",
            "pickUpDateTime": 1568919600000
          }
        }
      ]
    }
  }
]
```

## walmartMarketplace.orders.getAllReleaseOrders([options])

Retrieves all the orders with line items that are in the "created" status, that is, these orders have been released from the Walmart Order Management System to the seller for processing. The released orders are the orders that are ready for a seller to fulfill.

https://developer.walmart.com/api/us/mp/orders#operation/getAllReleasedOrders

**Promise Example**
```javascript
const options = {
    sku: '97964_KFTest'
};

const orders = await walmartMarketplace.orders.getAllReleaseOrders(options);
console.log(orders);
```

**Callback Example**
```javascript
const options = {
    sku: '97964_KFTest'
};

walmartMarketplace.orders.getAllReleaseOrders(options, function(err, orders) {
    console.log(orders);
});
```

**Options**
```
{
    autoPagination: false, // If true, automatically fetches all pages of results. Defaults to false.
    createdEndDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that were created before this date. Default is current date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    createdStartDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that were created after this date. Default is current date - 7 days. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    customerOrderId: '5281956426648', // The customer order ID.
    fromExpectedShipDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that have order lines with an expected ship date after this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    limit: '100', // The number of orders to be returned. Cannot be larger than 200. Default: "100".
    orderType: 'REGULAR', // Specifies if the order is a regular order or replacement order. Possible values are REGULAR or REPLACEMENT. Provided in response only if query parameter replacementInfo=true.
    productInfo: 'false', // Provides the image URL and product weight in response, if available. Allowed values are true or false. Default: "false".
    purchaseOrderId: '1796277083022', // The purchase order ID. One customer may have multiple purchase orders.
    replacementInfo: 'false', // Provides additional attributes - originalCustomerOrderID, orderType - related to Replacement order, in response, if available. Allowed values are true or false. Default: "false".
    shipNodeType: 'SellerFulfilled', // Specifies the type of shipNode. Allowed values are SellerFulfilled(Default), WFSFulfilled and 3PLFulfilled. Default: "SellerFulfilled".
    shippingProgramType: 'TWO_DAY', // Specifies the type of program. Allowed value is TWO_DAY, ONE_DAY.
    sku: '97964_KFTest', // A seller-provided Product ID.
    toExpectedShipDate: '2020-03-16T10:30:15Z', // Fetches all purchase orders that have order lines with an expected ship date before this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
    'WM_QOS.CORRELATION_ID': '00000000-0000-0000-0000-000000000000' // A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
}
```

**Returns**
```
[
  {
    "purchaseOrderId": "1796277083022",
    "customerOrderId": "5281956426648",
    "customerEmailId": "3A31739D8B0A45A1B23F7F8C81C8747F@relay.walmart.com",
    "orderType": "REPLACEMENT",
    "originalCustomerOrderID": "1234567891234",
    "orderDate": 1568466571000,
    "shippingInfo": {
      "phone": "3155598681",
      "estimatedDeliveryDate": 1569438000000,
      "estimatedShipDate": 1568700000000,
      "methodCode": "Value",
      "postalAddress": {
        "name": "Kathryn Cole",
        "address1": "3258BWarners rd",
        "address2": "Garage",
        "city": "Warners",
        "state": "NY",
        "postalCode": "13164",
        "country": "USA",
        "addressType": "RESIDENTIAL"
      }
    },
    "orderLines": {
      "orderLine": [
        {
          "lineNumber": "4",
          "item": {
            "productName": "Beba Bean Pee-pee Teepee Airplane - Blue - Laundry Bag",
            "sku": "test1"
          },
          "charges": {
            "charge": [
              {
                "chargeType": "PRODUCT",
                "chargeName": "ItemPrice",
                "chargeAmount": {
                  "currency": "USD",
                  "amount": 10
                },
                "tax": {
                  "taxName": "Tax1",
                  "taxAmount": {
                    "currency": "USD",
                    "amount": 0.8
                  }
                }
              }
            ]
          },
          "orderLineQuantity": {
            "unitOfMeasurement": "EACH",
            "amount": "1"
          },
          "statusDate": 1568466647000,
          "orderLineStatuses": {
            "orderLineStatus": [
              {
                "status": "Created",
                "statusQuantity": {
                  "unitOfMeasurement": "EACH",
                  "amount": "1"
                }
              }
            ]
          },
          "fulfillment": {
            "fulfillmentOption": "S2H",
            "shipMethod": "VALUE",
            "pickUpDateTime": 1568919600000
          }
        }
      ]
    }
  }
]
```

## walmartMarketplace.orders.shipOrderLines(purchaseOrderId, orderShipment, [options])

Updates the status of order lines to Shipped and trigger the charge to the customer. The response to a successful call contains the order with the shipped line items.

https://developer.walmart.com/api/us/mp/orders#operation/shippingUpdates

**Promise Example**
```javascript
const orderShipment = {
    orderShipment: {
        orderLines: {
            orderLine: [
                {
                    intentToCancelOverride: false,
                    lineNumber: '1',
                    orderLineStatuses: {
                        orderLineStatus: [
                            {
                                status: 'Shipped',
                                statusQuantity: {
                                    amount: '1',
                                    unitOfMeasurement: 'EACH'
                                },
                                trackingInfo: {
                                    carrierName: {
                                        carrier: 'UPS'
                                    },
                                    methodCode: 'Standard',
                                    shipDateTime: 1580821866000,
                                    trackingNumber: '22344',
                                    trackingURL: 'http://walmart/tracking/ups?&type=MP&seller_id=12345&promise_date=03/02/2020&dzip=92840&tracking_numbers=92345'
                                },
                                returnCenterAddress: {
                                    address1: 'walmart store 2',
                                    city: 'Huntsville',
                                    country: 'USA',
                                    dayPhone: '12344',
                                    emailId: 'walmart@walmart.com',
                                    postalCode: '35805',
                                    name: 'walmart',
                                    state: 'AL',
                                }
                            }
                        ]
                    },
                    sellerOrderId: '92344'
                },
                {
                    lineNumber: '2',
                    orderLineStatuses: {
                        orderLineStatus: [
                            {
                                status: 'Shipped',
                                statusQuantity: {
                                    amount: '1',
                                    unitOfMeasurement: 'EACH'
                                },
                                trackingInfo: {
                                    carrierName: {
                                        carrier: 'FedEx'
                                    },
                                    methodCode: 'Express',
                                    shipDateTime: 1580821866000,
                                    trackingNumber: 22344,
                                    trackingURL: 'http://walmart/tracking/fedEx?&type=MP&seller_id=12345&promise_date=03/02/2020&dzip=92840&tracking_numbers=92344'
                                },
                                returnCenterAddress: {
                                    address1: 'walmart store 2',
                                    city: 'Huntsville',
                                    country: 'USA',
                                    dayPhone: '12344',
                                    emailId: 'walmart@walmart.com',
                                    postalCode: '35805',
                                    name: 'walmart',
                                    state: 'AL',
                                }
                            }
                        ]
                    },
                    sellerOrderId: '92344'
                }
            ]
        }
    }
};

const response = await walmartMarketplace.orders.shipOrderLines('1234567891234', orderShipment);
console.log(response);
```

**Callback Example**
```javascript
const orderShipment = {
    orderShipment: {
        orderLines: {
            orderLine: [
                {
                    intentToCancelOverride: false,
                    lineNumber: '1',
                    orderLineStatuses: {
                        orderLineStatus: [
                            {
                                status: 'Shipped',
                                statusQuantity: {
                                    amount: '1',
                                    unitOfMeasurement: 'EACH'
                                },
                                trackingInfo: {
                                    carrierName: {
                                        carrier: 'UPS'
                                    },
                                    methodCode: 'Standard',
                                    shipDateTime: 1580821866000,
                                    trackingNumber: '22344',
                                    trackingURL: 'http://walmart/tracking/ups?&type=MP&seller_id=12345&promise_date=03/02/2020&dzip=92840&tracking_numbers=92345'
                                },
                                returnCenterAddress: {
                                    address1: 'walmart store 2',
                                    city: 'Huntsville',
                                    country: 'USA',
                                    dayPhone: '12344',
                                    emailId: 'walmart@walmart.com',
                                    postalCode: '35805',
                                    name: 'walmart',
                                    state: 'AL',
                                }
                            }
                        ]
                    },
                    sellerOrderId: '92344'
                },
                {
                    lineNumber: '2',
                    orderLineStatuses: {
                        orderLineStatus: [
                            {
                                status: 'Shipped',
                                statusQuantity: {
                                    amount: '1',
                                    unitOfMeasurement: 'EACH'
                                },
                                trackingInfo: {
                                    carrierName: {
                                        carrier: 'FedEx'
                                    },
                                    methodCode: 'Express',
                                    shipDateTime: 1580821866000,
                                    trackingNumber: 22344,
                                    trackingURL: 'http://walmart/tracking/fedEx?&type=MP&seller_id=12345&promise_date=03/02/2020&dzip=92840&tracking_numbers=92344'
                                },
                                returnCenterAddress: {
                                    address1: 'walmart store 2',
                                    city: 'Huntsville',
                                    country: 'USA',
                                    dayPhone: '12344',
                                    emailId: 'walmart@walmart.com',
                                    postalCode: '35805',
                                    name: 'walmart',
                                    state: 'AL',
                                }
                            }
                        ]
                    },
                    sellerOrderId: '92344'
                }
            ]
        }
    }
};

walmartMarketplace.orders.shipOrderLines('1234567891234', orderShipment, function(err, response) {
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
  "order": {
    "purchaseOrderId": "1234567891234",
    "customerOrderId": "9876543212345",
    "sellerOrderId": "13233454564657",
    "customerEmailId": "customer@walmartlabs.com",
    "orderDate": 1478284060000,
    "shippingInfo": {
      "phone": "6501234567",
      "estimatedDeliveryDate": 1479798000000,
      "estimatedShipDate": 1478674800000,
      "methodCode": "Value",
      "postalAddress": {
        "name": "Jane Doe",
        "address1": "123 Main street",
        "city": "Sunnyvale",
        "state": "CA",
        "postalCode": "94086",
        "country": "USA",
        "addressType": "OFFICE"
      }
    },
    "orderLines": {
      "orderLine": [
        {
          "lineNumber": "1",
          "item": {
            "productName": "Kenmore CF-1 or 20-86883 Canister Secondary Filter Generic 2 Pack",
            "sku": "wei-ASSET-675gku675"
          },
          "charges": {
            "charge": [
              {
                "chargeType": "PRODUCT",
                "chargeName": "ItemPrice",
                "chargeAmount": {
                  "currency": "USD",
                  "amount": 555
                },
                "tax": {
                  "taxName": "Tax1",
                  "taxAmount": {
                    "currency": "USD",
                    "amount": 48.56
                  }
                }
              }
            ]
          },
          "orderLineQuantity": {
            "unitOfMeasurement": "EACH",
            "amount": "1"
          },
          "statusDate": 1478297929000,
          "orderLineStatuses": {
            "orderLineStatus": [
              {
                "status": "Shipped",
                "statusQuantity": {
                  "unitOfMeasurement": "EACH",
                  "amount": "1"
                },
                "trackingInfo": {
                  "shipDateTime": 1438163400000,
                  "carrierName": {
                    "carrier": "FedEx"
                  },
                  "methodCode": "Value",
                  "trackingNumber": "911001572321619861",
                  "trackingURL": "http://www.fedex.com/Tracking?action=track=english=us=x=911001572321619861"
                },
                "returnCenterAddress": {
                  "name": "ABC",
                  "address1": "123 Bridge street",
                  "city": "Huntsville",
                  "state": "AL",
                  "postalCode": "35805",
                  "country": "USA",
                  "dayPhone": "6501234567",
                  "emailId": "RCemailaddress@company.com"
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

## walmartMarketplace.prices.updatePrice(price, [options])

Updates the regular price for a given item.

https://developer.walmart.com/api/us/mp/price#operation/updatePrice

**Promise Example**
```javascript
const price = {
    pricing: [
        {
            currentPrice: {
                amount: 12.34,
                currency: 'USD'
            },
            currentPriceType: 'BASE'
        }
    ],
    sku: '97964_KFTest'
};

const response = await walmartMarketplace.prices.updatePrice(price);
console.log(response);
```

**Callback Example**
```javascript
const price = {
    pricing: [
        {
            currentPrice: {
                amount: 12.34,
                currency: 'USD'
            },
            currentPriceType: 'BASE'
        }
    ],
    sku: '97964_KFTest'
};

walmartMarketplace.prices.updatePrice(price, function(err, response) {
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
    "ItemPriceResponse": {
        "mart": "WALMART_US",
        "message": "Thank you. Your price has been updated. Please allow up to five minutes for this change to be reflected on the site.",
        "sku": "97964_KFTest"
    }
}
```

## walmartMarketplace.reports.getAvailableReconciliationReportDates([options])

This API will list all the available Marketplace reconciliation report dates for the Seller.

https://developer.walmart.com/api/us/mp/reports#operation/getAvailableV1ReconReportDates

**Promise Example**
```javascript
const response = await walmartMarketplace.reports.getAvailableReconciliationReportDates();
console.log(response);
```

**Callback Example**
```javascript
walmartMarketplace.reports.getAvailableReconciliationReportDates(function(err, response) {
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
    "availableApReportDates": [ '04252023', '05092023', '11082022', '12062022' ]
}
```

## walmartMarketplace.reports.getReconciliationReport(reportDate, [options])

Seller can download the reconciliation report for a specific date using this API. Dates available to be downloaded can be found by using the Get available reconciliation report dates API.

https://developer.walmart.com/api/us/mp/reports#operation/getReconReportV1

**Promise Example**
```javascript
const response = await walmartMarketplace.reports.getReconciliationReport('04252023', { autoPagination: true });
console.log(response);
```

**Callback Example**
```javascript
walmartMarketplace.reports.getReconciliationReport('04252023', { autoPagination: true }, function(err, response) {
    console.log(response);
});
```

**Returns**
```
[
    {
        "Period Start Date": "12/11/2025",
        "Period End Date": "12/19/2025",
        "Currency": "USD",
        "Transaction Type": "PaymentSummary",
        "Total Payable": "0.74",
        "Transaction Description": "Deposited in  account",
        "Transaction Posted Timestamp": "01/02/2025"
    },
    {
        "Shipping Method": "Marketplace value",
        "Partner Item Name": "MTV Mens Kanji Throwback 90s Logo Short Sleeve Graphic T-shirt With Music Television up to Size 3XL",
        "Customer Order line #": "1",
        "Contract Category": "Apparel & Accessories",
        "Transaction Description": "Purchase",
        "Product Tax Code": "100",
        "Period Start Date": "\"\"",
        "Ship to Zipcode": "72712",
        "Ship to City": "Bentonville",
        "Transaction Key": "2020_12_19_317",
        "Transaction Posted Timestamp": "12/18/2020",
        "Ship Qty": "1",
        "Amount": "14.98",
        "Transaction Type": "Sale",
        "Partner GTIN": "05705584961234",
        "Ship to State": "AR",
        "Amount Type": "Product Price",
        "Fulfillment Type": "Seller Fulfilled",
        "Customer Order #": "6222001976751",
        "Purchase Order #": "1803550130406",
        "Product Type": "Bag Clips",
        "Partner Item Id": "sku-123",
        "Purchase Order line #": "1"
    }
]
```