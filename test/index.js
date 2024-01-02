const assert = require('assert');
const test = require('node:test');

const cache = require('memory-cache');

const WalmartMarketplace = require('../index');

test('WalmartMarketplace.authentication.getAccessToken', async (t) => {
    t.beforeEach(() => {
        cache.clear();
    });

    await t.test('should return an error for invalid url', async (t) => {
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

    await t.test('should return an error for invalid url', function(t, done) {
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