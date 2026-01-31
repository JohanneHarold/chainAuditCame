# Consensus Chronicle

> Blockchain-powered multiplayer storytelling game where collective decisions shape the narrative.

[![GenLayer](https://img.shields.io/badge/Powered%20by-GenLayer-gold)](https://genlayer.com)

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

### 1. Deploy Smart Contract

1. Open [GenLayer Studio](https://studio.genlayer.com)
2. Copy contents of `contracts/ConsensusChronicle.py`
3. Click **Deploy**
4. Copy deployed contract address
5. Update in `index.html`

### 2. Configure Firebase

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
├── docs/
│   └── PROJECT_INTRODUCTION.md   # Detailed project overview
├── vercel.json                   # Vercel routing config
└── README.md                     # This file
```

## Smart Contract

**Network**: GenLayer Studio

### Contract Functions

| Function | Type | Description |
|----------|------|-------------|
| `pay_fee()` | Write | Process game entry fee (0 GEN beta) |
| `record_chronicle(room_id, theme, path, player_count, winner_score)` | Write | Save game results on-chain |
| `get_total_games()` | View | Get total completed games |
| `get_total_players()` | View | Get total player participations |
| `get_stats()` | View | Get JSON statistics |


## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Could not load contract schema" | Use correct GenLayer syntax (see contract code above) |
| MetaMask not connecting | Ensure MetaMask is unlocked and on correct network |
| Room not showing | Check Firebase rules allow read/write |
| EXP not saving | Ensure all players are in Firebase before game starts |


---

**Built for GenLayer  | Storytellers Unite** 🐉📜
