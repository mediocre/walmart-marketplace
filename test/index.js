const assert = require('assert');
const crypto = require('crypto');
const test = require('node:test');

const cache = require('memory-cache');

const WalmartMarketplace = require('../index');

test('WalmartMarketplace.inventory', async (t) => {
    await test('WalmartMarketplace.inventory.getInventory(sku, options)', async (t) => {
        await test('should return json', async () => {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

            const inventory = await walmartMarketplace.inventory.getInventory('97964_KFTest');
            assert(inventory);
            assert.strictEqual(inventory.sku, '97964_KFTest');
        });
    });

    await test('WalmartMarketplace.inventory.getInventory(sku, options, callback)', async (t) => {
        await test('should return json', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

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
    
            walmartMarketplace.inventory.getInventory('97964_KFTest', { 'WM_QOS.CORRELATION_ID': crypto.randomUUID() }, function(err, inventory) {
                assert.ifError(err);
                assert(inventory);
                assert.strictEqual(inventory.sku, '97964_KFTest');
                
                done();
            });
        });
    });
});

test('WalmartMarketplace.items', async (t) => {
    await test('WalmartMarketplace.items.bulkItemSetup(feedType, file, options)', async (t) => {
        await test('should return json', async () => {
            let walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

            // HACK: The following code adds an access token to the cache for a different environment
            cache.clear();
            const accessToken = await walmartMarketplace.authentication.getAccessToken();
            const json = JSON.parse(cache.keys()[0]);
            json.url = 'https://httpbin.org/post#';
            cache.put(JSON.stringify(json), accessToken);

            walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                url: 'https://httpbin.org/post#'
            });

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
            assert(response);
        });

        await test('should throw error for non 200 status code', async () => {
            let walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

            // HACK: The following code adds an access token to the cache for a different environment
            cache.clear();
            const accessToken = await walmartMarketplace.authentication.getAccessToken();
            const json = JSON.parse(cache.keys()[0]);
            json.url = 'https://httpbin.org/status/500#';
            cache.put(JSON.stringify(json), accessToken);

            walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                url: 'https://httpbin.org/status/500#'
            });

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

            try {
                await walmartMarketplace.items.bulkItemSetup('MP_ITEM_MATCH', mpItemMatch, { 'WM_QOS.CORRELATION_ID': crypto.randomUUID() });
                assert.fail('Expected an error to be thrown');
            } catch (err) {
                assert(err);
                assert.strictEqual(err.cause.status, 500);
                assert.strictEqual(err.message, 'INTERNAL SERVER ERROR');
            }
        });
    });

    await test('WalmartMarketplace.items.bulkItemSetup(feedType, file, options, callback)', async (t) => {
        await test('should callback', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

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

            walmartMarketplace.items.bulkItemSetup('MP_ITEM_MATCH', mpItemMatch, function() {
                done();
            });
        });
    });
    
    await test('WalmartMarketplace.items.getAnItem(id, options)', async (t) => {
        await test('should return json', async () => {
            let walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

            // HACK: The following code adds an access token to the cache for a different environment
            cache.clear();
            const accessToken = await walmartMarketplace.authentication.getAccessToken();
            const json = JSON.parse(cache.keys()[0]);
            json.url = 'https://httpbin.org/json#';
            cache.put(JSON.stringify(json), accessToken);

            walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                url: 'https://httpbin.org/json#'
            });

            const itemDetails = await walmartMarketplace.items.getAnItem('30348_KFTest', { condition: 'New' });
            assert(itemDetails);
        });

        await test('should return an error for non 200 status code', async () => {
            let walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

            // HACK: The following code adds an access token to the cache for a different environment
            cache.clear();
            const accessToken = await walmartMarketplace.authentication.getAccessToken();
            const json = JSON.parse(cache.keys()[0]);
            json.url = 'https://httpbin.org/status/500#';
            cache.put(JSON.stringify(json), accessToken);

            walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                url: 'https://httpbin.org/status/500#'
            });

            try {
                await walmartMarketplace.items.getAnItem('30348_KFTest');
                assert.fail('Expected an error to be thrown');
            } catch (err) {
                assert(err);
                assert.strictEqual(err.cause.status, 500);
                assert.strictEqual(err.message, 'INTERNAL SERVER ERROR');
            }
        });
    });

    await test('WalmartMarketplace.items.getAnItem(id, options, callback)', async (t) => {
        await test('should return an error for non 200 status code', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

            walmartMarketplace.items.getAnItem('30348_KFTest', function(err, itemDetails) {
                // HACK: In the sandbox environment, this endpoint always seems to return a 404
                assert(err);
                assert.strictEqual(err.cause.status, 404);
                assert.strictEqual(err.message, 'Not Found');
                assert.strictEqual(itemDetails, null);
                done();
            });
        });
    });

    await test('WalmartMarketplace.items.retireAnItem(sku, options)', async (t) => {
        await test('should retire an item', async () => {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });
    
            const response = await walmartMarketplace.items.retireAnItem('123456');
            assert.strictEqual(response.errors, null);
            assert.strictEqual(response.sku, '123456');
        });

        await test('should support options', async () => {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });
    
            const response = await walmartMarketplace.items.retireAnItem('123456', { 'WM_QOS.CORRELATION_ID': crypto.randomUUID() });
            assert.strictEqual(response.errors, null);
            assert.strictEqual(response.sku, '123456');
        });

        await test('should throw an error for non 200 status code', async () => {
            let walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

            // HACK: The following code adds an access token to the cache for a different environment
            cache.clear();
            const accessToken = await walmartMarketplace.authentication.getAccessToken();
            const json = JSON.parse(cache.keys()[0]);
            json.url = 'https://httpbin.org/status/500#';
            cache.put(JSON.stringify(json), accessToken);

            walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                url: 'https://httpbin.org/status/500#'
            });

            try {
                await walmartMarketplace.items.retireAnItem('123456');
                assert.fail('Expected an error to be thrown');
            } catch (err) {
                assert(err);
                assert.strictEqual(err.cause.status, 500);
                assert.strictEqual(err.message, 'INTERNAL SERVER ERROR');
            }
        });
    });

    await test('WalmartMarketplace.items.retireAnItem(sku, options, callback)', async (t) => {
        await test('should retire an item', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });
    
            walmartMarketplace.items.retireAnItem('123456', function(err, response) {
                assert.ifError(err);
                assert.strictEqual(response.errors, null);
                assert.strictEqual(response.sku, '123456');
                
                done();
            });
        });

        await test('should support options', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });
    
            walmartMarketplace.items.retireAnItem('123456', { 'WM_QOS.CORRELATION_ID': crypto.randomUUID() }, function(err, response) {
                assert.ifError(err);
                assert.strictEqual(response.errors, null);
                assert.strictEqual(response.sku, '123456');
                
                done();
            });
        });
    });
});

