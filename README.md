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