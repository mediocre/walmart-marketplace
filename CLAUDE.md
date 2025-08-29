# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Testing
```bash
# Run all tests (requires CLIENT_ID and CLIENT_SECRET environment variables for API tests)
npm test
# or
node --test
```

### Linting
```bash
# Run ESLint (no script defined, run directly)
npx eslint .
```

### Code Coverage
```bash
# Generate coverage report and send to Coveralls
npm run coveralls
```

## Architecture Overview

This is a Node.js SDK for the Walmart Marketplace API, providing a comprehensive interface for sellers to manage their items, orders, prices, inventory, and reports on Walmart.com.

### Core Design Patterns

1. **Dual API Support**: Every method supports both Promise-based and callback-based invocation patterns through a `finalize` helper function in `/Users/shawnmiller/GitHub/walmart-marketplace/index.js:8`.

2. **Authentication & Caching**: OAuth tokens are automatically cached in memory with TTL set to half the expiration time. The cache key is based on the client credentials to support multiple configurations.

3. **Module Structure**: The main class `WalmartMarketplace` organizes API endpoints into logical modules:
   - `authentication` - OAuth token management
   - `inventory` - Get/update inventory levels  
   - `items` - Item management (bulk setup, search, retire)
   - `orders` - Order processing (acknowledge, retrieve, ship)
   - `prices` - Price updates
   - `reports` - Reconciliation report generation and download

4. **Auto-Pagination**: Methods like `getAllOrders` and `getReconciliationReport` support `autoPagination` option to automatically fetch all pages of results.

5. **Report Processing**: The reports module handles ZIP file extraction and CSV parsing automatically, returning parsed data rather than raw files.

### Key Implementation Details

- **Error Handling**: HTTP errors are wrapped with the response as the `cause` for debugging
- **Correlation IDs**: Each API call accepts a `WM_QOS.CORRELATION_ID` for tracking (auto-generated UUID if not provided)
- **Environment Support**: Defaults to sandbox environment; production URL: `https://marketplace.walmartapis.com`
- **Test Environment**: Tests use environment variables `CLIENT_ID` and `CLIENT_SECRET` for API credentials

### Testing Notes

Tests require valid Walmart API credentials set as environment variables. The test suite uses Node.js built-in test runner and includes both positive and negative test cases, testing both Promise and callback patterns.