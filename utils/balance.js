const fs = require('fs');
const path = require('path');

const balanceFilePath = path.join(__dirname, '../storage/balances.json');
const investmentsFile = path.join(__dirname, '../storage/investments.json');


function readBalances() {
    const data = fs.readFileSync(balanceFilePath, 'utf8');
    return JSON.parse(data);
}

function writeBalances(balances) {
    fs.writeFileSync(balanceFilePath, JSON.stringify(balances, null, 2));
}

function getBalance(userId) {
    const balances = readBalances();
    return balances[userId] || 10; // sets default balance
}

function updateBalance(userId, amount) {
    const balances = readBalances();
    if (!balances[userId]) {
        balances[userId] = 10; // sets default balance for new users
    }
    balances[userId] = amount;  // Directly set the new balance instead of adding
    writeBalances(balances);
}

function getUserStock(userId) {
    const balances = readBalances();
    return balances[userId]?.stock || 0;
}

function updateUserStock(userId, stockAmount) {
    const balances = readBalances();
    if (!balances[userId]) {
        balances[userId] = { stock: 0 };  // Default to 0 stock if the user doesn't exist
    }
    balances[userId].stock = stockAmount;
    writeBalances(balances);
}
function readInvestments(){
    const data = fs.readFileSync(investmentsFile, 'utf-8');
    return JSON.parse(data);
}
function getUserInvestments(userId) {
    const userInvestment = readInvestments();
    return userInvestment[userId];
}
function writeUserInvestments(userId, investment) {
    const investments = readInvestments();
    investments[userId] = investment;
    fs.writeFileSync(investmentsFile, JSON.stringify(investments, null, 2));
}
module.exports = { getBalance, updateBalance, readBalances, getUserStock, updateUserStock, getUserInvestments, writeUserInvestments };