test('WalmartMarketplace.prices', async (t) => {
    await test('WalmartMarketplace.prices.updatePrice(price, options)', async (t) => {
        await test('should return json', async () => {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

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
            assert(response);
            assert.strictEqual(response.ItemPriceResponse.sku, '97964_KFTest');
        });

        await test('should throw an error for non 200 status code', async () => {
            let walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

            // HACK: The following code adds an access token to the cache for a different environment
            cache.clear();
            const accessToken = await walmartMarketplace.authentication.getAccessToken();
            const json = JSON.parse(cache.keys()[0]);
            json.url = 'https://httpbin.org/status/500#';
            cache.put(JSON.stringify(json), accessToken);

            walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                url: 'https://httpbin.org/status/500#'
            });

            try {
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

                await walmartMarketplace.prices.updatePrice(price, { 'WM_QOS.CORRELATION_ID': crypto.randomUUID() });
                assert.fail('Expected an error to be thrown');
            } catch (err) {
                assert(err);
                assert.strictEqual(err.cause.status, 500);
                assert.strictEqual(err.message, 'INTERNAL SERVER ERROR');
            }
        });
    });

    await test('WalmartMarketplace.prices.updatePrice(price, options, callback)', async (t) => {
        await test('should return json', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });

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
                assert.ifError(err);
                assert(response);
                assert.strictEqual(response.ItemPriceResponse.sku, '97964_KFTest');
                
                done();
            });
        });
    });
});

