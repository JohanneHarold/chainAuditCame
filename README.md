# Consensus Chronicle

> Blockchain-powered multiplayer storytelling game where collective decisions shape the narrative.

[![GenLayer](https://img.shields.io/badge/Powered%20by-GenLayer-gold)](https://genlayer.com)
[![Firebase](https://img.shields.io/badge/Real--time-Firebase-orange)](https://firebase.google.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

## Overview

**Consensus Chronicle** is a real-time multiplayer game combining collaborative storytelling with blockchain technology. Players join "chronicle rooms" to collectively write a story through debate and democratic voting. Results are permanently recorded on the GenLayer blockchain.

### Features

- **Real-time Multiplayer**: 4-8 players per room with AI companions
- **Collaborative Storytelling**: 5 rounds of debate and voting per game
- **Four Epic Themes**: Fantasy, Sci-Fi, Mystery, Political Intrigue
- **Blockchain Integration**: Results recorded on GenLayer
- **MetaMask Authentication**: Secure wallet-based identity
- **Global Leaderboard**: Rankings by experience points
- **Room Timer**: 2-minute countdown for room creation

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React (Single HTML) | Game interface |
| Real-time | Firebase Realtime DB | Live game state sync |
| Blockchain | GenLayer | Result recording |
| Wallet | MetaMask | Player authentication |
| Hosting | Vercel | Static deployment |

## Quick Start

### 1. Configure Firebase

Update `CONFIG.FIREBASE` in `index.html`:

```javascript
FIREBASE: {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

### 2. Deploy Smart Contract

1. Open [GenLayer Studio](https://studio.genlayer.com)
2. Copy contents of `contracts/ConsensusChronicle.py`
3. Click **Deploy**
4. Copy deployed contract address
5. Update `CONFIG.GENLAYER_CONTRACT` in `index.html`

### 3. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or drag `index.html` to Vercel dashboard.

## Game Flow

```
1. Connect Wallet (MetaMask)
2. Enter Player Name
3. Choose Theme (Fantasy/Sci-Fi/Mystery/Political)
4. Create or Join Room (GenLayer TX: 0 GEN)
5. Wait for Players (AI joins after 60s if needed)
6. Room Timer: 2 minutes to start game
7. Game Loop (5 rounds):
   - Debate Phase (60s): Discuss options A and B
   - Vote Phase (20s): Choose your preferred option
   - Result: Winning option advances story
8. Chronicle Complete: 
   - EXP saved to Firebase for ALL players
   - Results recorded on GenLayer blockchain
```

## Scoring System

| Action | Points |
|--------|--------|
| Send debate message | +10 EXP (once per round) |
| Vote for winning option | +30 EXP |
| Tie vote | +0 (random path selected) |

**Note**: All real players in the room receive their earned EXP at game end.

## Project Structure

```
consensus-chronicle/
├── index.html                    # Main application (single-file React)
├── contracts/
│   ├── ConsensusChronicle.py     # GenLayer smart contract
│   └── deploy.py                 # Deployment helper script
├── docs/
│   └── PROJECT_INTRODUCTION.md   # Detailed project overview
├── vercel.json                   # Vercel routing config
└── README.md                     # This file
```

## Smart Contract

**Network**: GenLayer Testnet

### Contract Functions

| Function | Type | Description |
|----------|------|-------------|
| `pay_fee()` | Write | Process game entry fee (0 GEN beta) |
| `record_chronicle(room_id, theme, path, player_count, winner_score)` | Write | Save game results on-chain |
| `get_total_games()` | View | Get total completed games |
| `get_total_players()` | View | Get total player participations |
| `get_stats()` | View | Get JSON statistics |

### Contract Code

```python
# { "Depends": "py-genlayer:test" }

from genlayer import *

class ConsensusChronicle(gl.Contract):
    total_games: u256
    total_players: u256
    
    def __init__(self):
        self.total_games = u256(0)
        self.total_players = u256(0)
    
    @gl.public.write
    def pay_fee(self) -> bool:
        return True
    
    @gl.public.write
    def record_chronicle(self, room_id: str, theme: str, path: str, 
                         player_count: u256, winner_score: u256) -> bool:
        if not room_id or not theme:
            return False
        self.total_games = self.total_games + u256(1)
        self.total_players = self.total_players + player_count
        return True
    
    @gl.public.view
    def get_total_games(self) -> u256:
        return self.total_games
    
    @gl.public.view
    def get_total_players(self) -> u256:
        return self.total_players
```

## Firebase Data Structure

```
firebase-root/
├── rooms/{roomId}/
│   ├── theme: string
│   ├── host: address
│   ├── status: "waiting" | "playing" | "closed" | "expired"
│   ├── createdAt: timestamp
│   └── players/{playerId}/
│       ├── id, name, avatar, exp, isAI
│
├── games/{roomId}/
│   ├── round: number (1-5)
│   ├── phase: "debate" | "vote" | "ended"
│   ├── path: string[]
│   ├── scores/{playerId}/
│   │   ├── influence, debates, wins
│   ├── votes/{playerId}: "A" | "B"
│   ├── story: array
│   ├── messages/{msgId}/
│   │   ├── type, text, sender, choice, timestamp
│   └── timerEnd: timestamp
│
├── players/{address}/
│   ├── name, avatar, exp
│
└── userHistory/{address}/{historyId}/
    ├── theme, path, ending, earnedExp, timestamp
```

## Configuration

Key settings in `index.html`:

```javascript
const CONFIG = {
  GENLAYER_CONTRACT: '0x...', // Your deployed contract address
  FIREBASE: { ... },          // Your Firebase config
  ROOM_SIZE: { min: 4, max: 8 },
  DEBATE_DURATION: 60,        // Seconds
  VOTE_DURATION: 20,          // Seconds
  TOTAL_ROUNDS: 5,
  ROOM_TIMEOUT_AI: 60000,     // AI joins after 60s
  ROOM_TIMEOUT_CLOSE: 120000  // Room expires after 2 mins
};
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Could not load contract schema" | Use correct GenLayer syntax (see contract code above) |
| MetaMask not connecting | Ensure MetaMask is unlocked and on correct network |
| Room not showing | Check Firebase rules allow read/write |
| EXP not saving | Ensure all players are in Firebase before game starts |

## License

MIT License

---

**Built for GenLayer Hackathon | Storytellers Unite** 🐉📜
