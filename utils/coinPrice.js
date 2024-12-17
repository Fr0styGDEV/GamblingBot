const fs = require('fs');
const path = require('path');

const stockPriceFilePath = path.join(__dirname, '../storage/stockPrice.json'); // New file for stock price
const priceHistoryFilePath = path.join(__dirname, '../storage/priceHistory.json'); // New file for price history

// Initialize priceHistory if it doesn't exist
if (!fs.existsSync(priceHistoryFilePath)) {
    fs.writeFileSync(priceHistoryFilePath, JSON.stringify([], null, 2));  // Initialize with an empty array
}

// Read the coin price from the JSON file
function readCoinPrice() {
    try {
        let data = fs.readFileSync(stockPriceFilePath, 'utf8');
        return JSON.parse(data).coinPrice;  // Assume the data has a 'coinPrice' property
    } catch (err) {
        console.error('Error reading coin price:', err);
        return 100; // Default if error occurs
    }
}

// Write the updated coin price to the JSON file
function writeCoinPrice(price) {
    const data = { coinPrice: price };
    fs.writeFileSync(stockPriceFilePath, JSON.stringify(data, null, 2));
}

// Read price history from the JSON file
function readPriceHistory() {
    let data = fs.readFileSync(priceHistoryFilePath, 'utf8');
    return JSON.parse(data);
}

// Write updated price history to the JSON file
function writePriceHistory(history) {
    fs.writeFileSync(priceHistoryFilePath, JSON.stringify(history, null, 2));
}

// Simulate stock price changes
function updateCoinPrice() {
    const currentPrice = readCoinPrice();
    const change = (Math.random() - 0.5) * 60;  // Random change between -15 and +15
    let newPrice = Math.round(currentPrice + change);
    if (newPrice < 10) newPrice = 10;  // Prevent price from dropping below 10
    writeCoinPrice(newPrice);

    // Update price history with the new price
    const priceHistory = readPriceHistory();
    priceHistory.push(newPrice);
    if (priceHistory.length > 30) {
        priceHistory.shift();  // Limit to last 30 prices
    }
    writePriceHistory(priceHistory);

    console.log(`New coin price: ${newPrice}`);
}

// Update the coin price every 1 minute (60000ms)
setInterval(updateCoinPrice, 60000);

// Export functions
module.exports = { readCoinPrice, updateCoinPrice, readPriceHistory };
