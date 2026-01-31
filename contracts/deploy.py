#!/usr/bin/env python3
"""
Consensus Chronicle - Contract Deployment Helper

This script provides instructions for deploying the GenLayer contract.
GenLayer uses Studio for deployment, not CLI scripts.
"""

import os
import sys

CONTRACT_FILE = "ConsensusChronicle.py"

def main():
    print("=" * 60)
    print("  Consensus Chronicle - GenLayer Contract Deployment")
    print("=" * 60)
    print()
    
    # Check if contract file exists
    if not os.path.exists(CONTRACT_FILE):
        print(f"ERROR: {CONTRACT_FILE} not found!")
        sys.exit(1)
    
    # Read contract
    with open(CONTRACT_FILE, 'r') as f:
        contract_code = f.read()
    
    print("Contract file found. To deploy:")
    print()
    print("1. Open GenLayer Studio:")
    print("   https://studio.genlayer.com")
    print()
    print("2. Create new file or paste contract code")
    print()
    print("3. Click 'Deploy' button")
    print()
    print("4. Wait for consensus (PENDING -> ACCEPTED)")
    print()
    print("5. Copy deployed contract address")
    print()
    print("6. Update index.html CONFIG.GENLAYER_CONTRACT")
    print()
    print("-" * 60)
    print("Contract Preview:")
    print("-" * 60)
    print(contract_code[:500] + "..." if len(contract_code) > 500 else contract_code)
    print("-" * 60)
    print()
    print("Contract Functions:")
    print("  - pay_fee() -> bool")
    print("  - record_chronicle(room_id, theme, path, player_count, winner_score) -> bool")
    print("  - get_total_games() -> u256")
    print("  - get_total_players() -> u256")
    print("  - get_stats() -> str")
    print()

if __name__ == "__main__":
    main()
