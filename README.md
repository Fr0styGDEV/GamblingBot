# GamblingBOT

GamblingBOT is a Discord bot that adds an engaging and interactive gambling and leveling system to your server. Users can gamble coins, invest in a dynamic cryptocurrency (FrostyCoin), answer gaming trivia questions, and level up to gain roles that represent their achievements.

## Features

### Gambling Commands
- `!gamble [amount]`: 50/50 chance to double or lose the specified amount.
- `!jp [amount] [multiplier]`: Set your own odds and multiplier for a jackpot win.

### Investing in FrostyCoin
- Real-time updates to FrostyCoin price.
- `!buy [amount]`: Buy FrostyCoin at the current price.
- `!sell [amount]`: Sell your FrostyCoin and gain profits (or losses).
- `!graph`: Displays a graphical representation of FrostyCoin’s recent price history and user’s holdings.

### Leveling System
- `!levelup [amount]`: Spend coins to level up. Levels scale exponentially in cost.
- Automatically assigns roles based on levels:
  - Bronze: Levels 0-100
  - Silver: Levels 101-500
  - Gold: Levels 501-1000
  - Emerald: Levels 1000+
- Displays level and a role-based emoji in the user's nickname.

### Gaming Trivia
- `!earn`: Answer gaming-related trivia questions to earn coins.
- Uses OpenAI to generate and evaluate questions and answers.

### Leaderboard
- `!leaderboard`: Displays the top 5 players based on coin balance and levels.

## Installation

### Prerequisites
1. [Node.js](https://nodejs.org/) installed on your system.
2. A Discord bot token. [Follow this guide](https://discord.com/developers/docs/intro).
3. An OpenAI API key. [Get it here](https://platform.openai.com/).

### Setup
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd GamblingBot
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file:
    ```env
    BOT_TOKEN=your-discord-bot-token
    OPENAI_API_KEY=your-openai-api-key
    ```

4. Run the bot:
    ```bash
    node .
    ```

## Configuration

### Storage Files
- `balances.json`: Stores user balances.
- `levels.json`: Stores user levels.
- `investments.json`: Tracks FrostyCoin investments.
- `stockPrice.json`: Stores the current FrostyCoin price.
- `priceHistory.json`: Tracks historical FrostyCoin prices.

### Channel Notifications
- The bot announces significant FrostyCoin price changes (e.g., reaching 10 or exceeding 300) in a specific channel. Update the channel ID in `coinPrice.js`.

## Contributing
Feel free to submit issues or pull requests to improve GamblingBOT. Contributions are always welcome!

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- [Discord.js](https://discord.js.org/) for the Discord API wrapper.
- [OpenAI](https://openai.com/) for the trivia generation and evaluation.
- Inspiration from various Discord bots and gambling systems.

