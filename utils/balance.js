const fs = require('fs');
const path = require('path');

const balanceFilePath = path.join(__dirname, '../storage/balances.json');

// Helper function to read the balance file
function readBalances() {
    const data = fs.readFileSync(balanceFilePath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write the balance file
function writeBalances(balances) {
    fs.writeFileSync(balanceFilePath, JSON.stringify(balances, null, 2));
}

// Function to get a user's balance
function getBalance(userId) {
    const balances = readBalances();
    return balances[userId] || 10; // sets default balance
}

// Function to update a user's balance
function updateBalance(userId, amount) {
    const balances = readBalances();
    if (!balances[userId]) {
        balances[userId] = 10; // sets default balance for new users
    }
    balances[userId] = amount;  // Directly set the new balance instead of adding
    writeBalances(balances);
}

// Function to get a user's stock
function getUserStock(userId) {
    const balances = readBalances();
    return balances[userId]?.stock || 0;
}

// Function to update a user's stock
function updateUserStock(userId, stockAmount) {
    const balances = readBalances();
    if (!balances[userId]) {
        balances[userId] = { stock: 0 };  // Default to 0 stock if the user doesn't exist
    }
    balances[userId].stock = stockAmount;
    writeBalances(balances);
}

module.exports = { getBalance, updateBalance, readBalances, getUserStock, updateUserStock };

