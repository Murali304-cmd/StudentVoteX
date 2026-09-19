"""
Proof of Work Mining Module for VoteChain / CertiChain.
Provides cryptographic hashing with dynamic difficulty adjustment, target block pacing,
and real-time streaming telemetry.
"""
import time
import hashlib
from typing import Dict, Any, Generator, Tuple, Optional

class ProofOfWorkMiner:
    # Target time per block in seconds (e.g. 10.0s for campus election load pacing)
    TARGET_BLOCK_TIME_SECONDS = 10.0

    def __init__(self, default_difficulty: int = 3):
        self.default_difficulty = default_difficulty

    @staticmethod
    def calculate_hash(block_index: int, prev_hash: str, merkle_root: str, timestamp: float, nonce: int, difficulty: int) -> str:
        """Calculates SHA-256 hash for block header."""
        header_str = f"{block_index}|{prev_hash}|{merkle_root}|{timestamp:.6f}|{nonce}|{difficulty}"
        return hashlib.sha256(header_str.encode('utf-8')).hexdigest()

    def adjust_difficulty(self, last_block_time: float, current_time: float, current_difficulty: int) -> int:
        """
        Dynamically adjusts difficulty to maintain steady block generation rate:
        If actual interval < target / 2 -> increase difficulty
        If actual interval > target * 2 -> decrease difficulty
        """
        interval = current_time - last_block_time
        if interval <= 0:
            return current_difficulty

        if interval < (self.TARGET_BLOCK_TIME_SECONDS / 2.0) and current_difficulty < 6:
            return current_difficulty + 1
        elif interval > (self.TARGET_BLOCK_TIME_SECONDS * 2.0) and current_difficulty > 1:
            return current_difficulty - 1
        return current_difficulty

    def mine_block_generator(
        self,
        block_index: int,
        prev_hash: str,
        merkle_root: str,
        difficulty: Optional[int] = None,
        max_iterations: int = 2_000_000,
        yield_interval: int = 500
    ) -> Generator[Dict[str, Any], None, Tuple[int, str, float]]:
        """
        Mines a block header by incrementing nonce until target leading zeros match difficulty.
        Yields intermediate progress for real-time mining visualization in the frontend.
        """
        if difficulty is None:
            difficulty = self.default_difficulty

        target_prefix = "0" * difficulty
        nonce = 0
        start_time = time.time()
        timestamp = time.time()

        while nonce < max_iterations:
            current_hash = self.calculate_hash(block_index, prev_hash, merkle_root, timestamp, nonce, difficulty)
            
            if current_hash.startswith(target_prefix):
                elapsed = time.time() - start_time
                hash_rate = nonce / elapsed if elapsed > 0 else nonce
                yield {
                    "status": "MINED",
                    "nonce": nonce,
                    "hash": current_hash,
                    "difficulty": difficulty,
                    "elapsedSeconds": round(elapsed, 4),
                    "hashRate": round(hash_rate, 2),
                    "isComplete": True
                }
                return nonce, current_hash, timestamp

            if nonce % yield_interval == 0:
                elapsed = time.time() - start_time
                hash_rate = nonce / elapsed if elapsed > 0 else nonce
                yield {
                    "status": "MINING",
                    "nonce": nonce,
                    "hash": current_hash,
                    "difficulty": difficulty,
                    "elapsedSeconds": round(elapsed, 4),
                    "hashRate": round(hash_rate, 2),
                    "isComplete": False
                }

            nonce += 1

        # Fallback if max iterations exceeded
        current_hash = self.calculate_hash(block_index, prev_hash, merkle_root, timestamp, nonce, difficulty)
        return nonce, current_hash, timestamp

    def mine_sync(self, block_index: int, prev_hash: str, merkle_root: str, difficulty: int = 3) -> Tuple[int, str, float]:
        """Synchronously mines a block header until difficulty is met."""
        target_prefix = "0" * difficulty
        nonce = 0
        timestamp = time.time()
        while True:
            h = self.calculate_hash(block_index, prev_hash, merkle_root, timestamp, nonce, difficulty)
            if h.startswith(target_prefix):
                return nonce, h, timestamp
            nonce += 1
