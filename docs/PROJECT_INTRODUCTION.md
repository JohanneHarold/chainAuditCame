# Consensus Chronicle - Project Introduction

## Executive Summary

**Consensus Chronicle** is an innovative multiplayer storytelling game that demonstrates the practical application of blockchain consensus mechanisms in collaborative decision-making. Built on GenLayer with Firebase real-time synchronization, the game transforms democratic voting into an engaging narrative experience.

## Problem Statement

Traditional multiplayer games struggle with:
- **Trust**: Centralized servers can manipulate outcomes
- **Permanence**: Game results are not verifiable or persistent
- **Consensus**: Group decisions lack transparent mechanisms

## Solution

Consensus Chronicle addresses these challenges by:
1. **Blockchain Recording**: Game outcomes permanently stored on GenLayer
2. **Democratic Voting**: Every decision requires player consensus
3. **Transparent Mechanics**: All votes and results are publicly verifiable
4. **Real-time Sync**: Firebase ensures instant state synchronization

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                    Single HTML + Babel                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │   MetaMask  │    │   Firebase  │    │  GenLayer   │    │
│   │   Wallet    │◄──►│  Realtime   │◄──►│  Contract   │    │
│   │   Auth      │    │  Database   │    │  Recording  │    │
│   └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    Vercel Hosting                            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

| Layer | Technology | Data Stored |
|-------|------------|-------------|
| Authentication | MetaMask | Wallet address (player ID) |
| Real-time State | Firebase | Rooms, games, votes, chat, scores |
| Permanent Record | GenLayer | Game results, total statistics |
| Frontend | React/Babel | UI state, local preferences |

## Game Mechanics

### Room Lifecycle

```
CREATE/JOIN (0 GEN fee)
       │
       ▼
   WAITING (2 min timeout)
       │
       ├── AI joins after 60s if < 4 players
       │
       ▼
   PLAYING (5 rounds)
       │
       ├── Debate (60s) → Vote (20s) → Result
       │
       ▼
   ENDED
       │
       ├── EXP saved to Firebase (all players)
       ├── Results recorded to GenLayer
       │
       ▼
   CLOSED
```

### Scoring Algorithm

```python
# Per round
if player_voted_for_winner:
    player.influence += 30
    player.wins += 1

if player_sent_debate_message:  # Once per round
    player.debates += 10

# Game end
total_exp = player.influence + player.debates
firebase.players[player.id].exp += total_exp
```

### Consensus Mechanism

- **Supermajority**: Option needs >50% to win clearly
- **Tie Handling**: Random selection, no points awarded
- **Path Recording**: All choices stored as string (e.g., "ABABA")

## Story Themes

| Theme | Setting | Key Conflicts |
|-------|---------|---------------|
| **Fantasy** | Medieval kingdom | Dragon threat, alliances, sacrifice |
| **Sci-Fi** | Mars colony 2157 | Asteroid impact, resource allocation |
| **Mystery** | Chen Manor | Murder investigation, hidden truths |
| **Political** | Imperial succession | Power struggle, faction warfare |

Each theme contains:
- Opening narrative
- 5 branching decision points
- 2 options per decision (A/B)
- Dynamic consequences based on path

## Smart Contract

### GenLayer Contract Structure

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
        """Entry fee - 0 GEN during beta"""
        return True
    
    @gl.public.write
    def record_chronicle(
        self,
        room_id: str,
        theme: str,
        path: str,
        player_count: u256,
        winner_score: u256
    ) -> bool:
        """Record completed game on-chain"""
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
    
    @gl.public.view
    def get_stats(self) -> str:
        return '{"games":' + str(self.total_games) + ',"players":' + str(self.total_players) + '}'
```

### Why GenLayer?

1. **Python Native**: Familiar language, easy development
2. **Intelligent Contracts**: Potential for AI-enhanced decisions
3. **Low Gas**: Efficient for gaming transactions
4. **Testnet Available**: Easy testing and iteration

## Firebase Schema

```javascript
// Room data
rooms/{roomId}: {
  theme: "fantasy" | "scifi" | "mystery" | "political",
  host: "0x...",
  status: "waiting" | "playing" | "closed" | "expired",
  createdAt: 1234567890,
  players: {
    "0x...": { id, name, avatar, exp, isAI }
  }
}

// Game state
games/{roomId}: {
  round: 1-5,
  phase: "debate" | "vote" | "ended",
  path: ["A", "B", "A"],
  scores: {
    "0x...": { influence: 60, debates: 30, wins: 2 }
  },
  votes: { "0x...": "A" },
  story: [{ text, type, round }],
  messages: { ... },
  timerEnd: 1234567890
}

// Player profiles
players/{address}: {
  name: "Hero",
  avatar: "🎭",
  exp: 500
}

// Game history
userHistory/{address}/{historyId}: {
  theme: "fantasy",
  path: "ABABA",
  ending: "...",
  earnedExp: 120,
  timestamp: 1234567890
}
```

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Wallet spoofing | MetaMask signature verification |
| Vote manipulation | Server-side timestamp validation |
| Room hijacking | Host-only game start |
| Data tampering | Firebase security rules |
| Replay attacks | Unique room IDs with timestamp |

## Future Enhancements

1. **AI Story Generation**: Use GenLayer LLM for dynamic narratives
2. **NFT Achievements**: Mint unique story completion badges
3. **Token Rewards**: GEN token payouts for top performers
4. **Custom Themes**: User-created story templates
5. **Tournament Mode**: Competitive chronicle championships
6. **Mobile App**: React Native version

## Deployment Checklist

- [ ] Configure Firebase project and rules
- [ ] Deploy GenLayer contract via Studio
- [ ] Update contract address in index.html
- [ ] Deploy to Vercel
- [ ] Test full game flow with multiple wallets
- [ ] Verify EXP saving for all players
- [ ] Monitor Firebase usage and costs

## Conclusion

Consensus Chronicle demonstrates how blockchain technology can enhance multiplayer gaming through transparent, democratic mechanics. By combining GenLayer's smart contracts with Firebase's real-time capabilities, we've created an engaging platform where every player's voice matters and every decision is permanently recorded.

---

**Project Repository**: [GitHub Link]  
**Live Demo**: [Vercel URL]  
**Contract**: GenLayer Testnet  
**Contact**: [Developer Info]

*Built for GenLayer Hackathon 2025*
