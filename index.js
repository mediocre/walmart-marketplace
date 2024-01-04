const crypto = require('crypto');

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
}

module.exports = WalmartMarketplace;