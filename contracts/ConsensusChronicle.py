# { "Depends": "py-genlayer:test" }

from genlayer import *


class ConsensusChronicle(gl.Contract):
    """
    Consensus Chronicle - Production Smart Contract
    Records game results and player statistics on GenLayer blockchain.
    """
    
    # State variables
    total_games: u256
    total_players: u256
    
    def __init__(self):
        self.total_games = u256(0)
        self.total_players = u256(0)
    
    @gl.public.write
    def record_chronicle(
        self,
        room_id: str,
        theme: str,
        path: str,
        player_count: u256,
        winner_score: u256
    ) -> bool:
        """
        Record a completed chronicle game on-chain.
        Called when a game ends to persist results.
        
        Args:
            room_id: Unique room identifier
            theme: Game theme (fantasy/scifi/mystery/political)
            path: Decision path taken (e.g., "ABABA")
            player_count: Number of players in game
            winner_score: Highest score achieved
        
        Returns:
            bool: True if recorded successfully
        """
        if not room_id or not theme:
            return False
        
        self.total_games = self.total_games + u256(1)
        self.total_players = self.total_players + player_count
        return True
    
    @gl.public.write
    def pay_fee(self) -> bool:
        """
        Process game entry fee.
        Called when player creates or joins a room.
        Currently 0 GEN for beta testing.
        
        Returns:
            bool: Always True (free during beta)
        """
        return True
    
    @gl.public.view
    def get_total_games(self) -> u256:
        """Get total number of completed games"""
        return self.total_games
    
    @gl.public.view
    def get_total_players(self) -> u256:
        """Get total player participations"""
        return self.total_players
    
    @gl.public.view
    def get_stats(self) -> str:
        """Get contract statistics as JSON string"""
        return '{"games":' + str(self.total_games) + ',"players":' + str(self.total_players) + '}'
