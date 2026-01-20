# Consensus Chronicle

A multiplayer story-driven voting game.

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy
1. Push this folder to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Click Deploy

### Option 2: Vercel CLI
```bash
npm install -g vercel
cd consensus-deploy
vercel
```

### Option 3: Local Development
```bash
npm install
npm run dev
```

## 📁 Structure

```
consensus-deploy/
├── src/
│   ├── App.jsx         # Main game component
│   └── main.jsx        # Entry point
├── contracts/
│   └── ConsensusChronicle.py  # GenLayer contract
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 🎮 Features

- 4 story themes (Fantasy, Sci-Fi, Mystery, Political)
- 5-round branching narratives
- Real-time debate and voting
- AI players for testing
- Token economy (GLT)
- Leaderboard

## 📜 Smart Contract

Deploy `contracts/ConsensusChronicle.py` to GenLayer Studio.
