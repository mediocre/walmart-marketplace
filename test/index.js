const assert = require('assert');
const test = require('node:test');

const cache = require('memory-cache');

const WalmartMarketplace = require('../index');

test('WalmartMarketplace.authentication.getAccessToken', async (t) => {
    t.beforeEach(() => {
        cache.clear();
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
});