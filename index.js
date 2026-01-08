const crypto = require('crypto');
const util = require('util');

const { parse } = require('csv-parse');
const JSZip = require('jszip');
const cache = require('memory-cache');

function finalize(err, data, callback) {
    // If a callback was provided, call it
    if (callback) {
        return callback(err, data);
    }

    // If there was an error, reject the promise
    if (err) {
        return Promise.reject(err);
    }

    // Resolve the promise with the data
    return Promise.resolve(data);
}

/**
 * @param {Object} args
 * @param {String} args.clientId Pre-registered identifier that uniquely identifies a solution provider app.
 * @param {String} args.clientSecret
 * @param {String} [args.url=https://sandbox.walmartapis.com] The base URL for the API. Defaults to https://sandbox.walmartapis.com for the sandbox environment. Use https://marketplace.walmartapis.com for the production environment.
 * @param {String} [args['WM_SVC.NAME']='Walmart Marketplace'] The Walmart Service Name. Defaults to 'Walmart Marketplace'.
 */
function WalmartMarketplace(args) {
    const _options = Object.assign({
        url: 'https://sandbox.walmartapis.com',
        'WM_SVC.NAME': 'Walmart Marketplace'
    }, args);

    const _this = this;

    this.authentication = {
        /**
         * The Walmart Marketplace APIs use OAuth for token-based authentication and authorization.
         * @see https://developer.walmart.com/api/us/mp/auth
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         * @returns {Object} token
         * @returns {Object} token.access_token Access token to be used for accessing business APIs.
         * @returns {Object} token.expires_in Expiry time of access token in seconds.
         * @returns {Object} token.token_type Type of token according to user. (e.g., 'BEARER').
         */
        getAccessToken: async function(options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                // Generate a cache key for the access token
                const cacheKey = JSON.stringify(_options);

                // Try to get the access token from memory cache
                let accessToken = cache.get(cacheKey);

                // Return the access token if it exists in memory cache
                if (accessToken) {
                    return finalize(null, accessToken, callback);
                }

                // Get the access token from the API
                const response = await fetch(`${_options.url}/v3/token`, {
                    body: new URLSearchParams({
                        grant_type: 'client_credentials'
                    }),
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Basic ${Buffer.from(`${_options.clientId}:${_options.clientSecret}`).toString('base64')}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    },
                    method: 'POST'
                });

                if (!response.ok) {
                    return finalize(new Error(response.statusText, { cause: response }), null, callback);
                }

                // Parse the response
                accessToken = await response.json();

                // Cache the token
                cache.put(cacheKey, accessToken, accessToken.expires_in * 1000 / 2);

                return finalize(null, accessToken, callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        }
    };

    this.inventory = {
        /**
         * You can use this API to get the inventory for a given item.
         * @see https://developer.walmart.com/api/us/mp/inventory
         * @param {String} sku An arbitrary alphanumeric unique ID, specified by the seller, which identifies each item.
         * @param {Object} [options]
         * @param {String} [options.shipNode] The shipNode for which the inventory is requested.
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        getInventory: async function(sku, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const queryParameters = new URLSearchParams({ sku });

                ['shipNode'].forEach(key => {
                    if (Object.hasOwn(options, key)) {
                        queryParameters.set(key, options[key]);
                    }
                });

                const url = `${_options.url}/v3/inventory?${queryParameters.toString()}`;

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    }
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Updates the inventory for a given item.
         * @see https://developer.walmart.com/api/us/mp/inventory#operation/updateInventoryForAnItem
         * @param {Object} inventory
         * @param {String} inventory.sku A seller-provided Product ID. Response will have decoded value.
         * @param {Object} inventory.quantity
         * @param {Number} inventory.quantity.amount Inventory Count.
         * @param {String} inventory.quantity.unit The unit of measurement. Example: 'EACH'.
         * @param {Object} [options]
         * @param {String} [options.shipNode] The shipNode for which the inventory is requested.
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        updateInventory: async function(inventory, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const queryParameters = new URLSearchParams({ sku: inventory.sku });

                ['shipNode'].forEach(key => {
                    if (Object.hasOwn(options, key)) {
                        queryParameters.set(key, options[key]);
                    }
                });

                const url = `${_options.url}/v3/inventory?${queryParameters.toString()}`;

                const response = await fetch(url, {
                    body: JSON.stringify(inventory),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    },
                    method: 'PUT'
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        }
    };

    this.items = {
        /**
         * Use this API for initial item setup and maintenance.
         * @see https://developer.walmart.com/api/us/mp/items#operation/itemBulkUploads
         * @param {String} feedType The feed Type. Enum: "item" "RETIRE_ITEM" "MP_ITEM" "MP_WFS_ITEM" "MP_ITEM_MATCH" "MP_MAINTENANCE" "SKU_TEMPLATE_MAP" "SHIPPING_OVERRIDES" "OMNI_WFS" "FITMENT_ACES" "FITMENT_PIES".
         * @param {Object} file The request body consists of a Feed file attached to the request based on the feedType selected.
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        bulkItemSetup: async function(feedType, file, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const queryParameters = new URLSearchParams({ feedType });
                const url = `${_options.url}/v3/feeds?${queryParameters.toString()}`;

                const response = await fetch(url, {
                    body: JSON.stringify(file),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    },
                    method: 'POST'
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Get Catalog Search Result.
         * @see https://developer.walmart.com/api/us/mp/items#operation/getCatalogSearch
         * @param {Object} [options]
         * @param {Boolean} [options.autoPagination] If true, automatically fetches all pages of results. Defaults to false.
         * @param {Number} [options.limit] Number of items. Default: 100.
         * @param {Object} [options.query]
         * @param {String} [options.query.field] Enum: "productName" "sku" "gtin" "wpid" "upc" "isbn" "ean" "itemId" "condition".
         * @param {String} [options.query.value]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        catalogSearch: async function(options, callback) {
            try {
                const items = [];

                const fetchItems = async cursor => {
                    let url;

                    if (cursor) {
                        url = `${_options.url}/v3/items/catalog/search?nextCursor=${cursor}`;
                    } else {
                        const queryParameters = new URLSearchParams();

                        ['limit'].forEach(key => {
                            if (Object.hasOwn(options, key)) {
                                queryParameters.set(key, options[key]);
                            }
                        });

                        url = `${_options.url}/v3/items/catalog/search?${queryParameters.toString()}`;
                    }

                    let body = {};

                    if (options?.query) {
                        body.query = options.query;
                    }

                    const response = await fetch(url, {
                        body: JSON.stringify(body),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
                            'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                            'WM_SVC.NAME': _options['WM_SVC.NAME']
                        },
                        method: 'POST'
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText, { cause: response });
                    }

                    const data = await response.json();

                    if (Array.isArray(data?.payload)) {
                        items.push(...data.payload);

                        // Check for more pages and if pagination is requested
                        if (options.autoPagination && data?.nextCursor) {
                            await fetchItems(data.nextCursor);
                        }
                    }
                };

                // Initial call to fetch items
                await fetchItems(null);

                return finalize(null, items, callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Displays a list of all items by using either nextCursor or offset and limit query parameters.
         * @see https://developer.walmart.com/api/us/mp/items#operation/getAllItems
         * @param {Object} [options]
         * @param {Boolean} [options.autoPagination] If true, automatically fetches all pages of results. Defaults to false.
         * @param {String} [options.lifecycleStatus] The lifecycle status of an item describes where the item listing is in the overall lifecycle. Examples of allowed values are ACTIVE , ARCHIVED, RETIRED.
         * @param {Number} [options.limit] Number of items. Default: 20.
         * @param {Number} [options.offset] The object response to start with, where 0 is the first entity that can be requested. Default: 0.
         */
        getAllItems: async function(options, callback) {
            try {
                const items = [];

                const fetchItems = async nextCursor => {
                    let url;

                    if (nextCursor) {
                        url = `${_options.url}/v3/items?nextCursor=${nextCursor}`;
                    } else {
                        const queryParameters = new URLSearchParams();

                        ['lifecycleStatus', 'limit', 'offset'].forEach(key => {
                            if (Object.hasOwn(options, key)) {
                                queryParameters.set(key, options[key]);
                            }
                        });

                        if (options.autoPagination) {
                            queryParameters.set('nextCursor', '*');
                        }

                        url = `${_options.url}/v3/items?${queryParameters.toString()}`;
                    }

                    const response = await fetch(url, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
                            'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                            'WM_SVC.NAME': _options['WM_SVC.NAME']
                        }
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText, { cause: response });
                    }

                    const data = await response.json();

                    if (Array.isArray(data?.ItemResponse)) {
                        items.push(...data.ItemResponse);

                        // Check for more pages and if pagination is requested
                        if (options.autoPagination && data.nextCursor && items.length < data.totalItems) {
                            await fetchItems(data.nextCursor);
                        }
                    }
                };

                // Initial call to fetch items
                await fetchItems();

                return finalize(null, items, callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Retrieves an item and displays the item details.
         * @see https://developer.walmart.com/api/us/mp/items#operation/getAnItem
         * @param {String} id Represents the seller-specified unique ID for each item. Takes SKU code by default. If you require more specific item codes, such as GTIN, UPC, ISBN, EAN, or ITEM_ID, you need to use the productIdType query parameter and specify the desired code e.g. productIdType=GTIN.
         * @param {Object} [options]
         * @param {String} [options.condition] The value of product condition, (e.g. New).
         * @param {String} [options.productIdType] Item code type specifier allows to filter by specific code type, (e.g. GTIN).
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        getAnItem: async function(id, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const queryParameters = new URLSearchParams();

                ['condition', 'productIdType'].forEach(key => {
                    if (Object.hasOwn(options, key)) {
                        queryParameters.set(key, options[key]);
                    }
                });

                const url = `${_options.url}/v3/items/${id}?${queryParameters.toString()}`;

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    }
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * The Item Search API allows you to query the Walmart.com global product catalog by item keyword, UPC or GTIN.
         * @see https://developer.walmart.com/api/us/mp/items#operation/getSearchResult
         * @param {Object} [options]
         * @param {String} [options.gtin] Specifies a Global Trade Item Number (GTIN) search. GTIN must be 14 digits.
         * @param {String} [options.query] Specifies a keyword search as a String.
         * @param {String} [options.upc] Specifies a Universal Product Code (UPC) search. UPC must be 12 digits.
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        itemSearch: async function(options, callback) {
            try {
                const queryParameters = new URLSearchParams();

                ['gtin', 'query', 'upc'].forEach(key => {
                    if (Object.hasOwn(options, key)) {
                        queryParameters.set(key, options[key]);
                    }
                });

                const url = `${_options.url}/v3/items/walmart/search?${queryParameters.toString()}`;

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    }
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Completely deactivates and un-publishes an item from the site.
         * @see https://developer.walmart.com/api/us/mp/items#operation/retireAnItem
         * @param {String} sku An arbitrary alphanumeric unique ID, specified by the seller, which identifies each item.
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        retireAnItem: async function(sku, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const url = `${_options.url}/v3/items/${sku}`;

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    },
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        }
    };

    this.orders = {
        /**
         * You can use this API to acknowledge an entire order, including all of its order lines. The response to a successful call contains the acknowledged order.
         * @see https://developer.walmart.com/api/us/mp/orders#operation/acknowledgeOrders
         * @param {String} purchaseOrderId purchaseOrderId
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        acknowledgeOrder: async function(purchaseOrderId, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const url = `${_options.url}/v3/orders/${purchaseOrderId}/acknowledge`;

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    },
                    method: 'POST'
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Retrieves the details of all the orders for specified search criteria.
         * @see https://developer.walmart.com/api/us/mp/orders#operation/getAllOrders
         * @param {Object} [options]
         * @param {Boolean} [options.autoPagination] If true, automatically fetches all pages of results. Defaults to false.
         * @param {String} [options.createdEndDate] Fetches all purchase orders that were created before this date. Default is current date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options.createdStartDate] Fetches all purchase orders that were created after this date. Default is current date - 7 days. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options.customerOrderId] The customer order ID.
         * @param {String} [options.fromExpectedShipDate] Fetches all purchase orders that have order lines with an expected ship date after this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options.lastModifiedEndDate] Fetches all purchase orders that were modified before this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options.lastModifiedStartDate] Fetches all purchase orders that were modified after this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options.limit] The number of orders to be returned. Cannot be larger than 200. Default: "100".
         * @param {String} [options.orderType] Specifies if the order is a regular order or replacement order. Possible values are REGULAR or REPLACEMENT. Provided in response only if query parameter replacementInfo=true.
         * @param {String} [options.productInfo] Provides the image URL and product weight in response, if available. Allowed values are true or false. Default: "false".
         * @param {String} [options.purchaseOrderId] The purchase order ID. One customer may have multiple purchase orders.
         * @param {String} [options.replacementInfo] Provides additional attributes - originalCustomerOrderID, orderType - related to Replacement order, in response, if available. Allowed values are true or false. Default: "false".
         * @param {String} [options.shipNodeType] Specifies the type of shipNode. Allowed values are SellerFulfilled(Default), WFSFulfilled and 3PLFulfilled. Default: "SellerFulfilled".
         * @param {String} [options.shippingProgramType] Specifies the type of program. Allowed value is TWO_DAY, ONE_DAY.
         * @param {String} [options.sku] A seller-provided Product ID.
         * @param {String} [options.status] Status of purchase order line. Valid statuses are: Created, Acknowledged, Shipped, Delivered and Cancelled.
         * @param {String} [options.toExpectedShipDate] Fetches all purchase orders that have order lines with an expected ship date before this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        getAllOrders: async function(options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const orders = [];

                const fetchOrders = async cursor => {
                    let url;

                    if (cursor) {
                        url = `${_options.url}/v3/orders?${cursor}`;
                    } else {
                        const queryParameters = new URLSearchParams();

                        ['createdEndDate', 'createdStartDate', 'customerOrderId', 'fromExpectedShipDate', 'lastModifiedEndDate', 'lastModifiedStartDate', 'limit', 'orderType', 'productInfo', 'purchaseOrderId', 'replacementInfo', 'shipNodeType', 'shippingProgramType', 'sku', 'status', 'toExpectedShipDate'].forEach(key => {
                            if (Object.hasOwn(options, key)) {
                                queryParameters.set(key, options[key]);
                            }
                        });

                        url = `${_options.url}/v3/orders?${queryParameters.toString()}`;
                    }

                    const response = await fetch(url, {
                        headers: {
                            Accept: 'application/json',
                            'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
                            'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                            'WM_SVC.NAME': _options['WM_SVC.NAME']
                        }
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText, { cause: response });
                    }

                    const data = await response.json();

                    if (Array.isArray(data?.list?.elements?.order)) {
                        orders.push(...data.list.elements.order);

                        // Check for more pages and if pagination is requested
                        if (options.autoPagination && data?.list?.meta?.nextCursor) {
                            await fetchOrders(data.list.meta.nextCursor);
                        }
                    }
                };

                // Initial call to fetch orders
                await fetchOrders(null);

                return finalize(null, orders, callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Retrieves all the orders with line items that are in the "created" status, that is, these orders have been released from the Walmart Order Management System to the seller for processing. The released orders are the orders that are ready for a seller to fulfill.
         * @see https://developer.walmart.com/api/us/mp/orders#operation/getAllReleasedOrders
         * @param {Object} [options]
         * @param {Boolean} [options.autoPagination] If true, automatically fetches all pages of results. Defaults to false.
         * @param {String} [options.createdEndDate] Fetches all purchase orders that were created before this date. Default is current date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options.createdStartDate] Fetches all purchase orders that were created after this date. Default is current date - 7 days. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options.customerOrderId] The customer order ID.
         * @param {String} [options.fromExpectedShipDate] Fetches all purchase orders that have order lines with an expected ship date after this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options.limit] The number of orders to be returned. Cannot be larger than 200. Default: "100".
         * @param {String} [options.orderType] Specifies if the order is a regular order or replacement order. Possible values are REGULAR or REPLACEMENT. Provided in response only if query parameter replacementInfo=true.
         * @param {String} [options.productInfo] Provides the image URL and product weight in response, if available. Allowed values are true or false. Default: "false".
         * @param {String} [options.shipNodeType] Specifies the type of shipNode. Allowed values are SellerFulfilled(Default), WFSFulfilled and 3PLFulfilled. Default: "SellerFulfilled".
         * @param {String} [options.shippingProgramType] Specifies the type of program. Allowed value is TWO_DAY, ONE_DAY.
         * @param {String} [options.sku] A seller-provided Product ID.
         * @param {String} [options.toExpectedShipDate] Fetches all purchase orders that have order lines with an expected ship date before this date. Use either UTC or ISO 8601 formats. Date example: '2020-03-16'(yyyy-MM-dd). Date with Timestamp example: '2020-03-16T10:30:15Z'(yyyy-MM-dd'T'HH:mm:ssZ).
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        getAllReleasedOrders: async function(options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const orders = [];

                const fetchOrders = async cursor => {
                    let url;

                    if (cursor) {
                        url = `${_options.url}/v3/orders/released?${cursor}`;
                    } else {
                        const queryParameters = new URLSearchParams();

                        ['createdEndDate', 'createdStartDate', 'customerOrderId', 'fromExpectedShipDate', 'limit', 'orderType', 'productInfo', 'purchaseOrderId', 'replacementInfo', 'shipNodeType', 'shippingProgramType', 'sku', 'toExpectedShipDate'].forEach(key => {
                            if (Object.hasOwn(options, key)) {
                                queryParameters.set(key, options[key]);
                            }
                        });

                        url = `${_options.url}/v3/orders/released?${queryParameters.toString()}`;
                    }

                    const response = await fetch(url, {
                        headers: {
                            Accept: 'application/json',
                            'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
                            'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                            'WM_SVC.NAME': _options['WM_SVC.NAME']
                        }
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText, { cause: response });
                    }

                    const data = await response.json();

                    if (Array.isArray(data?.list?.elements?.order)) {
                        orders.push(...data.list.elements.order);

                        // Check for more pages and if pagination is requested
                        if (options.autoPagination && data?.list?.meta?.nextCursor) {
                            await fetchOrders(data.list.meta.nextCursor);
                        }
                    }
                };

                // Initial call to fetch orders
                await fetchOrders(null);

                return finalize(null, orders, callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Updates the status of order lines to Shipped and trigger the charge to the customer. The response to a successful call contains the order with the shipped line items.
         * @see https://developer.walmart.com/api/us/mp/orders#operation/shippingUpdates
         * @param {String} purchaseOrderId purchaseOrderId
         * @param {Object} orderShipment Information about a shipment
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        shipOrderLines: async function(purchaseOrderId, orderShipment, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const url = `${_options.url}/v3/orders/${purchaseOrderId}/shipping`;

                const response = await fetch(url, {
                    body: JSON.stringify(orderShipment),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    },
                    method: 'POST'
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        }
    };

    this.prices = {
        /**
         * Updates the regular price for a given item.
         * @see https://developer.walmart.com/api/us/mp/price#operation/updatePrice
         * @param {Object} price
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        updatePrice: async function(price, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const url = `${_options.url}/v3/price`;

                const response = await fetch(url, {
                    body: JSON.stringify(price),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    },
                    method: 'PUT'
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        }
    };

    this.reports = {
        /**
         * Creates a new request for report by specifying the reportType and reportVersion.
         * @see https://developer.walmart.com/api/us/mp/onrequestreports#operation/generateReport
         * @param {String} reportType Specifies the report type for the request. For example, reportType=ITEM creates an Item Report. Enum: "ITEM" "INVENTORY" "CANCELLATION" "DELIVERY_DEFECT" "ITEM_PERFORMANCE" "PROMO" "RETURN_OVERRIDES" "CPA" "SHIPPING_CONFIGURATION" "SHIPPING_PROGRAM" "FITMENT_MISSING_ATTR" "FITMENT_ACES_COVERAGE" "BUYBOX" "ASSORTMENT_RECOMMENDATIONS"
         * @param {String} reportVersion Version of report for which the request is created. Supported versions for each report type are currently 'reportVersion=v1' for the following reportType(s): INVENTORY, CANCELLATION, DELIVERY_DEFECT, ITEM_PERFORMANCE, PROMO, RETURN_OVERRIDES, CPA, SHIPPING_CONFIGURATION, SHIPPING_PROGRAM, FITMENT_MISSING_ATTR, FITMENT_ACES_COVERAGE, BUYBOX, ASSORTMENT_RECOMMENDATIONS and 'reportVersion=v1', 'reportVersion=v2', 'reportVersion=v3', 'reportVersion=v4' for the following reportType(s): ITEM.
         * @param {Object} [requestBody]
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        createReportRequest: async function(reportType, reportVersion, requestBody, options, callback) {
            try {
                // requestBody is optional
                if (!requestBody) {
                    requestBody = {};
                } else if (typeof requestBody === 'function') {
                    callback = requestBody;
                    requestBody = {};
                }

                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const queryParameters = new URLSearchParams({ reportType, reportVersion });
                const url = `${_options.url}/v3/reports/reportRequests?${queryParameters.toString()}`;

                const response = await fetch(url, {
                    body: JSON.stringify(requestBody),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    },
                    method: 'POST'
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        download: async function(url, callback) {
            try {
                const response = await fetch(url);
                const zip = await JSZip.loadAsync(response.arrayBuffer());
                const file = await zip.file(Object.keys(zip.files)[0]);
                const csv = await file.async('string');
                const data = await util.promisify(parse)(csv, { columns: true });

                return finalize(null, data, callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Fetches URL to download a generated report.
         * @see https://developer.walmart.com/api/us/mp/onrequestreports#operation/downloadReport
         * @param {String} requestId Automated ID generated by system that uniquely identifies the report request.
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        downloadReportUrl: async function(requestId, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const queryParameters = new URLSearchParams({ requestId });
                const url = `${_options.url}/v3/reports/downloadReport?${queryParameters.toString()}`;

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    }
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Fetches a list of all report requests for specified search criteria by using query parameters. You can fetch details of report requests created in the last 30 days only.
         * @see https://developer.walmart.com/api/us/mp/onrequestreports#operation/getRequestsStatus
         * @param {String} reportType Type of report for which the request is created. Example, ITEM for Item Report. Enum: "ITEM" "INVENTORY" "CANCELLATION" "DELIVERY_DEFECT" "ITEM_PERFORMANCE" "PROMO" "RETURN_OVERRIDES" "CPA" "SHIPPING_CONFIGURATION" "SHIPPING_PROGRAM" "FITMENT_MISSING_ATTR" "FITMENT_ACES_COVERAGE" "BUYBOX" "ASSORTMENT_RECOMMENDATIONS"
         * @param {Object} [options]
         * @param {Boolean} [options.autoPagination] If true, automatically fetches all pages of results. Defaults to false.
         * @param {Number} [options.limit] Number of records to be returned. Default is 10.
         * @param {String} [options.reportVersion] Version of report for which the request is created. Example, v1.
         * @param {String} [options.requestStatus] Status of report request. Possible values are RECEIVED, INPROGRESS, READY, ERROR.
         * @param {String} [options.requestSubmissionEndDate] Report request submittal end date for range of reports requested, in format YYYY-MM-DDTHH:mm:ssZ
         * @param {String} [options.requestSubmissionStartDate] Report request submittal start date for range of reports requested, in format: YYYY-MM-DDTHH:mm:ssZ
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        getAllReportRequests: async function(reportType, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const reportRequests = [];

                const fetchReportRequests = async cursor => {
                    let url;

                    if (cursor) {
                        url = `${_options.url}/v3/reports/reportRequests?${cursor}`;
                    } else {
                        const queryParameters = new URLSearchParams({ reportType });

                        ['limit', 'reportVersion', 'requestStatus', 'requestSubmissionEndDate', 'requestSubmissionStartDate'].forEach(key => {
                            if (Object.hasOwn(options, key)) {
                                queryParameters.set(key, options[key]);
                            }
                        });

                        url = `${_options.url}/v3/reports/reportRequests?${queryParameters.toString()}`;
                    }

                    const response = await fetch(url, {
                        headers: {
                            Accept: 'application/json',
                            'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
                            'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                            'WM_SVC.NAME': _options['WM_SVC.NAME']
                        }
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText, { cause: response });
                    }

                    const data = await response.json();

                    if (Array.isArray(data?.requests)) {
                        reportRequests.push(...data.requests);

                        // Check for more pages and if pagination is requested
                        if (options.autoPagination && data?.nextCursor) {
                            await fetchReportRequests(data.nextCursor);
                        }
                    }
                };

                // Initial call to fetch report requests
                await fetchReportRequests(null);

                return finalize(null, reportRequests, callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * This API will list all the available Marketplace reconciliation report dates for the Seller.
         * @see https://developer.walmart.com/api/us/mp/reports#operation/getAvailableV1ReconReportDates
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        getAvailableReconciliationReportDates: async function(options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const url = `${_options.url}/v3/report/reconreport/availableReconFiles?reportVersion=v1`;

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    }
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Seller can download the reconciliation report for a specific date using this API. Dates available to be downloaded can be found by using the Get available reconciliation report dates API.
         * @see https://developer.walmart.com/api/us/mp/reports#operation/getReconReportV1
         * @param {String} reportDate The date for which the reconcilation file is available.
         * @param {Object} [options]
         * @param {Boolean} [options.autoPagination] If true, automatically fetches all pages of results. Defaults to false.
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        getReconciliationReport: async function(reportDate, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const reportData = [];

                const fetchReportRequests = async offset => {
                    const queryParameters = new URLSearchParams({ noOfRecords: 1000, offset: offset || 0, reportDate });
                    const url = `${_options.url}/v3/report/reconreport/reconFileJson?${queryParameters.toString()}`;

                    const response = await fetch(url, {
                        headers: {
                            Accept: 'application/json',
                            'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
                            'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                            'WM_SVC.NAME': _options['WM_SVC.NAME']
                        }
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText, { cause: response });
                    }

                    const data = await response.json();

                    if (Array.isArray(data?.reportData)) {
                        reportData.push(...data.reportData);

                        // Check for more pages and if pagination is requested
                        if (options.autoPagination && Number(data?.nextOffset) > 0) {
                            await fetchReportRequests(data.nextOffset);
                        }
                    }
                };

                // Initial call to fetch report requests
                await fetchReportRequests(null);

                return finalize(null, reportData, callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        },
        /**
         * Fetches status and other details of a report request by providing a requestID. You can fetch details of report request created in the last 30 days only.
         * @see https://developer.walmart.com/api/us/mp/onrequestreports#operation/getSingleRequestStatus
         * @param {String} requestId Automated ID generated by system that uniquely identifies the report request.
         * @param {Object} [options]
         * @param {String} [options['WM_QOS.CORRELATION_ID']] A unique ID which identifies each API call and used to track and debug issues. Defaults to a random UUID.
         */
        reportRequestStatus: async function(requestId, options, callback) {
            try {
                // Options are optional
                if (!options) {
                    options = {};
                } else if (typeof options === 'function') {
                    callback = options;
                    options = {};
                }

                const url = `${_options.url}/v3/reports/reportRequests/${requestId}`;

                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/json',
                        'WM_QOS.CORRELATION_ID': options['WM_QOS.CORRELATION_ID'] || crypto.randomUUID(),
                        'WM_SEC.ACCESS_TOKEN': (await _this.authentication.getAccessToken()).access_token,
                        'WM_SVC.NAME': _options['WM_SVC.NAME']
                    }
                });

                if (!response.ok) {
                    throw new Error(response.statusText, { cause: response });
                }

                return finalize(null, await response.json(), callback);
            } catch(err) {
                return finalize(err, null, callback);
            }
        }
    };
}

module.exports = WalmartMarketplace;