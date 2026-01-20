# v0.1.0
# { "Depends": "py-genlayer:latest" }

from genlayer import *


class ConsensusChronicle(gl.Contract):
    """
    Consensus Chronicle - A multiplayer story-driven voting game
    
    Players vote on story decisions, majority wins.
    Token economy: entry fee, rewards for winners.
    """
    
    # Player data
    names: TreeMap[Address, str]
    balances: TreeMap[Address, u256]
    games: TreeMap[Address, u256]
    wins: TreeMap[Address, u256]
    rewards: TreeMap[Address, u256]
    
    # Global counters
    room_count: u256
    game_count: u256
    entry_fee: u256
    
    def __init__(self):
        self.names = TreeMap[Address, str]()
        self.balances = TreeMap[Address, u256]()
        self.games = TreeMap[Address, u256]()
        self.wins = TreeMap[Address, u256]()
        self.rewards = TreeMap[Address, u256]()
        
        self.room_count = u256(0)
        self.game_count = u256(0)
        self.entry_fee = u256(10)
    
    @gl.public.write
    def register(self, name: str) -> bool:
        """Register a new player with 100 starting tokens"""
        caller = gl.message.sender_account
        if caller in self.names:
            return False
        self.names[caller] = name
        self.balances[caller] = u256(100)
        self.games[caller] = u256(0)
        self.wins[caller] = u256(0)
        self.rewards[caller] = u256(0)
        return True
    
    @gl.public.view
    def get_name(self, addr: Address) -> str:
        """Get player name"""
        if addr in self.names:
            return self.names[addr]
        return ""
    
    @gl.public.view
    def get_balance(self, addr: Address) -> u256:
        """Get player token balance"""
        if addr in self.balances:
            return self.balances[addr]
        return u256(0)
    
    @gl.public.view
    def get_stats(self, addr: Address) -> tuple[u256, u256, u256]:
        """Get player stats: (games, wins, total_rewards)"""
        g = u256(0)
        w = u256(0)
        r = u256(0)
        if addr in self.games:
            g = self.games[addr]
        if addr in self.wins:
            w = self.wins[addr]
        if addr in self.rewards:
            r = self.rewards[addr]
        return (g, w, r)
    
    @gl.public.write
    def create_room(self) -> u256:
        """Create a game room, deducts entry fee, returns room_id"""
        caller = gl.message.sender_account
        if caller not in self.names:
            return u256(0)
        
        bal = self.balances[caller]
        if bal < self.entry_fee:
            return u256(0)
        
        self.balances[caller] = bal - self.entry_fee
        self.room_count = self.room_count + u256(1)
        return self.room_count
    
    @gl.public.write
    def join_room(self) -> bool:
        """Join a game room, deducts entry fee"""
        caller = gl.message.sender_account
        if caller not in self.names:
            return False
        
        bal = self.balances[caller]
        if bal < self.entry_fee:
            return False
        
        self.balances[caller] = bal - self.entry_fee
        return True
    
    @gl.public.write
    def end_game(self, winner: Address, reward: u256) -> bool:
        """End game and give reward to winner"""
        if winner not in self.names:
            return False
        
        self.balances[winner] = self.balances[winner] + reward
        self.rewards[winner] = self.rewards[winner] + reward
        self.wins[winner] = self.wins[winner] + u256(1)
        self.game_count = self.game_count + u256(1)
        return True
    
    @gl.public.write
    def add_game(self, player: Address) -> bool:
        """Record a game played by player"""
        if player not in self.games:
            return False
        self.games[player] = self.games[player] + u256(1)
        return True
    
    @gl.public.write
    def distribute_rewards(self, players: list[Address], winner_idx: u256, pool: u256) -> bool:
        """Distribute rewards: 40% to winner, 60% split among all"""
        count = u256(len(players))
        if count == u256(0):
            return False
        
        winner_bonus = pool * u256(40) / u256(100)
        base_share = pool * u256(60) / u256(100) / count
        
        i = u256(0)
        for player in players:
            if player in self.names:
                reward = base_share
                if i == winner_idx:
                    reward = reward + winner_bonus
                    self.wins[player] = self.wins[player] + u256(1)
                
                self.balances[player] = self.balances[player] + reward
                self.rewards[player] = self.rewards[player] + reward
                self.games[player] = self.games[player] + u256(1)
            i = i + u256(1)
        
        self.game_count = self.game_count + u256(1)
        return True
    
    @gl.public.view
    def get_totals(self) -> tuple[u256, u256]:
        """Get total rooms and games played"""
        return (self.room_count, self.game_count)
    
    @gl.public.view
    def get_entry_fee(self) -> u256:
        """Get current entry fee"""
        return self.entry_fee