test('WalmartMarketplace.authentication', async (t) => {
    await test('WalmartMarketplace.authentication.getAccessToken(options)', async (t) => {
        t.beforeEach(() => {
            cache.clear();
        });
    
        await test('should support options', async () => {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });
    
            const accessToken = await walmartMarketplace.authentication.getAccessToken({ 'WM_QOS.CORRELATION_ID': crypto.randomUUID() });
            assert(accessToken);
        });
    
        await test('should cache the access token', async () => {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });
    
            assert.strictEqual(cache.size(), 0);
    
            const accessToken1 = await walmartMarketplace.authentication.getAccessToken();
            assert.strictEqual(cache.size(), 1);
    
            const accessToken2 = await walmartMarketplace.authentication.getAccessToken();
            assert.strictEqual(cache.size(), 1);
    
            assert.deepStrictEqual(accessToken1, accessToken2);
        });
    
        await test('should return an error for invalid url', async () => {
            const walmartMarketplace = new WalmartMarketplace({
                url: 'invalid'
            });
    
            try {
                await walmartMarketplace.authentication.getAccessToken();
                assert.fail('Expected an error to be thrown');
            } catch (err) {
                assert(err);
                assert.strictEqual(err.message, 'Failed to parse URL from invalid/v3/token');
            }
        });
    
        await test('should return an error for non 200 status code', async () => {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                url: 'https://httpbin.org/status/500#'
            });
    
            try {
                await walmartMarketplace.authentication.getAccessToken();
                assert.fail('Expected an error to be thrown');
            } catch (err) {
                assert(err);
                assert.strictEqual(err.cause.status, 500);
                assert.strictEqual(err.message, 'INTERNAL SERVER ERROR');
            }
        });
    });

    await test('WalmartMarketplace.authentication.getAccessToken(options, callback)', async (t) => {
        t.beforeEach(() => {
            cache.clear();
        });
    
        await test('should support options', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });
    
            walmartMarketplace.authentication.getAccessToken({ 'WM_QOS.CORRELATION_ID': crypto.randomUUID() }, function(err, accessToken) {
                assert.ifError(err);
                assert(accessToken);
                
                done();
            });
        });
    
        await test('should cache the access token', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            });
    
            assert.strictEqual(cache.size(), 0);
    
            walmartMarketplace.authentication.getAccessToken(function(err, accessToken1) {
                assert.ifError(err);
                assert.strictEqual(cache.size(), 1);
    
                walmartMarketplace.authentication.getAccessToken(function(err, accessToken2) {
                    assert.ifError(err);
                    assert.strictEqual(cache.size(), 1);
                    assert.deepStrictEqual(accessToken1, accessToken2);
    
                    done();
                });
            });
        });
    
        await test('should return an error for invalid url', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                url: 'invalid'
            });
    
            walmartMarketplace.authentication.getAccessToken(function(err, accessToken) {
                assert(err);
                assert.strictEqual(err.message, 'Failed to parse URL from invalid/v3/token');
                assert.strictEqual(accessToken, null);
    
                done();
            });
        });
    
        await test('should return an error for non 200 status code', function(t, done) {
            const walmartMarketplace = new WalmartMarketplace({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                url: 'https://httpbin.org/status/500#'
            });
    
            walmartMarketplace.authentication.getAccessToken(function(err, accessToken) {
                assert(err);
                assert.strictEqual(err.cause.status, 500);
                assert.strictEqual(err.message, 'INTERNAL SERVER ERROR');
                assert.strictEqual(accessToken, null);
    
                done();
            });
        });
    });
});