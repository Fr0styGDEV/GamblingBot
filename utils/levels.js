const fs = require('fs');
const path = require('path');

// Path to the JSON file for storing player levels
const levelsFilePath = path.join(__dirname, '../storage/levels.json');

// Initialize levels.json if it doesn't exist
if (!fs.existsSync(levelsFilePath)) {
    fs.writeFileSync(levelsFilePath, JSON.stringify({}, null, 2)); // Empty object for player levels
}

// Read player levels from the JSON file
function getPlayerLevel(userId) {
    const data = JSON.parse(fs.readFileSync(levelsFilePath, 'utf8'));
    return data[userId] || 1; // Default level is 1 if not found
}

// Update player level in the JSON file
function setPlayerLevel(userId, level) {
    const data = JSON.parse(fs.readFileSync(levelsFilePath, 'utf8'));
    data[userId] = level;
    fs.writeFileSync(levelsFilePath, JSON.stringify(data, null, 2));
}

// Calculate the cost of leveling up based on current level
function calculateLevelCost(currentLevel, baseCost = 1000, scaleFactor = 1.05) {
    return Math.floor(baseCost * Math.pow(currentLevel, scaleFactor));
}
function calculateLevelRefund(currentLevel, levelsToSell, baseCost = 1000, scaleFactor = 1.05, refundRate = 1) {
    let totalRefund = 0;

    for (let i = 0; i < levelsToSell; i++) {
        const levelToRefund = currentLevel - i; // Start from the highest level
        if (levelToRefund <= 0) break; // Prevent invalid levels

        const cost = Math.floor(baseCost * Math.pow(levelToRefund, scaleFactor)); // Cost of this level
        totalRefund += Math.floor(cost * refundRate); // Apply refund rate
    }

    return totalRefund; // Return total refund amount
}


// Attempt to level up a player
function levelUpPlayer(userId, currentBalance, baseCost = 1000, scaleFactor = 1.05) {
    const currentLevel = getPlayerLevel(userId);
    const levelUpCost = calculateLevelCost(currentLevel, baseCost, scaleFactor);

    if (currentBalance >= levelUpCost) {
        setPlayerLevel(userId, currentLevel + 1);
        return { success: true, cost: levelUpCost, newLevel: currentLevel + 1 };
    } else {
        return { success: false, cost: levelUpCost, newLevel: currentLevel };
    }
}
{
    function calculateProfit(userId, args) {
        const currentLevel = getPlayerLevel(userId);
        const levelsToSell = args;
        let totalRefund = 0;

    for (let i = 0; i < levelsToSell; i++) {
        const levelToRefund = currentLevel - i; // Start from the highest level
        if (levelToRefund <= 0) break; 

        const cost = Math.floor(baseCost * Math.pow(levelToRefund, scaleFactor)); // Cost of this level
        totalRefund += Math.floor(cost * refundRate); // Apply refund rate
    }

    return totalRefund; 


    }
}

// Export functions
module.exports = {
    getPlayerLevel,
    setPlayerLevel,
    calculateLevelCost,
    levelUpPlayer,
    calculateProfit,
    calculateLevelRefund,
};
