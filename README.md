# Consensus Chronicle

A multiplayer story-driven voting game built on GenLayer blockchain.

## 📁 Project Structure

```
consensus-chronicle-complete/
├── contracts/
│   └── ConsensusChronicle.py    # GenLayer Smart Contract
├── frontend/
│   └── ConsensusChronicle.jsx   # React Game Component
└── README.md
```

## 🎮 Game Overview

Players collaboratively shape a story through debate and voting. Each game has 5 rounds where players discuss options and vote on story decisions. The majority wins, and the story branches based on collective choices.

### Themes
- 🏰 **Fantasy Quest** - Dragons, magic, ancient prophecies
- 🚀 **Stellar Crisis** - Space survival, alien contact
- 🔍 **Murder Mystery** - Secrets, deduction, justice
- 👑 **Court Intrigue** - Power, succession, wisdom

### Token Economy
| Action | Amount |
|--------|--------|
| Starting Balance | 100 GLT |
| Game Entry Fee | -10 GLT |
| Base Reward | +50 GLT |
| Win Bonus | +20 pts per round |
| Debate Bonus | +5 pts per message |

## 📜 Smart Contract (GenLayer)

### Deployment
1. Open [GenLayer Studio](https://studio.genlayer.com)
2. Create new contract
3. Paste `contracts/ConsensusChronicle.py`
4. Click Deploy

### Contract Functions

#### Write Functions
| Function | Parameters | Description |
|----------|------------|-------------|
| `register` | `name: str` | Register player, receive 100 GLT |
| `create_room` | - | Create room, deduct 10 GLT |
| `join_room` | - | Join room, deduct 10 GLT |
| `end_game` | `winner: Address, reward: u256` | End game, give reward |
| `add_game` | `player: Address` | Record game played |

#### View Functions
| Function | Parameters | Returns |
|----------|------------|---------|
| `get_name` | `addr: Address` | Player name |
| `get_balance` | `addr: Address` | Token balance |
| `get_stats` | `addr: Address` | (games, wins, rewards) |
| `get_totals` | - | (rooms, games) |

### Example Usage
```python
# Register
register("Alice")

# Check balance
get_balance("0xYourAddress")  # Returns 100

# Create room
create_room()  # Returns room_id, deducts 10 GLT

# Check balance again
get_balance("0xYourAddress")  # Returns 90
```

## ⚛️ Frontend (React)

### Installation
```bash
# Using in existing React project
cp frontend/ConsensusChronicle.jsx src/components/

# Import and use
import ConsensusChronicle from './components/ConsensusChronicle';
```

### Standalone Usage
The component is self-contained and can be rendered directly:
```jsx
import ConsensusChronicle from './ConsensusChronicle';

function App() {
  return <ConsensusChronicle />;
}
```

### Features
- ✅ Player registration with name
- ✅ Token balance management
- ✅ Room creation and joining
- ✅ 5-round story gameplay
- ✅ Real-time debate chat
- ✅ Voting system
- ✅ AI players for testing
- ✅ Game history tracking
- ✅ Leaderboard

### Local Storage
The frontend uses localStorage for:
- `cc_player` - Player data (name, tokens, etc.)
- `cc_history` - Game history records
- `cc_leaderboard` - Top scores

## 🔗 Connecting Frontend to Contract

To integrate the React frontend with the GenLayer contract:

```javascript
// Example integration (pseudo-code)
import { GenLayerClient } from 'genlayer-sdk';

const client = new GenLayerClient({
  contractAddress: '0xYourContractAddress'
});

// Register player
await client.call('register', { name: 'Alice' });

// Get balance
const balance = await client.view('get_balance', { addr: userAddress });

// Create room
await client.call('create_room');
```

## 🎯 Game Flow

1. **Register** → Player enters name, receives 100 GLT
2. **Create/Join Room** → Deducts 10 GLT entry fee
3. **Wait for Players** → Need 4-8 players
4. **Start Game** → Host clicks start
5. **Round Loop** (5 rounds):
   - **Debate Phase** (90s) → Players discuss options
   - **Vote Phase** (30s) → Players vote A or B
   - **Result** → Majority wins, story continues
6. **End Game** → Rewards distributed based on performance

## 📊 Scoring

| Action | Points |
|--------|--------|
| Winning vote | +20 |
| Submitting debate | +5 |
| Final reward | 50 + (score / 2) GLT |

## 🛠️ Development

### Prerequisites
- Node.js 18+
- React 18+
- GenLayer account

### Local Testing
The frontend includes AI players that automatically join and participate, allowing single-player testing.

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request
