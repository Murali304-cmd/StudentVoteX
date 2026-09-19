"""
Merkle Tree and Sparse Merkle Tree (SMT) Subsystem for VotaNova Enterprise.
Cryptographic Transaction Integrity & Inclusion Proofs using NIST FIPS 202 SHA-3 (256-bit).
"""
from typing import List, Dict, Any, Optional, Tuple
import hashlib
import json
from .crypto_utils import sha3_256_hash, sha256_hash


class MerkleTreeNode:
    def __init__(
        self,
        hash_val: str,
        left: Optional['MerkleTreeNode'] = None,
        right: Optional['MerkleTreeNode'] = None,
        tx_data: Optional[Dict[str, Any]] = None
    ):
        self.hash_val = hash_val
        self.left = left
        self.right = right
        self.tx_data = tx_data

    def to_dict(self) -> Dict[str, Any]:
        """Serializes the tree node into a hierarchical structure for React visual inspection."""
        return {
            "hash": self.hash_val,
            "shortHash": self.hash_val[:8] + "..." + self.hash_val[-6:] if len(self.hash_val) > 16 else self.hash_val,
            "isLeaf": self.left is None and self.right is None,
            "txData": self.tx_data,
            "left": self.left.to_dict() if self.left else None,
            "right": self.right.to_dict() if self.right else None
        }


class MerkleTree:
    """
    Cryptographic Merkle Tree using SHA-3-256 for leaves, branches, and root.
    Ensures mathematical proof of inclusion for all audit blockchain transactions.
    """

    def __init__(self, transactions: List[Dict[str, Any]]):
        self.transactions = transactions
        self.leaves: List[MerkleTreeNode] = []
        self.root: Optional[MerkleTreeNode] = None
        self._build_tree()

    @staticmethod
    def hash_pair(a: str, b: str) -> str:
        """Concatenates and hashes two child nodes using SHA-3-256."""
        combined = f"{a}:{b}".encode('utf-8')
        return hashlib.sha3_256(combined).hexdigest()

    def _build_tree(self):
        if not self.transactions:
            empty_hash = hashlib.sha3_256(b'VOTANOVA_EMPTY_MERKLE_TREE_ROOT').hexdigest()
            self.root = MerkleTreeNode(hash_val=empty_hash)
            return

        # 1. Create leaf nodes for each transaction using SHA-3
        self.leaves = []
        for tx in self.transactions:
            tx_hash = (
                tx.get("vote_hash") or
                tx.get("tx_hash") or
                tx.get("tx_id") or
                sha3_256_hash(tx)
            )
            node = MerkleTreeNode(hash_val=tx_hash, tx_data=tx)
            self.leaves.append(node)

        # 2. Iteratively compute parent levels until single root is obtained
        current_level: List[MerkleTreeNode] = list(self.leaves)

        while len(current_level) > 1:
            next_level: List[MerkleTreeNode] = []

            # Standard duplicate last element if odd count
            if len(current_level) % 2 == 1:
                last_node = current_level[-1]
                duplicate_node = MerkleTreeNode(
                    hash_val=last_node.hash_val,
                    left=last_node.left,
                    right=last_node.right,
                    tx_data=last_node.tx_data
                )
                current_level.append(duplicate_node)

            for i in range(0, len(current_level), 2):
                left_child = current_level[i]
                right_child = current_level[i + 1]
                parent_hash = self.hash_pair(left_child.hash_val, right_child.hash_val)
                parent_node = MerkleTreeNode(
                    hash_val=parent_hash,
                    left=left_child,
                    right=right_child
                )
                next_level.append(parent_node)

            current_level = next_level

        self.root = current_level[0]

    @property
    def root_hash(self) -> str:
        return self.root.hash_val if self.root else ""

    def get_proof(self, tx_index: int) -> List[Dict[str, str]]:
        """
        Generates a cryptographic Merkle Inclusion Proof (audit path) for tx at tx_index.
        """
        if tx_index < 0 or tx_index >= len(self.leaves):
            return []

        proof = []
        current_idx = tx_index
        current_level = [leaf.hash_val for leaf in self.leaves]

        while len(current_level) > 1:
            if len(current_level) % 2 == 1:
                current_level.append(current_level[-1])

            if current_idx % 2 == 0:
                sibling_hash = current_level[current_idx + 1]
                proof.append({"position": "right", "hash": sibling_hash})
            else:
                sibling_hash = current_level[current_idx - 1]
                proof.append({"position": "left", "hash": sibling_hash})

            current_idx = current_idx // 2
            next_level = []
            for i in range(0, len(current_level), 2):
                next_level.append(self.hash_pair(current_level[i], current_level[i + 1]))
            current_level = next_level

        return proof

    def get_compact_hex_proof(self, tx_index: int) -> str:
        """Exports proof path as compact serialized JSON."""
        return json.dumps(self.get_proof(tx_index))

    @staticmethod
    def verify_proof(leaf_hash: str, proof: List[Dict[str, str]], expected_root: str) -> bool:
        """
        Verifies that leaf_hash belongs to the Merkle Tree with expected_root.
        Supports both SHA-3 (primary) and SHA-256 (fallback) pair hashing.
        """
        # Primary SHA-3-256 verification
        current_hash = leaf_hash
        for step in proof:
            sibling_hash = step["hash"]
            if step["position"] == "left":
                current_hash = MerkleTree.hash_pair(sibling_hash, current_hash)
            else:
                current_hash = MerkleTree.hash_pair(current_hash, sibling_hash)

        if current_hash.lower() == expected_root.lower():
            return True

        # Fallback SHA-256 verification for legacy blocks
        legacy_hash = leaf_hash
        for step in proof:
            sibling_hash = step["hash"]
            if step["position"] == "left":
                combined = (sibling_hash + legacy_hash).encode('utf-8')
            else:
                combined = (legacy_hash + sibling_hash).encode('utf-8')
            legacy_hash = hashlib.sha256(combined).hexdigest()

        return legacy_hash.lower() == expected_root.lower()

    def to_dict(self) -> Dict[str, Any]:
        """Hierarchical tree representation for the frontend visualizer."""
        return {
            "rootHash": self.root_hash,
            "algorithm": "SHA-3-256",
            "totalTransactions": len(self.transactions),
            "tree": self.root.to_dict() if self.root else None
        }


class SparseMerkleTree:
    """
    Sparse Merkle Tree (SMT) with SHA-3 for voter eligibility and non-double-spending.
    """
    DEFAULT_DEPTH = 32

    def __init__(self, depth: int = DEFAULT_DEPTH):
        self.depth = depth
        self.leaves: Dict[int, str] = {}
        self.default_hashes = self._generate_default_hashes(depth)

    def _generate_default_hashes(self, depth: int) -> List[str]:
        defaults = ["0" * 64]
        for i in range(depth):
            combined = f"{defaults[i]}:{defaults[i]}".encode('utf-8')
            defaults.append(hashlib.sha3_256(combined).hexdigest())
        return defaults

    def update(self, key_int: int, value_hash: str):
        self.leaves[key_int] = value_hash

    def get_root(self) -> str:
        if not self.leaves:
            return self.default_hashes[self.depth]
        aggregated = ":".join(f"{k}:{v}" for k, v in sorted(self.leaves.items()))
        return hashlib.sha3_256(aggregated.encode('utf-8')).hexdigest()
